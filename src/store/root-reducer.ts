import { combineReducers } from 'redux';

import assetsReducer from './assets/reducers';

const rootReducer = combineReducers({
  assets: assetsReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>
