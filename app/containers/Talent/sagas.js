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
const TALENTS = 'Jolly/Talent/TALENTS';
const UPDATE_TALENT = 'Jolly/Talent/UPDATE_TALENT';
const CREATE_TALENT = 'Jolly/Talent/CREATE_TALENT';
const DELETE_TALENT = 'Jolly/Talent/DELETE_TALENT';
const UNITS = 'Jolly/Talent/UNITS';
const UPDATE_UNIT = 'Jolly/Talent/UPDATE_UNIT';
const CREATE_UNIT = 'Jolly/Talent/CREATE_UNIT';
const DELETE_UNIT = 'Jolly/Talent/DELETE_UNIT';
// ------------------------------------
// Actions
// ------------------------------------
export const requestTalents = () => ({
  type: TALENTS + REQUESTED,
});
const talentsRequestSuccess = (payload: Object) => ({
  type: TALENTS + SUCCEDED,
  payload,
});
const talentsRequestFailed = (error: string) => ({
  type: TALENTS + FAILED,
  payload: error,
});
const talentsRequestError = (error: string) => ({
  type: TALENTS + ERROR,
  payload: error,
});

export const requestUpdateTalent = (id: string, payload: Object) => ({
  type: UPDATE_TALENT + REQUESTED,
  payload,
  meta: {
    id,
  },
});
const talentUpdateRequestSuccess = (payload: Object) => ({
  type: UPDATE_TALENT + SUCCEDED,
  payload,
});
const talentUpdateRequestFailed = (error: string) => ({
  type: UPDATE_TALENT + FAILED,
  payload: error,
});
const talentUpdateRequestError = (error: string) => ({
  type: UPDATE_TALENT + ERROR,
  payload: error,
});

export const requestCreateTalent = (payload: Object) => ({
  type: CREATE_TALENT + REQUESTED,
  payload,
});
const talentCreateRequestSuccess = (payload: Object) => ({
  type: CREATE_TALENT + SUCCEDED,
  payload,
});
const talentCreateRequestFailed = (error: string) => ({
  type: CREATE_TALENT + FAILED,
  payload: error,
});
const talentCreateRequestError = (error: string) => ({
  type: CREATE_TALENT + ERROR,
  payload: error,
});

export const requestDeleteTalent = (payload: Object) => ({
  type: DELETE_TALENT + REQUESTED,
  payload,
});
const talentDeleteRequestSuccess = (payload: Object) => ({
  type: DELETE_TALENT + SUCCEDED,
  payload,
});
const talentDeleteRequestFailed = (error: string) => ({
  type: DELETE_TALENT + FAILED,
  payload: error,
});
const talentDeleteRequestError = (error: string) => ({
  type: DELETE_TALENT + ERROR,
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
  talents: fromJS([]),
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
    case TALENTS + REQUESTED:
      return state.set('isLoading', true);

    case TALENTS + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('talents', fromJS(payload.talent_list))
        .set('error', '');

    case TALENTS + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case TALENTS + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case UPDATE_TALENT + REQUESTED:
      return state.set('isSaving', true);

    case UPDATE_TALENT + SUCCEDED:
      return state.set('isSaving', false).set('saveError', '');

    case UPDATE_TALENT + FAILED:
      return state.set('isSaving', false).set('saveError', payload);

    case UPDATE_TALENT + ERROR:
      return state.set('isSaving', false).set(
        'saveError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case CREATE_TALENT + REQUESTED:
      return state.set('isCreating', true);

    case CREATE_TALENT + SUCCEDED:
      return state.set('isCreating', false).set('createError', '');

    case CREATE_TALENT + FAILED:
      return state.set('isCreating', false).set('createError', payload);

    case CREATE_TALENT + ERROR:
      return state.set('isCreating', false).set(
        'createError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case DELETE_TALENT + REQUESTED:
      return state.set('isDeleting', true);

    case DELETE_TALENT + SUCCEDED:
      return state.set('isDeleting', false).set('deleteError', '');

    case DELETE_TALENT + FAILED:
      return state.set('isDeleting', false).set('deleteError', payload);

    case DELETE_TALENT + ERROR:
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
function* TalentsRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/talent`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(talentsRequestSuccess(response.data.response));
    } else {
      yield put(talentsRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(talentsRequestError(error));
  }
}

function* UpdateTalentRequest({ payload, meta }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/talent/${meta.id}`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(talentUpdateRequestSuccess(response.data.response));
    } else {
      yield put(talentUpdateRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(talentUpdateRequestError(error));
  }
}

function* CreateTalentRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/talent`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(talentCreateRequestSuccess(response.data.response));
    } else {
      yield put(talentCreateRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(talentCreateRequestError(error));
  }
}

function* DeleteTalentRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/talent/${payload.id}`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(talentDeleteRequestSuccess(response.data.response));
    } else {
      yield put(talentDeleteRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(talentDeleteRequestError(error));
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
    takeLatest(TALENTS + REQUESTED, TalentsRequest),
    takeLatest(UPDATE_TALENT + REQUESTED, UpdateTalentRequest),
    takeLatest(CREATE_TALENT + REQUESTED, CreateTalentRequest),
    takeLatest(DELETE_TALENT + REQUESTED, DeleteTalentRequest),
    takeLatest(UNITS + REQUESTED, UnitsRequest),
    takeLatest(UPDATE_UNIT + REQUESTED, UpdateUnitRequest),
    takeLatest(CREATE_UNIT + REQUESTED, CreateUnitRequest),
    takeLatest(DELETE_UNIT + REQUESTED, DeleteUnitRequest),
  ]);
}
