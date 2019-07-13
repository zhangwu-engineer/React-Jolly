// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import {
  API_URL,
  REQUESTED,
  SUCCEDED,
  FAILED,
  ERROR,
  SET_USER_TRUSTED,
} from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getAdminToken } from 'containers/App/selectors';

const USERS = 'Jolly/Admin/USERS';

export const requestUsers = (payload: Object) => ({
  type: USERS + REQUESTED,
  payload,
});
const usersRequestSuccess = (payload: Object) => ({
  type: USERS + SUCCEDED,
  payload,
});
const usersRequestFailed = (error: string) => ({
  type: USERS + FAILED,
  payload: error,
});
const usersRequestError = (error: string) => ({
  type: USERS + ERROR,
  payload: error,
});

export const requestSetUserTrusted = (userId: string) => ({
  type: SET_USER_TRUSTED + REQUESTED,
  payload: userId,
});
const setUserTrustedRequestSuccess = () => ({
  type: SET_USER_TRUSTED + SUCCEDED,
});
const setUserTrustedRequestFailed = (error: string) => ({
  type: SET_USER_TRUSTED + FAILED,
  payload: {
    message: error,
  },
});
const setUserTrustedRequestError = (error: string) => ({
  type: SET_USER_TRUSTED + ERROR,
  payload: error,
});

const initialState = fromJS({
  users: fromJS({
    data: [],
    pages: null,
    page: null,
  }),
  isLoading: false,
  error: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case USERS + REQUESTED:
      return state.set('isLoading', true);

    case USERS + SUCCEDED: {
      return state
        .set('isLoading', false)
        .set('users', fromJS(payload))
        .set('error', '');
    }

    case USERS + FAILED:
      return state.set('isLoading', false).set('error', payload.message);

    case USERS + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case SET_USER_TRUSTED + REQUESTED:
      return state.set('isLoading', true);

    case SET_USER_TRUSTED + SUCCEDED:
      return state.set('isLoading', false);

    case SET_USER_TRUSTED + FAILED:
      return state.set('isLoading', false).set('error', payload.message);

    case SET_USER_TRUSTED + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    default:
      return state;
  }
};

function* UsersRequest({ payload }) {
  const token = yield select(getAdminToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/admin/user`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(usersRequestSuccess(response.data.response));
    } else {
      yield put(usersRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(usersRequestError(error));
  }
}

function* SetUserTrustedRequest({ payload }) {
  const token = yield select(getAdminToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/admin/user/trusted/${payload}`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(setUserTrustedRequestSuccess());
    } else {
      yield put(setUserTrustedRequestFailed(response.error));
    }
  } catch (error) {
    yield put(setUserTrustedRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(USERS + REQUESTED, UsersRequest),
    takeLatest(SET_USER_TRUSTED + REQUESTED, SetUserTrustedRequest),
  ]);
}
