import { combineReducers } from 'redux';
import { loginReducer } from './auth/authReducer';



const rootReducer = combineReducers({
    userLogin : loginReducer
})

export default rootReducer;