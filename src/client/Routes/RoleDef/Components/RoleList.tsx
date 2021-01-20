import * as React from 'react';
import { themr, ThemedComponentClass } from '@friendsofreactjs/react-css-themr';
import { classNames } from '@shopify/react-utilities';

import { AllowedEntityStatusColor, IRoleDef } from '../../../Types/Domain';

import DrawerSpinner from '../../../Common/Components/DrawerSpinner';

import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  FlexBox,
  Column,
  Heading,
  Icon,
  Table,
  TextField,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalContent,
} from 'engage-ui';

import {
  getAllowedMemberType,
  getBadgeStatus,
  getStatus,
  arrayNotEmpty,
} from '../../../Common/Utilities';

import { IRoleListState } from './RoleListState';
import { IRoleListProp } from './RoleListProp';
import { ROLE } from '../../../ThemeIdentifiers';

import * as baseTheme from '../Styles/RoleList.scss';
import * as TableStyle from '../../../Theme/Table.scss';
import * as CommonStyle from '../../../Theme/ListTheme.scss';
import Api from '../../../service/api';
import { AxiosResponse } from 'axios';

// initialize Api HTTP client
const API = Api.getInstance();

// debounce timeout
let debounceTimeout;
/**
 * Component to display role def list & show different actions like filter, delete, individual actions
 * @extends React.Component
 */
class RoleListComponent extends React.Component<IRoleListProp, IRoleListState> {
  // sortQuery: string = '[{"id":{"order":"desc"}}]';
  /*
    label: Table header lable which will be visible
    key: Match it with json data, this will help to get specific value from the data
    headerValue: In case of custom component, if any value is required, here it can be stored
    classname: any custom classname, this can be used to set width or any other style
    style: same like class but for inline styling
    noSort: if sorting="all" & we want to disable sorting of specifc column
    sort: Enable sorting for specific column
    injectBody: To inject custom component in td
    injectHeader: To inject custom component in th
  */
  private nestedColumnConfig: Array<{}> = [
    {
      label: 'ID',
      key: 'id',
      className: 'docId',
      sortBy: 'keyword',
      style: { width: '100px' },
    }, {
      label: 'Name',
      key: 'name',
      className: '',
      sortBy: 'keyword',
      style: { width: '160px' },
    }, {
      label: 'Description',
      key: 'description',
      noSort: true,
      style: { width: '300px' },
    }, {
      label: 'Status',
      key: 'entityState',
      style: { width: '120px' },
      sortBy: 'itemID',
      injectBody: (value: IRoleDef) =>
        <Badge working={value.processing} status={AllowedEntityStatusColor[value.processing ? 8 : getBadgeStatus(value)]}>{value.processing ? value.processing : getStatus(value)}</Badge>,
    }, {
      label: 'Type',
      key: 'allowedMemberTypes',
      style: { width: '215px' },
      sortBy: 'itemID',
      injectBody: (value: IRoleDef) => getAllowedMemberType(value.allowedMemberTypes),
    },
  ];
  private bulkActions: Array<{}> = [
    {
      componentId: 'edit',
      content: <label>Edit</label>,
      active: true,
      disabled: false,
      divider: true,
      header: false,
      onClick: () => this.setBulkAction('edit'),
    },
    {
      componentId: 'delete',
      content: <label>Delete</label>,
      active: true,
      disabled: false,
      divider: true,
      header: false,
      onClick: () => this.setBulkAction('delete'),
    },
    {
      componentId: 'publish',
      content: <label>Publish</label>,
      active: true,
      disabled: false,
      divider: true,
      header: false,
      onClick: () => this.setBulkAction('publish'),
    },
  ];
  constructor(props: IRoleListProp) {
    super(props);
    this.state = {
      actionInProgress: false,
      activeEntityId: 0,
      appDefId: 0,
      bulkAction: {
        selectedRow: [],
        action: null,
        performingAction: false,
      },
      callBackAction: undefined,
      callChildCallback: false,
      dropdownEle: {},
      editMember: false,
      filterConfig: {
        searchKey: '',
        search: false,
        field: 'name',
      },
      hideRow: { },
      loadingRole: false,
      nestedChildData: [],
      showDeleted: false,
      showPublished: true,
      showInternalExternal: true,
      showExternal: true,
      showInternalExternalAnonymous: true,
      showInternal: true,
      showAnonymous: true,
      showModal: false,
      modalContent: {
        Content: null,
      },
    };
  }

