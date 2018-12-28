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
const ROLES = 'Jolly/Role/ROLES';
const UPDATE_ROLE = 'Jolly/Role/UPDATE_ROLE';
const CREATE_ROLE = 'Jolly/Role/CREATE_ROLE';
const DELETE_ROLE = 'Jolly/Role/DELETE_ROLE';
const UNITS = 'Jolly/Role/UNITS';
const UPDATE_UNIT = 'Jolly/Role/UPDATE_UNIT';
const CREATE_UNIT = 'Jolly/Role/CREATE_UNIT';
const DELETE_UNIT = 'Jolly/Role/DELETE_UNIT';
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

export const requestUpdateRole = (id: string, payload: Object) => ({
  type: UPDATE_ROLE + REQUESTED,
  payload,
  meta: {
    id,
  },
});
const roleUpdateRequestSuccess = (payload: Object) => ({
  type: UPDATE_ROLE + SUCCEDED,
  payload,
});
const roleUpdateRequestFailed = (error: string) => ({
  type: UPDATE_ROLE + FAILED,
  payload: error,
});
const roleUpdateRequestError = (error: string) => ({
  type: UPDATE_ROLE + ERROR,
  payload: error,
});

export const requestCreateRole = (payload: Object) => ({
  type: CREATE_ROLE + REQUESTED,
  payload,
});
const roleCreateRequestSuccess = (payload: Object) => ({
  type: CREATE_ROLE + SUCCEDED,
  payload,
});
const roleCreateRequestFailed = (error: string) => ({
  type: CREATE_ROLE + FAILED,
  payload: error,
});
const roleCreateRequestError = (error: string) => ({
  type: CREATE_ROLE + ERROR,
  payload: error,
});

export const requestDeleteRole = (payload: Object) => ({
  type: DELETE_ROLE + REQUESTED,
  payload,
});
const roleDeleteRequestSuccess = (payload: Object) => ({
  type: DELETE_ROLE + SUCCEDED,
  payload,
});
const roleDeleteRequestFailed = (error: string) => ({
  type: DELETE_ROLE + FAILED,
  payload: error,
});
const roleDeleteRequestError = (error: string) => ({
  type: DELETE_ROLE + ERROR,
  payload: error,
});

export const requestUnits = () => ({
  type: UNITS + REQUESTED,
});
const unitsRequestSuccess = (payload: Object) => ({
  type: UNITS + SUCCEDED,
  payload,
});
const unitsRequestFailed = (error: string) => ({
  type: UNITS + FAILED,
  payload: error,
});
const unitsRequestError = (error: string) => ({
  type: UNITS + ERROR,
  payload: error,
});

export const requestUpdateUnit = (id: string, payload: Object) => ({
  type: UPDATE_UNIT + REQUESTED,
  payload,
  meta: {
    id,
  },
});
const unitUpdateRequestSuccess = (payload: Object) => ({
  type: UPDATE_UNIT + SUCCEDED,
  payload,
});
const unitUpdateRequestFailed = (error: string) => ({
  type: UPDATE_UNIT + FAILED,
  payload: error,
});
const unitUpdateRequestError = (error: string) => ({
  type: UPDATE_UNIT + ERROR,
  payload: error,
});

export const requestCreateUnit = (payload: Object) => ({
  type: CREATE_UNIT + REQUESTED,
  payload,
});
const unitCreateRequestSuccess = (payload: Object) => ({
  type: CREATE_UNIT + SUCCEDED,
  payload,
});
const unitCreateRequestFailed = (error: string) => ({
  type: CREATE_UNIT + FAILED,
  payload: error,
});
const unitCreateRequestError = (error: string) => ({
  type: CREATE_UNIT + ERROR,
  payload: error,
});

