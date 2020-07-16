import { Asset } from 'MyModels';
import { createAction } from 'typesafe-actions';
import cuid from 'cuid';

export const addAssets = createAction('ADD_ASSETS', (dataURLs: string[]) => {
  return dataURLs.map(dataURL => ({ dataURL, id: cuid() }));
})<Asset[]>();

export const removeAssets = createAction('REMOVE_ASSETS')();
