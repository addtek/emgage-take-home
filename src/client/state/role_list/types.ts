import { IRoleDef } from '../../Types/Domain';
import { REMOVEROLELIST, ROLELIST, UPDATEROLELIST } from './reducer';

interface IRoleListAction {
    type: typeof ROLELIST | typeof UPDATEROLELIST | typeof REMOVEROLELIST;
    payload: IRoleDef[];
}
interface IRoleListRemoveAction {
    type: typeof REMOVEROLELIST;
    payload: IRoleDef[];
}

export type RoleListActionType = IRoleListAction | IRoleListRemoveAction;
