// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';

// ------------------------------------
// Constants
// ------------------------------------
const FORGOT_PASSWORD = 'Jolly/Password/FORGOT_PASSWORD';
const RESET_PASSWORD = 'Jolly/Password/RESET_PASSWORD';
// ------------------------------------
// Actions
// ------------------------------------
export const requestForgotPassword = (payload: Object) => ({
  type: FORGOT_PASSWORD + REQUESTED,
  payload,
});
const passwordForgotRequestSuccess = (payload: Object) => ({
  type: FORGOT_PASSWORD + SUCCEDED,
  payload,
});
const passwordForgotRequestFailed = (error: string) => ({
  type: FORGOT_PASSWORD + FAILED,
  payload: error,
});
const passwordForgotRequestError = (error: string) => ({
  type: FORGOT_PASSWORD + ERROR,
  payload: error,
});

export const requestResetPassword = (payload: Object) => ({
  type: RESET_PASSWORD + REQUESTED,
  payload,
});
const passwordResetRequestSuccess = (payload: Object) => ({
  type: RESET_PASSWORD + SUCCEDED,
  payload,
});
const passwordResetRequestFailed = (error: string) => ({
  type: RESET_PASSWORD + FAILED,
  payload: error,
});
const passwordResetRequestError = (error: string) => ({
  type: RESET_PASSWORD + ERROR,
  payload: error,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  isLoading: false,
  error: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case FORGOT_PASSWORD + REQUESTED:
      return state.set('isLoading', true);

    case FORGOT_PASSWORD + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case FORGOT_PASSWORD + FAILED:
      return state.set('isLoading', false).set('error', payload.message);

    case FORGOT_PASSWORD + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case RESET_PASSWORD + REQUESTED:
      return state.set('isLoading', true);

    case RESET_PASSWORD + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case RESET_PASSWORD + FAILED:
      return state.set('isLoading', false).set('error', payload.message);

    case RESET_PASSWORD + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    default:
      return state;
  }
};

// ------------------------------------
// Selectors
// ------------------------------------

// ------------------------------------
// Sagas
// ------------------------------------
function* PasswordForgotRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/forgot-password`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(passwordForgotRequestSuccess(response.data.response));
    } else {
      yield put(passwordForgotRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(passwordForgotRequestError(error));
  }
}

function* PasswordResetRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/reset-password`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(passwordResetRequestSuccess(response.data.response));
    } else {
      yield put(passwordResetRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(passwordResetRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(FORGOT_PASSWORD + REQUESTED, PasswordForgotRequest),
    takeLatest(RESET_PASSWORD + REQUESTED, PasswordResetRequest),
  ]);
}
