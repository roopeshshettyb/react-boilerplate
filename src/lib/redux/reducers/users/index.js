import actionTypes from './ActionTypes.json';

const initialState = {

};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN:
            return {
                ...state, "login": true
            };
        case actionTypes.LOGOUT:
            return {
                ...state, "logout": true
            };
        default:
            return {
                ...state
            }
    }
};

export default userReducer;