  // Perform initial action after component has been loaded into the DOM
  componentDidMount() {
    this.loadRoleDefs(this.roleDefSearchQueryBuilder());
  }
  // make api call
  async loadRoleDefs(query: {}) {
    this.toggleLoading();
    await API.getRoleList(query, this.onGotRoleDefs, this.onGetRoleDefsError);
  }
  // Callback function for updating roleDefs
  onGotRoleDefs = (res: AxiosResponse<any>) => {
    this.props.initRoleList(res.data.hits.hits.map((role) => role._source));
    this.toggleLoading();
  }
  // Callback function for after roleDefs delete action success
  onRoleDefsDeleted = (res: AxiosResponse<any>) => {
    this.setState({bulkAction: {selectedRow: [], performingAction: false, action : null}});
    this.loadRoleDefs(this.roleDefSearchQueryBuilder());
  }
  // Callback function for updating roleDefs
  onGetRoleDefsError = (reason: any) => {
    this.toggleLoading();
  }
  // toggle loading state
  toggleLoading() {
    this.setState(prevState => ({loadingRole: !prevState.loadingRole}));
  }
  // Callback function when any row gets selected
  handleSelectRowCallback = (val: React.ReactText[]) => this.selectedRowsState(val);

  // Toggle dropdowns present in this component
  toggleDropdown = (event: React.FormEvent<HTMLElement>, currentDropdown: string) => {
    this.setState({
      dropdownEle: { [currentDropdown]: event.currentTarget as HTMLElement },
    });
  }

  // set select rows state
  selectedRowsState = (rows: Array<number | string>) => this.setState(prevState => ({bulkAction: {...prevState.bulkAction, selectedRow: rows, action: !arrayNotEmpty(rows) ? null : prevState.bulkAction.action}}));

  // Apply bulk action
  setBulkAction = (actionType: string) => {
    this.setState(prev => ({bulkAction: {...prev.bulkAction, action: actionType}})) ;
  }

  // Apply Bulk action
  applyBulkAction = () => {
    const {action} = this.state.bulkAction;
    if (action === 'delete') {
    this.setState({
      showModal: true,
      modalContent: {
        Header: (
          <FlexBox direction="Row" justify="Start">
          <Column small="1-2">
            <Icon source="alert" componentColor="red"/>
          </Column>
          <Column large="2-6"><Label>Warning</Label></Column>
          </FlexBox>),
        Content: (
        <Column large="4-6">
          <FlexBox direction="Row" justify="Center">
            <Column large="6-6"><Label>Are You sure you want to delete this Role Definiton?</Label></Column>
          </FlexBox>
        </Column>),
        Footer: (
          <FlexBox direction="Row" justify="SpaceBetween">
            <Button componentSize="slim" onClick={this.closeModal}>Cancel</Button>
            <Button componentSize="slim" onClick={() => this.deleteOrPublishRoleDef(true)}>Delete</Button>
          </FlexBox>
        ),
      },
    });
  } else if (action === 'publish') {
    this.deleteOrPublishRoleDef();
  }
  }
  // query builder
  roleDefSearchQueryBuilder(): {} {
    const { showInternal, showExternal, showDeleted, showPublished, showAnonymous, showInternalExternal, showInternalExternalAnonymous, filterConfig } = this.state;
    let statusIDs = [showPublished && 5, showDeleted && 7];
    let typeIDs = [showAnonymous && 4, showInternalExternal && 3, showInternal && 1, showExternal && 2, showInternalExternalAnonymous && 7];
    const must: Array<{}> = [];
    const filterQuery: {} = {};
    let filter: {} = {};
    statusIDs = statusIDs.filter((v) => Number.isInteger(v));
    typeIDs = typeIDs.filter((v) => Number.isInteger(v));
    if (statusIDs.length > 0) {
      must.push({
        terms: {'entityState.itemID': statusIDs},
     });
    }
    if (typeIDs.length > 0) {
      must.push({
        terms: {'allowedMemberTypes.itemID': typeIDs},
     });
    }
    if (filterConfig.searchKey) {
      filter = {
        query_string: {
          query: `*${filterConfig.searchKey}*`,
          fields: [filterConfig.field],
        },
      };
      filterQuery['filter'] = filter;
    }
    filterQuery['must'] = must;
    return {
      from : 0, size : 20,
      query: { bool: filterQuery}};
  }
  // Set Role Def filters
  onFilterRoleDefs = (val: boolean, field: string) => {
    const state = {[field]: val};
    this.setState(prev => ({...prev, ...state}));
  }

  // Apply Role Defs filter
  onApplyFilter(clear?: boolean) {
    if (clear) {
      this.setState({ showInternal: false, showExternal: false, showDeleted: false, showPublished: false, showAnonymous: false, showInternalExternal: false, showInternalExternalAnonymous: false});
    }
    this.loadRoleDefs(this.roleDefSearchQueryBuilder());
    this.setState(prev => ({dropdownEle: {...prev.dropdownEle, ['filter']: null },
    }));
  }

