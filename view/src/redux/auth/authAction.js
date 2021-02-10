import axios from 'axios';
import { LOGIN_REQUEST, LOGIN_REQUEST_OK, LOGIN_REQUEST_FAIL, REGISTER_REQUEST_FAIL, REGISTER_REQUEST, REGISTER_REQUEST_OK } from '../types.js';


export const loginAction = (username, password) => async (dispatch) => {
    try{

        dispatch({
            type: LOGIN_REQUEST
        })

        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }

        const { data } = await axios.post('http://localhost:5000/api/user/login', { username, password }, config)

        dispatch({
            type: LOGIN_REQUEST_OK,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    }catch(error){
        dispatch({
            type: LOGIN_REQUEST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}


export const registerAction = ( username, password ) => async (dispatch) => {
    try{

        dispatch({
            type: REGISTER_REQUEST
        })

        const config = {
            headers: {
                'Content-Type' : 'application/json'
            }
        }

        const { data } = await axios.post('http://localhost:5000/api/user/register', { username, password }, config)

        dispatch({
            type: REGISTER_REQUEST_OK,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))


    }catch(error){
        dispatch({
            type: REGISTER_REQUEST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}