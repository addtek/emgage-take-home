import { createStore } from 'redux';
import {middleware} from './middleware';
import { reducers } from './reducer';

export const store = createStore(reducers, middleware);
