import { createStore, combineReducers } from 'redux';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createReducer, createAction, ActionType } from 'typesafe-actions';
import cuid from 'cuid';

import { Asset } from 'Models';

/**********************
* Assets Slice
**********************/
// Actions
export const addAssets = createAction('ADD_ASSETS', (dataURLs: string[]) => {
  return dataURLs.map(dataURL => ({ dataURL, id: cuid() }));
})<Asset[]>();
export const removeAssets = createAction('REMOVE_ASSETS')();
// Reducers
const items = createReducer([] as Asset[])
  .handleAction(addAssets,
                (state: Asset[], action: ActionType<typeof addAssets>) => {
                  return [...state, ...action.payload];
                })
  .handleAction(removeAssets, (state: Asset[]) => ([]));
const assetsReducer = combineReducers({
  items,
});
export type AssetsState = ReturnType<typeof assetsReducer>;
// Selector
export const getAssets = (state: AssetsState) => state.items;

/**********************
* Create Store
**********************/
const rootReducer = combineReducers({
  assets: assetsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
// Save app state to localStorage
const config = { key: 'data-synthesis', storage };
const persisted = persistReducer(config, rootReducer);
const store = createStore(persisted);
export default store;
