// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const CREATE_WORK = 'Jolly/Work/CREATE_WORK';
const ROLES = 'Jolly/Work/ROLES';
const WORKS = 'Jolly/Work/WORKS';
// ------------------------------------
// Actions
// ------------------------------------
export const requestCreateWork = (payload: Object) => ({
  type: CREATE_WORK + REQUESTED,
  payload,
});
const workCreateRequestSuccess = (payload: Object) => ({
  type: CREATE_WORK + SUCCEDED,
  payload,
});
const workCreateRequestFailed = (error: string) => ({
  type: CREATE_WORK + FAILED,
  payload: error,
});
const workCreateRequestError = (error: string) => ({
  type: CREATE_WORK + ERROR,
  payload: error,
});

export const requestWorks = () => ({
  type: WORKS + REQUESTED,
});
const worksRequestSuccess = (payload: Object) => ({
  type: WORKS + SUCCEDED,
  payload,
});
const worksRequestFailed = (error: string) => ({
  type: WORKS + FAILED,
  payload: error,
});
const worksRequestError = (error: string) => ({
  type: WORKS + ERROR,
  payload: error,
});

export const requestRoles = () => ({
  type: ROLES + REQUESTED,
});
const rolesRequestSuccess = (payload: Object) => ({
  type: ROLES + SUCCEDED,
  payload,
});
const rolesRequestFailed = (error: string) => ({
  type: ROLES + FAILED,
  payload: error,
});
const rolesRequestError = (error: string) => ({
  type: ROLES + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  isLoading: false,
  error: '',
  works: fromJS([]),
  isWorksLoading: false,
  worksError: '',
  roles: fromJS([]),
  isRolesLoading: false,
  rolesError: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case CREATE_WORK + REQUESTED:
      return state.set('isLoading', true);

    case CREATE_WORK + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case CREATE_WORK + FAILED:
      return state.set('isLoading', false).set('error', payload.message);

    case CREATE_WORK + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case WORKS + REQUESTED:
      return state.set('isWorksLoading', true);

    case WORKS + SUCCEDED:
      return state
        .set('isWorksLoading', false)
        .set('works', fromJS(payload.work_list))
        .set('worksError', '');

    case WORKS + FAILED:
      return state
        .set('isWorksLoading', false)
        .set('worksError', payload.message);

    case WORKS + ERROR:
      return state.set('isWorksLoading', false).set(
        'worksError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case ROLES + REQUESTED:
      return state.set('isRolesLoading', true);

    case ROLES + SUCCEDED:
      return state
        .set('isRolesLoading', false)
        .set('roles', fromJS(payload.talent_list))
        .set('rolesError', '');

    case ROLES + FAILED:
      return state
        .set('isRolesLoading', false)
        .set('rolesError', payload.message);

    case ROLES + ERROR:
      return state.set('isRolesLoading', false).set(
        'rolesError',
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
function* CreateWorkRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/work`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(workCreateRequestSuccess(response.data.response));
    } else {
      yield put(workCreateRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(workCreateRequestError(error));
  }
}

function* WorksRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/work`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(worksRequestSuccess(response.data.response));
    } else {
      yield put(worksRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(worksRequestError(error));
  }
}

function* RolesRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/talent`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(rolesRequestSuccess(response.data.response));
    } else {
      yield put(rolesRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(rolesRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(CREATE_WORK + REQUESTED, CreateWorkRequest),
    takeLatest(WORKS + REQUESTED, WorksRequest),
    takeLatest(ROLES + REQUESTED, RolesRequest),
  ]);
}
