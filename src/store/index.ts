import { createStore } from 'redux';
import { rootConfig, rootReducer } from './root-reducer';
import {persistReducer} from "redux-persist";

const persisted = persistReducer(rootConfig, rootReducer);
const store = createStore(persisted);

export default store;
