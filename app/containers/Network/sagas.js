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
const CREATE_CONNECTION = 'Jolly/Network/CREATE_CONNECTION';
const REMOVE_CONNECTION = 'Jolly/Network/REMOVE_CONNECTION';
const ACCEPT_CONNECTION = 'Jolly/Network/ACCEPT_CONNECTION';
const CONNECTION = 'Jolly/Network/CONNECTION';

// ------------------------------------
// Actions
// ------------------------------------
export const requestCreateConnection = (to: string, isCoworker: boolean) => ({
  type: CREATE_CONNECTION + REQUESTED,
  payload: to,
  metadata: {
    isCoworker,
  },
});
const connectionCreateRequestSuccess = (payload: Object) => ({
  type: CREATE_CONNECTION + SUCCEDED,
  payload,
});
const connectionCreateRequestFailed = (error: string) => ({
  type: CREATE_CONNECTION + FAILED,
  payload: error,
});
const connectionCreateRequestError = (error: string) => ({
  type: CREATE_CONNECTION + ERROR,
  payload: error,
});

export const requestRemoveConnection = (id: string) => ({
  type: REMOVE_CONNECTION + REQUESTED,
  payload: id,
});
const connectionRemoveRequestSuccess = (payload: Object) => ({
  type: REMOVE_CONNECTION + SUCCEDED,
  payload,
});
const connectionRemoveRequestFailed = (error: string) => ({
  type: REMOVE_CONNECTION + FAILED,
  payload: error,
});
const connectionRemoveRequestError = (error: string) => ({
  type: REMOVE_CONNECTION + ERROR,
  payload: error,
});

export const requestAcceptConnection = (id: string) => ({
  type: ACCEPT_CONNECTION + REQUESTED,
  payload: id,
});
const connectionAcceptRequestSuccess = (payload: Object) => ({
  type: ACCEPT_CONNECTION + SUCCEDED,
  payload,
});
const connectionAcceptRequestFailed = (error: string) => ({
  type: ACCEPT_CONNECTION + FAILED,
  payload: error,
});
const connectionAcceptRequestError = (error: string) => ({
  type: ACCEPT_CONNECTION + ERROR,
  payload: error,
});

export const requestConnections = () => ({
  type: CONNECTION + REQUESTED,
});
const connectionsRequestSuccess = (payload: Object) => ({
  type: CONNECTION + SUCCEDED,
  payload,
});
const connectionsRequestFailed = (error: string) => ({
  type: CONNECTION + FAILED,
  payload: error,
});
const connectionsRequestError = (error: string) => ({
  type: CONNECTION + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  connections: null,
  isLoading: false,
  error: '',
  isCreating: false,
  createError: '',
  isRemoving: false,
  removeError: '',
  isAccepting: false,
  acceptError: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case CREATE_CONNECTION + REQUESTED:
      return state.set('isCreating', true);

    case CREATE_CONNECTION + SUCCEDED:
      return state.set('isCreating', false).set('createError', '');

    case CREATE_CONNECTION + FAILED:
      return state.set('isCreating', false).set('createError', payload.message);

    case CREATE_CONNECTION + ERROR:
      return state.set('isCreating', false).set(
        'createError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case REMOVE_CONNECTION + REQUESTED:
      return state.set('isRemoving', true);

    case REMOVE_CONNECTION + SUCCEDED:
      return state.set('isRemoving', false).set('removeError', '');

    case REMOVE_CONNECTION + FAILED:
      return state.set('isRemoving', false).set('removeError', payload.message);

    case REMOVE_CONNECTION + ERROR:
      return state.set('isRemoving', false).set(
        'removeError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case ACCEPT_CONNECTION + REQUESTED:
      return state.set('isAccepting', true);

    case ACCEPT_CONNECTION + SUCCEDED:
      return state.set('isAccepting', false).set('acceptError', '');

    case ACCEPT_CONNECTION + FAILED:
      return state
        .set('isAccepting', false)
        .set('acceptError', payload.message);

    case ACCEPT_CONNECTION + ERROR:
      return state.set('isAccepting', false).set(
        'acceptError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case CONNECTION + REQUESTED:
      return state.set('isLoading', true);

    case CONNECTION + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('connections', fromJS(payload.connections))
        .set('error', '');

    case CONNECTION + FAILED:
      return state.set('isLoading', false).set('error', payload.message);

    case CONNECTION + ERROR:
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
function* CreateConnectionRequest({ payload, metadata }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/connection`,
      data: {
        to: payload,
        isCoworker: metadata.isCoworker,
      },
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(connectionCreateRequestSuccess(response.data.response));
    } else {
      yield put(connectionCreateRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(connectionCreateRequestError(error));
  }
}

function* RemoveConnectionRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/connection/${payload}`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(connectionRemoveRequestSuccess(response.data.response));
    } else {
      yield put(connectionRemoveRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(connectionRemoveRequestError(error));
  }
}

function* AcceptConnectionRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/connection/${payload}/accept`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(connectionAcceptRequestSuccess(response.data.response));
    } else {
      yield put(connectionAcceptRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(connectionAcceptRequestError(error));
  }
}

function* ConnectionsRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/connection`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(connectionsRequestSuccess(response.data.response));
    } else {
      yield put(connectionsRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(connectionsRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(CREATE_CONNECTION + REQUESTED, CreateConnectionRequest),
    takeLatest(REMOVE_CONNECTION + REQUESTED, RemoveConnectionRequest),
    takeLatest(ACCEPT_CONNECTION + REQUESTED, AcceptConnectionRequest),
    takeLatest(CONNECTION + REQUESTED, ConnectionsRequest),
  ]);
}
