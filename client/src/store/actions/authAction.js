import axios from 'axios';
import {
  SIGNUP_SUCCESS,
  SIGNUP_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  SIGNIN_FAILED,
  SIGNIN_SUCCESS,
  SIGNOUT,
  CLEAR_PROFILE,
} from './constant';
import { setAlert } from './alertAction'
import { setAuthToken } from '../../utils/setTokenAuth';
import { getCurrentProfile } from './profileAction';


export const loadUser = () => async dispatch => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }

  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data.data
    });

    dispatch(getCurrentProfile());
  } catch (error) {
    console.error("error", error)
    // if (error.message && token) {
    //   const msg = error.response ? error.response.data.errors[0].msg : error.message;
    //   dispatch(
    //     setAlert(
    //       { title: 'Failed!', msg },
    //       'danger',
    //       3000
    //     )
    //   );
    // }
    dispatch({ type: AUTH_ERROR })
  }
}

// signup user
export const signupUser = ({ name, email, password }) => dispatch => new Promise(async (resolve, reject) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ name, email, password });

  try {
    const response = await axios.post('/api/users', body, config);
    dispatch({
      type: SIGNUP_SUCCESS,
      payload: response.data.data
    });
    // dispatch(
    //   setAlert(
    //     { title: 'Success!', msg: 'You have successfully signed up' },
    //     'success'
    //     , 3000
    //   )
    // );
    dispatch(loadUser())
    resolve(response.data.data);
  } catch (error) {
    dispatch({ type: SIGNUP_FAILED });
    if (error.message && !error.response) {
      const msg = error.response.data.errors[0].msg || error.message;
      dispatch(
        setAlert(
          { title: 'Failed!', msg },
          'danger',
          3000
        )
      );
      return reject();
    }

    reject(error.response.data);
  }
});

// signin user
export const signinUser = ({ email, password }) => dispatch => new Promise(async (resolve, reject) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ email, password });

  try {
    const response = await axios.post('/api/auth', body, config);
    dispatch({
      type: SIGNIN_SUCCESS,
      payload: response.data.data
    });
    // dispatch(
    //   setAlert(
    //     { title: 'Success!', msg: 'You have successfully signed up' },
    //     'success'
    //     , 3000
    //   )
    // );
    dispatch(loadUser())
    resolve(response.data.data);
  } catch (error) {
    dispatch({ type: SIGNIN_FAILED });
    if (error.message && !error.response) {
      const msg = error.response.data.errors[0].msg || error.message;
      dispatch(
        setAlert(
          { title: 'Failed!', msg },
          'danger',
          3000
        )
      );
      return reject();
    }

    reject(error.response.data);
  }
});


export const signout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: SIGNOUT });
}