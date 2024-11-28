/* eslint-disable */
import axios from 'axios';

import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const { data } = await axios({
      url: '/api/v1/users/login',
      method: 'POST',
      data: {
        email,
        password,
      },
    });
    if (data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      showAlert('error', data.message);
    }
  } catch (err) {
    showAlert('error', "Something went wrong! Couldn't log in.");
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const { data } = await axios({
      url: '/api/v1/users/signup',
      method: 'POST',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      showAlert('error', data.message);
    }
  } catch (err) {
    showAlert('error', "Something went wrong! Couldn't sign up.");
  }
};
