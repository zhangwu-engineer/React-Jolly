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
const ROLES = 'Jolly/Work/ROLES';

// ------------------------------------
// Actions
// ------------------------------------
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
  roles: fromJS([]),
  isRolesLoading: false,
  rolesError: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
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
  yield all([takeLatest(ROLES + REQUESTED, RolesRequest)]);
}
