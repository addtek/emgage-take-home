import { RoleListActionType } from '../../../state/role_list/types';
import { IRoleDef } from '../../../Types/Domain/Role';
export interface IRoleListProp {
  roleDefs: IRoleDef[];
  theme?: any;
  dispatch: any;
  initRoleList: (data: IRoleDef[]) => RoleListActionType;
}