  // called when search in text field value changes
  onSearchInputChange = (value: string) => {
    this.debounceSearch(() => this.setState(prevState => ({filterConfig: {...prevState.filterConfig, searchKey: value}}),
    async () => {
        const {searchKey} = this.state.filterConfig;
        if (searchKey.length >= 3 || !searchKey.length) {
       await this.loadRoleDefs(this.roleDefSearchQueryBuilder());
        }
      }));
  }

  // search debounce
  debounceSearch(callback: () => void, duration?: number) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(callback, duration ? duration : 1000);
  }

  // Close Modal
  closeModal = () => this.setState({modalContent: {Content: null}, showModal: false});

  // Action Query Builder
  bulkActionQueryBuilder = () => {
    // TODO: Complete this function
    API.updateRoleDef(
      {
        script : {
          source: 'ctx._source.entityState = params',
          params: {
            itemID: 5,
            itemName: 'Published',
            enumURI: 'EntityState',
            itemDescription: null,
            itemURI: 'Published',
          },
        },
      },
      () => null,
    );
  }
  // Delete Role
  deleteOrPublishRoleDef = async (remove ?: boolean) => {
    const deleteSate =  {
      enumURI: 'EntityState',
      itemDescription: null,
      itemID: 7,
      itemName: 'Deleted',
      itemURI: 'Deleted',
    };
    const publishedSate = {
      itemID: 5,
      itemName: 'Published',
      enumURI: 'EntityState',
      itemDescription: null,
      itemURI: 'Published',
    };
    this.closeModal();
    this.setState(prev => ({bulkAction: {...prev.bulkAction, performingAction: true}}));
    await API.softDeleteRoleDef({
      query: {
        bool: {
          must: {
          terms: {id: this.state.bulkAction.selectedRow},
        },
      },
      },
      script: {
        lang: 'painless',
        source: 'ctx._source.entityState = params.newState',
        params: {
        newState: remove ? deleteSate : publishedSate,
        },
      },
    }, this.onRoleDefsDeleted);
  }
  /**
   * Render the component to the DOM
   * @returns {}
   */
  render() {
    const { actionInProgress, showModal, modalContent, bulkAction, dropdownEle, filterConfig, hideRow, loadingRole, showDeleted } = this.state;
    const {
      roleDefs,
      theme,
    } = this.props;

    const searchFieldStyle = classNames(
      theme.commonLeftMargin,
      theme.searchField,
    );

    return (
      <FlexBox justify="Center">
        <Column medium="4-4">
          <div className={theme.pageContainer}>
            <Heading element="h2" theme={CommonStyle}>Roles
              <Button
                componentSize="slim"
                componentStyle={{marginLeft: '20px'}}
                primary={true}
                onClick={() => null}
                disabled={loadingRole}
              >
              <Label>Add New Role</Label>
              </Button>
            </Heading>

            <FlexBox
              direction="Row"
              align="Start"
              justify="Start"
              componentClass={theme.tableActions}
            >
              <div>
                <Button
                  componentSize="large"
                  disclosure={true}
                  onClick={(event: React.FormEvent<HTMLElement>) => this.toggleDropdown(event, 'bulkAction')}
                  disabled={!arrayNotEmpty(bulkAction.selectedRow)}
                >
                  {bulkAction.action && arrayNotEmpty(bulkAction.selectedRow) ? bulkAction.action.toUpperCase() : 'Bulk Actions'} {arrayNotEmpty(bulkAction.selectedRow) ? `(${bulkAction.selectedRow.length})` : ''}
                </Button>

                <Dropdown
                  dropdownItems={this.bulkActions}
                  anchorEl={dropdownEle.bulkAction}
                  preferredAlignment="left"
                />
                <Button
                  componentSize="large"
                  componentStyle={{marginLeft: '5px'}}
                  onClick={this.applyBulkAction}
                  disabled={!arrayNotEmpty(bulkAction.selectedRow) || !bulkAction.action}
                >
                  <Label>Apply</Label>
                </Button>
                <Modal
                  active ={showModal}
                  componentWidth = "small"
                  closeOnBackgroud={true}
                  closeOnEsc={true}
                  toggle={this.closeModal}
                >
                  <ModalBody>
                    <ModalHeader>{modalContent.Header}</ModalHeader>
                    <ModalContent active ={showModal}>
                      {modalContent.Content}
                    </ModalContent>
                    <ModalFooter>{modalContent.Footer}</ModalFooter>
                  </ModalBody>
                </Modal>
              </div>
              <div className={searchFieldStyle}>
                <TextField
                  disabled = {!arrayNotEmpty(roleDefs)}
                  label="Find a Role..."
                  suffix={<Icon source="search" componentColor="inkLighter"/>}
                  value={filterConfig.searchKey}
                  onChange={this.onSearchInputChange}
                />
              </div>

              <div className={theme.commonLeftMargin}>
                <Button
                  disabled={actionInProgress}
                  componentSize="large"
                  icon="filter"
                  onClick={(event: React.FormEvent<HTMLElement>) => this.toggleDropdown(event, 'filter')}
                />

                <Dropdown
                  dropdownItems={this.bulkOptions()}
                  anchorEl={dropdownEle.filter}
                  closeOnClickOption = {false}
                  preferredAlignment="right"
                />
              </div>
            </FlexBox>
            {
              roleDefs &&
                <Table
                  actionInProgress={actionInProgress}
                  columnFirstChildWidth="25px"
                  hideRow={hideRow}
                  bordered={true}
                  highlight={true}
                  sorting="all"
                  data={roleDefs}
                  column={this.nestedColumnConfig}
                  filterData={filterConfig}
                  rowAction={[]}
                  rowCallbackValue="id"
                  selectRow="checkbox"
                  selectRowCallback={this.handleSelectRowCallback}
                  theme={TableStyle}
                />
            }
            {
            (loadingRole || bulkAction.performingAction) &&
              <div className={theme.spinnerContainer}>
                <DrawerSpinner componentClass={theme.espinner} spinnerText={loadingRole ? 'Loading Roles' : bulkAction.performingAction ? 'Performing Action' : 'Loading'}  />
              </div>
          }
          </div>
        </Column>
      </FlexBox>
    );
  }

  // function needs to be called on onChange for checkBox
  private bulkOptions = () => {
    const {theme} = this.props;
    const {loadingRole, showInternal, showExternal, showDeleted, showPublished, showAnonymous, showInternalExternal, showInternalExternalAnonymous} = this.state;
    return [
      {
        content: <Label>Status</Label>,
      },
      {
        divider: true,
        content:  (
        <FlexBox><Column>
        <FlexBox
          direction="Row"
          align="Start"
          justify="Start"
        >
        <Column small="2-4"><div className={theme.commonLeftMargin}><Checkbox label={'Show Published'} checked={showPublished} onChange={(val: boolean) => this.onFilterRoleDefs(val, 'showPublished')}/>
        </div></Column>
        <Column small="2-4"><div className={theme.commonLeftMargin}><Checkbox label={'Show Deleted'} checked={showDeleted} onChange={(val: boolean) => this.onFilterRoleDefs(val, 'showDeleted')}/>
        </div></Column>
        </FlexBox>
      </Column>
      </FlexBox>),
      },
      {
        content: <Label>Role Type</Label>,
      },
      {
        divider: true,
        content: (
        <FlexBox><Column><FlexBox
          direction="Row"
          align="Start"
          justify="Start"
        >
        <Column small="2-4"><div className={theme.commonLeftMargin}><Checkbox label={'Internal or External'} checked={showInternalExternal} onChange={(val: boolean) => this.onFilterRoleDefs(val, 'showInternalExternal')}/></div></Column>
        <Column small="2-4"><div className={theme.commonLeftMargin}><Checkbox label={'Internal'} checked={showExternal} onChange={(val: boolean) => this.onFilterRoleDefs(val, 'showExternal')}/></div></Column>
        <Column small="2-4"><div className={theme.commonLeftMargin}><Checkbox label={'Internal, External or Anonymous'} checked={showInternalExternalAnonymous} onChange={(val: boolean) => this.onFilterRoleDefs(val, 'showInternalExternalAnonymous')}/>
        </div></Column>
        </FlexBox>
        <FlexBox
          direction="Row"
          align="Start"
          justify="Start"
        >
        <Column small="2-4"><div className={theme.commonLeftMargin}><Checkbox label={'Internal'} checked={showInternal} onChange={(val: boolean) => this.onFilterRoleDefs(val, 'showInternal')}/></div></Column>
        <Column small="2-4"><div className={theme.commonLeftMargin}><Checkbox label={'Anonymous'} checked={showAnonymous} onChange={(val: boolean) => this.onFilterRoleDefs(val, 'showAnonymous')}/></div></Column>
        </FlexBox></Column></FlexBox>
        ),
      },
      {
        content:  (
        <FlexBox
          direction="Row"
          align="Center"
          justify="SpaceBetween"
        >
        <Column small="2-4"><div className={theme.commonLeftMargin}>
          <Button
                componentSize="slim"
                primary={true}
                onClick={() => this.onApplyFilter(true)}
                disabled={loadingRole}
          >
              <Label>Clear</Label>
          </Button>
        </div></Column>
        <Column small="2-4"><div className={theme.commonLeftMargin}>
          <Button
                componentSize="slim"
                primary={true}
                onClick={() => this.onApplyFilter()}
                disabled={loadingRole}
          >
              <Label>Apply</Label>
          </Button>
        </div></Column>
        </FlexBox>),
      },
  ];
  }
}

export default themr(ROLE, baseTheme)(RoleListComponent) as ThemedComponentClass<IRoleListProp, IRoleListState>;
