import { GET_PROFILE_REPOS, CLEAR_PROFILE_DETAIL, GET_PROFILE_SUCCESS, PROFILE_ERROR, CLEAR_PROFILE, CREATE_PROFILE_SUCCESS, GET_PROFILE, ADD_EXPERIENCE_SUCCESS, REMOVE_EXPERIENCE_SUCCESS, GET_ALL_PROFILES, GET_ALL_PROFILES_SUCCESS, GET_PROFILE_DETAIL } from '../actions/constant';

const InitialState = {
  profile: null,
  profileDetail: null,
  profiles: [],
  repos: [],
  loading: true,
  errors: {}
};

export default function (state = InitialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
    case GET_ALL_PROFILES:
      return {
        ...state,
        loading: true,
      }
    case GET_PROFILE_SUCCESS:
    case CREATE_PROFILE_SUCCESS:
    case ADD_EXPERIENCE_SUCCESS:
    case REMOVE_EXPERIENCE_SUCCESS:
      return {
        ...state,
        profile: payload,
        loading: false,
      }
    case GET_ALL_PROFILES_SUCCESS:
      return {
        ...state,
        profiles: payload,
        loading: false,
      }
    case GET_PROFILE_DETAIL:
      return {
        ...state,
        profileDetail: payload,
        loading: false,
      }
    case GET_PROFILE_REPOS:
      return {
        ...state,
        repos: payload,
        loading: false,
      }
    case CLEAR_PROFILE_DETAIL:
      return {
        ...state,
        repos: [],
        profileDetail: null,
        loading: false,
      }
    case PROFILE_ERROR:
      return {
        ...state,
        errors: payload,
        loading: false,
      }
    case CLEAR_PROFILE:
      return { ...InitialState, loading: false, };
    default:
      return state;
  }
}