import axios from "axios"
import { setAlert, removeAlert } from './alertAction';
import {
  GET_PROFILE_SUCCESS,
  PROFILE_ERROR,
  CREATE_PROFILE_SUCCESS,
  CREATE_PROFILE_FAILED,
  GET_PROFILE,
  ADD_EXPERIENCE_SUCCESS,
  REMOVE_EXPERIENCE_SUCCESS,
  ADD_EDUCATION_SUCCESS,
  GET_ALL_PROFILES,
  GET_ALL_PROFILES_SUCCESS,
  GET_PROFILE_DETAIL,
  CLEAR_PROFILE_DETAIL,
  GET_PROFILE_REPOS
} from "./constant";


// get current user profile
export const getCurrentProfile = () => async dispatch => {
  dispatch(removeAlert());
  dispatch({ type: GET_PROFILE })

  try {
    const response = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE_SUCCESS,
      payload: response.data.data
    });

  } catch (error) {
    console.error("error", error);
    // if (error.message) {
    //   const msg = error.response ? error.response.data.errors[0].msg : error.message;
    //   dispatch(
    //     setAlert(
    //       { title: 'Failed!', msg },
    //       'danger',
    //       3000,
    //     )
    //   );
    // }
    dispatch({ type: PROFILE_ERROR });
  }
}

// create or update
export const updateProfile = (form) => dispatch => new Promise(async (resolve, reject) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify(form);

  try {
    const response = await axios.post('/api/profile', body, config);
    dispatch({
      type: CREATE_PROFILE_SUCCESS,
      payload: response.data.data
    });
    dispatch(
      setAlert(
        { title: 'Success!', msg: `You have successfully ${form.isUpdate ? "updated" : "created"} profile` },
        'success'
        // , 3000
      )
    );
    resolve(response.data.data);
  } catch (error) {
    dispatch({ type: CREATE_PROFILE_FAILED });
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

// add experience
export const addExperience = (form) => dispatch => new Promise(async (resolve, reject) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify(form);

  try {
    const response = await axios.put('/api/profile/experience', body, config);
    dispatch({
      type: ADD_EXPERIENCE_SUCCESS,
      payload: response.data.data
    });
    dispatch(
      setAlert(
        { title: 'Success!', msg: `You have successfully added your experience` },
        'success'
        , 3000
      )
    );
    resolve(response.data.data);
  } catch (error) {
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
})

// delete experience
export const deleteExperience = (id) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    const response = await axios.delete(`/api/profile/experience/${id}`, null, config);
    dispatch({
      type: REMOVE_EXPERIENCE_SUCCESS,
      payload: response.data.data
    });
    dispatch(
      setAlert(
        { title: 'Success!', msg: `You have successfully removed your experience` },
        'success'
        , 3000
      )
    );
  } catch (error) {
    if (error.message && !error.response) {
      const msg = error.response.data.errors[0].msg || error.message;
      dispatch(
        setAlert(
          { title: 'Failed!', msg },
          'danger',
          3000
        )
      );
    }
  }
}


// add education
export const addEducation = (form) => dispatch => new Promise(async (resolve, reject) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify(form);

  try {
    const response = await axios.put('/api/profile/education', body, config);
    dispatch({
      type: ADD_EDUCATION_SUCCESS,
      payload: response.data.data
    });
    dispatch(
      setAlert(
        { title: 'Success!', msg: `You have successfully added your education` },
        'success'
        , 3000
      )
    );
    resolve(response.data.data);
  } catch (error) {
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
})

// delete education
export const deleteEducation = (id) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    const response = await axios.delete(`/api/profile/education/${id}`, null, config);
    dispatch({
      type: REMOVE_EXPERIENCE_SUCCESS,
      payload: response.data.data
    });
    dispatch(
      setAlert(
        { title: 'Success!', msg: `You have successfully removed your education` },
        'success'
        , 3000
      )
    );
  } catch (error) {
    if (error.message && !error.response) {
      const msg = error.response.data.errors[0].msg || error.message;
      dispatch(
        setAlert(
          { title: 'Failed!', msg },
          'danger',
          3000
        )
      );
    }
  }
}


// get profiles
export const getProfiles = () => async dispatch => {
  dispatch({ type: GET_ALL_PROFILES })
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    const response = await axios.get(`/api/profile`, null, config);
    dispatch({
      type: GET_ALL_PROFILES_SUCCESS,
      payload: response.data.data
    });
  } catch (error) {
    if (error.message && !error.response) {
      const msg = error.response.data.errors[0].msg || error.message;
      dispatch(
        setAlert(
          { title: 'Failed!', msg },
          'danger',
          3000
        )
      );
    }
  }
}

export const selectProfile = (profile) => async dispatch => {
  dispatch({
    type: GET_PROFILE_DETAIL,
    payload: profile
  });
}

export const profileRepos = (username) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const response = await axios.get(`/api/profile/github/${username}`, null, config);
    dispatch({
      type: GET_PROFILE_REPOS,
      payload: response.data.data
    });
  } catch (error) {
    if (error.message && !error.response) {
      const msg = error.response.data.errors[0].msg || error.message;
      dispatch(
        setAlert(
          { title: 'Failed!', msg },
          'danger',
          3000
        )
      );
    }
  }
}

export const clearProfile = () => dispatch => dispatch({ type: CLEAR_PROFILE_DETAIL })

