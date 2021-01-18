import { combineReducers } from 'redux';
import { roleListReducer } from './role_list/reducer';

export const reducers = combineReducers({
    roleDefs: roleListReducer,
   });

export type RootState = ReturnType<typeof reducers>;
