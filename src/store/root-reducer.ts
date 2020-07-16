import { combineReducers } from 'redux';
import assetsReducer from './assets/reducers';

import storage from "redux-persist/lib/storage";

export const rootConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['assets']
};

export const rootReducer = combineReducers({
  assets: assetsReducer,
});

export type RootState = ReturnType<typeof rootReducer>
