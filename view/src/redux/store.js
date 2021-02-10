import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';


const userInfoStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const initalState = {
    userLogin : { userInfo: userInfoStorage }
};

const middleware = [thunk];

const store = createStore(rootReducer, initalState, composeWithDevTools(applyMiddleware (...middleware)));

export default store;