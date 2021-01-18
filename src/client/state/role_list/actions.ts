import { IRoleDef } from '../../Types/Domain';
import { ROLELIST, UPDATEROLELIST, REMOVEROLELIST } from './reducer';
import {RoleListActionType} from './types';

export function PopulateRoles(payload: IRoleDef[]): RoleListActionType {
    return {
        type: ROLELIST,
        payload,
    };
}
export function UpdateRoles(payload: IRoleDef[]): RoleListActionType {
    return {
        type: UPDATEROLELIST,
        payload,
    };
}
export function RemoveRole(payload: IRoleDef[]): RoleListActionType {
    return {
        type: REMOVEROLELIST,
        payload,
    };
}
