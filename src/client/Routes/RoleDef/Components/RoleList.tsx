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
} from 'engage-ui';

import {
  checkIFDeleted,
  getAllowedMemberType,
  getBadgeStatus,
  getStatus,
  hasRolesDefs,
} from '../../../Common/Utilities';

import { IBulkActionTypeAction, IRoleListState } from './RoleListState';
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
  sortQuery: string = '[{"id":{"order":"desc"}}]';
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
      onClick: () => this.applyAction('edit'),
    },
    {
      componentId: 'delete',
      content: <label>Delete</label>,
      active: true,
      disabled: false,
      divider: true,
      header: false,
      onClick: () => this.applyAction('delete'),
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
        // actions: [],
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
    };
  }

  // Perform initial action after component has been loaded into the DOM
  componentDidMount() {
    this.loadRoleDefs({
      from : 0, size : 20,
      query: {
        bool : {
          must : [
            {term: {'entityState.itemID': 5}},
          ],
        },
      },
    });
  }
  // make api call
  loadRoleDefs(query: {}) {
    this.toggleLoading();
    API.getRoleList(query, this.onGotRoleDefs, this.onGetRoleDefsError);
  }
  // Callback function for updating roleDefs
  onGotRoleDefs = (res: AxiosResponse<any>) => {
    this.toggleLoading();
    this.props.initRoleList(res.data.hits.hits.map((role) => role._source));
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
  selectedRowsState = (rows: Array<number | string>) => this.setState(prevState => ({bulkAction: {...prevState.bulkAction, selectedRow: rows}}));

  // Apply bulk action
  applyAction = (actionType: string) => {
    return ;
  }

  // Show deleted Roles
  onShowDeleted = (val: boolean) => {
    this.setState({showDeleted: val});
    this.loadRoleDefs({
      from : 0, size : 20,
      query: {
        bool : val ? {
          should : [
            {term: {'entityState.itemID': 5}},
            val && {term: {'entityState.itemID': 7}},
          ],
        } : {
          must : [
            {term: {'entityState.itemID': 5}},
          ],
        },
      },
    });
  }
  // called when search in text field value changes
  onSearchInputChange = (value: string, e: React.FormEvent<HTMLElement>) => {
    this.debounceSearch(() => this.setState(prevState => ({filterConfig: {...prevState.filterConfig, searchKey: value, search: value.length >= 3}})));
  }
  // search debounce
  debounceSearch(callback: () => void, duration: number = 1000) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(callback, duration);
  }
  // on search icon clicked
  filterRoleDefs = () => {
    this.setState(prevState => ({filterConfig: {...prevState.filterConfig, search: prevState.filterConfig.searchKey.length >= 3}}));
  }

  /**
   * Render the component to the DOM
   * @returns {}
   */
  render() {
    const { actionInProgress, bulkAction, dropdownEle, filterConfig, hideRow, loadingRole, showDeleted } = this.state;
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
            <Heading element="h2" theme={CommonStyle}>Roles</Heading>

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
                  disabled={!bulkAction.selectedRow.length}
                >
                  Bulk Actions {bulkAction.selectedRow.length ? `(${bulkAction.selectedRow.length})` : ''}
                </Button>

                <Dropdown
                  dropdownItems={this.bulkActions}
                  anchorEl={dropdownEle.bulkAction}
                  preferredAlignment="left"
                />
              </div>

              <div className={searchFieldStyle}>
                <TextField
                  disabled = {!hasRolesDefs(roleDefs)}
                  label="Find a Role..."
                  suffix={<Icon source="search" componentColor="inkLighter" onClick={this.filterRoleDefs}/>}
                  value={filterConfig.searchKey}
                  onChange={this.onSearchInputChange}
                />
              </div>

              <div className={theme.commonLeftMargin}>
                <Button
                  disabled={actionInProgress}
                  componentSize="large"
                  icon="horizontalDots"
                  onClick={(event: React.FormEvent<HTMLElement>) => this.toggleDropdown(event, 'filter')}
                />

                <Dropdown
                  dropdownItems={this.bulkOptions()}
                  anchorEl={dropdownEle.filter}
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
            loadingRole &&
              <div className={theme.spinnerContainer} style={!hasRolesDefs(roleDefs) ? {marginTop: '150px'} : {}}>
                <DrawerSpinner componentClass={theme.espinner} spinnerText="Loading Roles"  />
              </div>
          }
          </div>
        </Column>
      </FlexBox>
    );
  }

  // function needs to be called on onChange for checkBox
  private bulkOptions = () => {
    return [{
      content: <Checkbox label={'Show Deleted'} checked={this.state.showDeleted} onChange={this.onShowDeleted}/>,
    }];
  }
}

export default themr(ROLE, baseTheme)(RoleListComponent) as ThemedComponentClass<IRoleListProp, IRoleListState>;
