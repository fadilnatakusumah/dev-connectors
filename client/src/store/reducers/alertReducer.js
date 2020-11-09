import { SET_ALERT, REMOVE_ALERT } from '../actions/constant';

const InitialState = null;

export default function (state = InitialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return {
        ...state,
        ...payload
      }
    case REMOVE_ALERT:
      return InitialState;
    default:
      return state;
  }
}