export const requestDeleteUnit = (payload: Object) => ({
  type: DELETE_UNIT + REQUESTED,
  payload,
});
const unitDeleteRequestSuccess = (payload: Object) => ({
  type: DELETE_UNIT + SUCCEDED,
  payload,
});
const unitDeleteRequestFailed = (error: string) => ({
  type: DELETE_UNIT + FAILED,
  payload: error,
});
const unitDeleteRequestError = (error: string) => ({
  type: DELETE_UNIT + ERROR,
  payload: error,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  roles: null,
  isLoading: false,
  error: '',
  isSaving: false,
  saveError: '',
  isCreating: false,
  createError: '',
  isDeleting: false,
  deleteError: '',
  units: fromJS([]),
  isUnitLoading: false,
  unitError: '',
  isUnitSaving: false,
  unitSaveError: '',
  isUnitCreating: false,
  unitCreateError: '',
  isUnitDeleting: false,
  unitDeleteError: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case ROLES + REQUESTED:
      return state.set('isLoading', true);

    case ROLES + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('roles', fromJS(payload.talent_list))
        .set('error', '');

    case ROLES + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case ROLES + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case UPDATE_ROLE + REQUESTED:
      return state.set('isSaving', true);

    case UPDATE_ROLE + SUCCEDED:
      return state.set('isSaving', false).set('saveError', '');

    case UPDATE_ROLE + FAILED:
      return state.set('isSaving', false).set('saveError', payload);

    case UPDATE_ROLE + ERROR:
      return state.set('isSaving', false).set(
        'saveError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case CREATE_ROLE + REQUESTED:
      return state.set('isCreating', true);

    case CREATE_ROLE + SUCCEDED:
      return state.set('isCreating', false).set('createError', '');

    case CREATE_ROLE + FAILED:
      return state.set('isCreating', false).set('createError', payload);

    case CREATE_ROLE + ERROR:
      return state.set('isCreating', false).set(
        'createError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case DELETE_ROLE + REQUESTED:
      return state.set('isDeleting', true);

    case DELETE_ROLE + SUCCEDED:
      return state.set('isDeleting', false).set('deleteError', '');

    case DELETE_ROLE + FAILED:
      return state.set('isDeleting', false).set('deleteError', payload);

    case DELETE_ROLE + ERROR:
      return state.set('isDeleting', false).set(
        'deleteError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case UNITS + REQUESTED:
      return state.set('isUnitLoading', true);

    case UNITS + SUCCEDED:
      return state
        .set('isUnitLoading', false)
        .set('units', fromJS(payload.unit_list))
        .set('unitError', '');

    case UNITS + FAILED:
      return state.set('isUnitLoading', false).set('unitError', payload);

    case UNITS + ERROR:
      return state.set('isUnitLoading', false).set(
        'unitError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case UPDATE_UNIT + REQUESTED:
      return state.set('isUnitSaving', true);

    case UPDATE_UNIT + SUCCEDED:
      return state.set('isUnitSaving', false).set('unitSaveError', '');

    case UPDATE_UNIT + FAILED:
      return state.set('isUnitSaving', false).set('unitSaveError', payload);

    case UPDATE_UNIT + ERROR:
      return state.set('isUnitSaving', false).set(
        'unitSaveError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case CREATE_UNIT + REQUESTED:
      return state.set('isUnitCreating', true);

    case CREATE_UNIT + SUCCEDED:
      return state.set('isUnitCreating', false).set('unitCreateError', '');

    case CREATE_UNIT + FAILED:
      return state.set('isUnitCreating', false).set('unitCreateError', payload);

    case CREATE_UNIT + ERROR:
      return state.set('isUnitCreating', false).set(
        'unitCreateError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case DELETE_UNIT + REQUESTED:
      return state.set('isUnitDeleting', true);

    case DELETE_UNIT + SUCCEDED:
      return state.set('isUnitDeleting', false).set('unitDeleteError', '');

    case DELETE_UNIT + FAILED:
      return state.set('isUnitDeleting', false).set('unitDeleteError', payload);

    case DELETE_UNIT + ERROR:
      return state.set('isUnitDeleting', false).set(
        'unitDeleteError',
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

function* UpdateRoleRequest({ payload, meta }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/talent/${meta.id}`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(roleUpdateRequestSuccess(response.data.response));
    } else {
      yield put(roleUpdateRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(roleUpdateRequestError(error));
  }
}

function* CreateRoleRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/talent`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(roleCreateRequestSuccess(response.data.response));
    } else {
      yield put(roleCreateRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(roleCreateRequestError(error));
  }
}

function* DeleteRoleRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/talent/${payload.id}`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(roleDeleteRequestSuccess(response.data.response));
    } else {
      yield put(roleDeleteRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(roleDeleteRequestError(error));
  }
}

function* UnitsRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/unit`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(unitsRequestSuccess(response.data.response));
    } else {
      yield put(unitsRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(unitsRequestError(error));
  }
}

function* UpdateUnitRequest({ payload, meta }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/unit/${meta.id}`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(unitUpdateRequestSuccess(response.data.response));
    } else {
      yield put(unitUpdateRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(unitUpdateRequestError(error));
  }
}

function* CreateUnitRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/unit`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(unitCreateRequestSuccess(response.data.response));
    } else {
      yield put(unitCreateRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(unitCreateRequestError(error));
  }
}

function* DeleteUnitRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/unit/${payload.id}`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(unitDeleteRequestSuccess(response.data.response));
    } else {
      yield put(unitDeleteRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(unitDeleteRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(ROLES + REQUESTED, RolesRequest),
    takeLatest(UPDATE_ROLE + REQUESTED, UpdateRoleRequest),
    takeLatest(CREATE_ROLE + REQUESTED, CreateRoleRequest),
    takeLatest(DELETE_ROLE + REQUESTED, DeleteRoleRequest),
    takeLatest(UNITS + REQUESTED, UnitsRequest),
    takeLatest(UPDATE_UNIT + REQUESTED, UpdateUnitRequest),
    takeLatest(CREATE_UNIT + REQUESTED, CreateUnitRequest),
    takeLatest(DELETE_UNIT + REQUESTED, DeleteUnitRequest),
  ]);
}
