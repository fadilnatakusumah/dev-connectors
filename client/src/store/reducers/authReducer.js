import {
  SIGNUP_FAILED,
  SIGNUP_SUCCESS,
  SIGNIN_FAILED,
  SIGNIN_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  SIGNOUT,
} from '../actions/constant';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
}

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case SIGNUP_SUCCESS:
    case SIGNIN_SUCCESS:
      localStorage.setItem('token', payload);
      return {
        ...state,
        token: payload,
        isAuthenticated: true,
        loading: false,
      };
    case SIGNUP_FAILED:
    case SIGNIN_FAILED:
    case SIGNOUT:
    case AUTH_ERROR:
      localStorage.removeItem('token');
      return {
        ...initialState,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }

}