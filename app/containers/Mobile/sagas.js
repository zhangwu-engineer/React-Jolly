// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, takeLatest, all, select } from 'redux-saga/effects';
import request from 'utils/request';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const PHONE_VERIFICATION = 'Jolly/Mobile/PHONE_VERIFICATION';
const TOKEN_VERIFICATION = 'Jolly/Mobile/PHONE__TOKEN_VERIFICATION';
const RESET_STEP = 'Jolly/Mobile/RESET_STEP';
// ------------------------------------
// Actions
// ------------------------------------
export const requestPhoneVerification = (payload: Object) => ({
  type: PHONE_VERIFICATION + REQUESTED,
  payload,
});
const phoneVerificationRequestSuccess = (payload: Object) => ({
  type: PHONE_VERIFICATION + SUCCEDED,
  payload,
});
const phoneVerificationRequestFailed = (error: string) => ({
  type: PHONE_VERIFICATION + FAILED,
  payload: error,
});
const phoneVerificationRequestError = (error: string) => ({
  type: PHONE_VERIFICATION + ERROR,
  payload: error,
});

export const requestTokenVerification = (payload: Object) => ({
  type: TOKEN_VERIFICATION + REQUESTED,
  payload,
});
const tokenVerificationRequestSuccess = (payload: Object) => ({
  type: TOKEN_VERIFICATION + SUCCEDED,
  payload,
});
const tokenVerificationRequestFailed = (error: string) => ({
  type: TOKEN_VERIFICATION + FAILED,
  payload: error,
});
const tokenVerificationRequestError = (error: string) => ({
  type: TOKEN_VERIFICATION + ERROR,
  payload: error,
});

export const resetStep = () => ({
  type: RESET_STEP,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  step: 1,
  isPhoneLoading: false,
  phoneError: '',
  isTokenLoading: false,
  tokenError: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case PHONE_VERIFICATION + REQUESTED:
      return state.set('isPhoneLoading', true);

    case PHONE_VERIFICATION + SUCCEDED:
      return state
        .set('isPhoneLoading', false)
        .set('phoneError', '')
        .set('step', 2);

    case PHONE_VERIFICATION + FAILED:
      return state.set('isPhoneLoading', false).set('phoneError', payload);

    case PHONE_VERIFICATION + ERROR:
      return state.set('isPhoneLoading', false).set(
        'phoneError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case TOKEN_VERIFICATION + REQUESTED:
      return state.set('isTokenLoading', true);

    case TOKEN_VERIFICATION + SUCCEDED:
      return state
        .set('isTokenLoading', false)
        .set('tokenError', '')
        .set('step', 3);

    case TOKEN_VERIFICATION + FAILED:
      return state.set('isTokenLoading', false).set('tokenError', payload);

    case TOKEN_VERIFICATION + ERROR:
      return state.set('isTokenLoading', false).set(
        'tokenError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case RESET_STEP:
      return state.set('step', 1);

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
function* PhoneVerificationRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/verify-phone`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(phoneVerificationRequestSuccess(response.data.response));
    } else {
      yield put(phoneVerificationRequestFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(phoneVerificationRequestError(error));
  }
}

function* TokenVerificationRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/verify-phone-token`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(tokenVerificationRequestSuccess(response.data.response));
    } else {
      yield put(tokenVerificationRequestFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(tokenVerificationRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(PHONE_VERIFICATION + REQUESTED, PhoneVerificationRequest),
    takeLatest(TOKEN_VERIFICATION + REQUESTED, TokenVerificationRequest),
  ]);
}
