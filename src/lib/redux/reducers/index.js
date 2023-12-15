// reducers/index.js
import { combineReducers } from 'redux';
import userReducer from './users';
import generalReducer from './general';

const rootReducer = combineReducers({
    users: userReducer,
    general: generalReducer
});

export default rootReducer;
