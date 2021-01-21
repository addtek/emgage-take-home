export interface IBulkActionTypeAction {
  // Unique ID
  componentId?: string;
  content?: React.ReactNode;
  // Show or hide the Dropdown.
  active?: boolean;
  // Disable the dropdown
  disabled?: boolean;
  // To differentiate items in dropdown
  divider?: boolean;
  // Header of item to render in dropdown
  header?: boolean;
  // Callback function to be called when dropdown gets clicked
  onClick?(data: any): void;

}
interface IBulkActionType {
  selectedRow: Array<number | string>;
  action: string;
  performingAction: boolean;
}

interface IFilterType {
  searchKey: string;
  search: boolean;
  field: string;
}

interface IDropdownType {
  bulkAction?: HTMLElement;
  filter?: HTMLElement;
  [key: string]: HTMLElement;
}

interface IHideRowType {
  entityState?: {};
}

export interface ITableNestedData {
  rowId: number | string;
  component: any;
}

export interface IRoleListState {
    // Boolean to call the child callback function
    callChildCallback: boolean;
    // Get the dropdown triger element reference
    dropdownEle: IDropdownType;
    // Keys needed for searching specific data
    filterConfig: IFilterType;
    // Inidicates Roles Defs are loading
    loadingRole: boolean;
    // OPen the edit drawer
    editMember: boolean;
    // THis helps to implement show deleted functionality
    // It as key of the data & its value which we want to hide
    hideRow: IHideRowType;
    // State to store nestedchild component which will be shown on row expand
    nestedChildData: ITableNestedData[];
  // Show action In progress
    actionInProgress: boolean;
  // Active Entitiy for action
    activeEntityId: number;
  // Stores the app id of expanding row
    appDefId: number;
  // This key holds the bulk action options for the rows,
  // currently it have single key which is selectedRow, which holds selected row ids
    bulkAction: IBulkActionType;
  // show deleted roles
    showDeleted: boolean;
  // show published roles
    showPublished: boolean;
  // show Internal role type
    showInternal: boolean;
  // show Exernal role type
    showExternal: boolean;
  // show Internal or External role type
    showInternalExternal: boolean;
  // show Internal , External or Anonymous role type
    showInternalExternalAnonymous: boolean;
  // show Anonymous role type
    showAnonymous: boolean;
  // modal active
    showModal: boolean;
  // Callback action
    callBackAction?(callback: any): void;
}
