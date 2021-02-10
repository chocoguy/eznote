import { LOGIN_REQUEST, LOGIN_REQUEST_OK, LOGIN_REQUEST_FAIL, LOGOUT, REGISTER_REQUEST, REGISTER_REQUEST_FAIL, REGISTER_REQUEST_OK } from '../types.js';

export const loginReducer = (state = {}, action) => {
    switch (action.type){
        case LOGIN_REQUEST:
            return { loading: true };
        case LOGIN_REQUEST_OK:
            return { loading: false, currentUser: action.payload  };
        case LOGIN_REQUEST_FAIL:
            return { loading: false, error: action.payload };
        case LOGOUT:
            return {}
        default:
            return state
    }
}


export const registerReducer = (state = {}, action) => {
    switch (action.type){
        case REGISTER_REQUEST:
            return { loading: true };
        case REGISTER_REQUEST_OK:
            return { loading: false, currentUser: action.payload  };
        case REGISTER_REQUEST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state
    }
}
