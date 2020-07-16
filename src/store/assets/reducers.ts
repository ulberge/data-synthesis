import { Asset } from 'MyModels';
import { combineReducers } from 'redux';
import { createReducer, ActionType } from 'typesafe-actions';

import { addAssets, removeAssets } from './actions';

export const assets = createReducer([] as Asset[])
  .handleAction(addAssets, (state: Asset[], action: ActionType<typeof addAssets>) => {
    return [...state, ...action.payload];
  })
  .handleAction(removeAssets, (state: Asset[]) => {
    return [];
  });

const assetsReducer = combineReducers({
  assets,
});

export default assetsReducer;
export type AssetsState = ReturnType<typeof assetsReducer>;
