import { SET_ALERT, REMOVE_ALERT } from './constant';

export const setAlert = ({ title, msg }, type, timeout) => dispatch => {
  dispatch({
    type: SET_ALERT,
    payload: { title, msg, type },
  });

  if (timeout) {
    setTimeout(() => {
      dispatch({ type: REMOVE_ALERT });
    }, timeout);
  }
}

export const removeAlert = () => dispatch => {
  dispatch({ type: REMOVE_ALERT });
}