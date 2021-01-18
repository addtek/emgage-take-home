import { IRoleDef } from '../../Types/Domain';
import {RoleListActionType} from './types';
interface IRoleListSate {
    roleDefs: IRoleDef[];
}

const initialState: IRoleListSate = {
    roleDefs: [],
};
export const ROLELIST = 1;
export const REMOVEROLELIST = 2;
export const UPDATEROLELIST = 3;
export const roleListReducer = (state = initialState.roleDefs, action: RoleListActionType): IRoleDef[] => {
    switch (action.type) {
    case ROLELIST:
        return action.payload;
    case UPDATEROLELIST:
        return {...state, ...action.payload};
    case REMOVEROLELIST:
        return action.payload;

    default:
        return state;
}
};
