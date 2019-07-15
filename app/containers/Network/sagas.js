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
const ALL_CONNECTIONS = 'Jolly/Network/ALL_CONNECTIONS';
const BUSINESS_CONNECTIONS = 'Jolly/Network/BUSINESS_CONNECTIONS';
const CONNECTED_CONNECTIONS = 'Jolly/Network/CONNECTED_CONNECTIONS';

// ------------------------------------
// Actions
// ------------------------------------
export const requestCreateConnection = (to: string) => ({
  type: CREATE_CONNECTION + REQUESTED,
  payload: to,
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
  type: ALL_CONNECTIONS + REQUESTED,
});
const connectionsRequestSuccess = (payload: Object) => ({
  type: ALL_CONNECTIONS + SUCCEDED,
  payload,
});
const connectionsRequestFailed = (error: string) => ({
  type: ALL_CONNECTIONS + FAILED,
  payload: error,
});
const connectionsRequestError = (error: string) => ({
  type: ALL_CONNECTIONS + ERROR,
  payload: error,
});

export const requestBusinessConnections = (to: string) => ({
  type: BUSINESS_CONNECTIONS + REQUESTED,
  payload: to,
});
const businessConnectionsRequestSuccess = (payload: Object) => ({
  type: BUSINESS_CONNECTIONS + SUCCEDED,
  payload,
});
const businessConnectionsRequestFailed = (error: string) => ({
  type: BUSINESS_CONNECTIONS + FAILED,
  payload: error,
});
const businessConnectionsRequestError = (error: string) => ({
  type: BUSINESS_CONNECTIONS + ERROR,
  payload: error,
});

export const requestConnectedConnections = (
  city: string,
  query: string,
  role: string,
  connection: string,
  connectionType: string
) => ({
  type: CONNECTED_CONNECTIONS + REQUESTED,
  payload: {
    city,
    query,
    role,
    connection,
    connectionType,
  },
});
const connectedConnectionsRequestSuccess = (payload: Object) => ({
  type: CONNECTED_CONNECTIONS + SUCCEDED,
  payload,
});
const connectedConnectionsRequestFailed = (error: string) => ({
  type: CONNECTED_CONNECTIONS + FAILED,
  payload: error,
});
const connectedConnectionsRequestError = (error: string) => ({
  type: CONNECTED_CONNECTIONS + ERROR,
  payload: error,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  connections: null,
  connectedConnections: null,
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

    case ALL_CONNECTIONS + REQUESTED:
      return state.set('isLoading', true);

    case ALL_CONNECTIONS + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('connections', fromJS(payload.connections))
        .set('error', '');

    case ALL_CONNECTIONS + FAILED:
      return state.set('isLoading', false).set('error', payload.message);

    case ALL_CONNECTIONS + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case BUSINESS_CONNECTIONS + REQUESTED:
      return state.set('isLoading', true);

    case BUSINESS_CONNECTIONS + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('connections', fromJS(payload.connections))
        .set('error', '');

    case BUSINESS_CONNECTIONS + FAILED:
      return state.set('isLoading', false).set('error', payload.message);

    case BUSINESS_CONNECTIONS + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case CONNECTED_CONNECTIONS + REQUESTED:
      return state.set('isLoading', true);

    case CONNECTED_CONNECTIONS + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('connectedConnections', fromJS(payload.connections))
        .set('error', '');

    case CONNECTED_CONNECTIONS + FAILED:
      return state.set('isLoading', false).set('error', payload.message);

    case CONNECTED_CONNECTIONS + ERROR:
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
function* CreateConnectionRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/connection`,
      data: payload,
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

function* BusinessConnectionsRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/connection/business`,
      headers: { 'x-access-token': token },
      params: {
        businessId: payload,
      },
    });
    if (response.status === 200) {
      yield put(businessConnectionsRequestSuccess(response.data.response));
    } else {
      yield put(businessConnectionsRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(businessConnectionsRequestError(error));
  }
}

function* ConnectedConnectionsRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/connection/connected`,
      headers: { 'x-access-token': token },
      params: payload,
    });
    if (response.status === 200) {
      yield put(connectedConnectionsRequestSuccess(response.data.response));
    } else {
      yield put(connectedConnectionsRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(connectedConnectionsRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(CREATE_CONNECTION + REQUESTED, CreateConnectionRequest),
    takeLatest(REMOVE_CONNECTION + REQUESTED, RemoveConnectionRequest),
    takeLatest(ACCEPT_CONNECTION + REQUESTED, AcceptConnectionRequest),
    takeLatest(ALL_CONNECTIONS + REQUESTED, ConnectionsRequest),
    takeLatest(BUSINESS_CONNECTIONS + REQUESTED, BusinessConnectionsRequest),
    takeLatest(CONNECTED_CONNECTIONS + REQUESTED, ConnectedConnectionsRequest),
  ]);
}
