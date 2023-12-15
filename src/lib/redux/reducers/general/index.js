import actionTypes from './ActionTypes.json';
import constants from '../../../../config/constants';

const initialState = constants;

const generalReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_CONSTANTS:
            return { ...state, ...action.payload };
        default:
            return {
                ...state
            }
    }
};

export default generalReducer;
