import { Asset } from 'MyModels';
import { createAction } from 'typesafe-actions';

let nextId = 0;

// export interface IAddAction {
//    type: SettingsActionTypes.FETCH_SUCCESS;
// }

export const addAssets = createAction('ADD_ASSETS', (files: File[]) => {
  return files.map(file => ({ file, id: ++nextId + '' }));
})<Asset[]>();
