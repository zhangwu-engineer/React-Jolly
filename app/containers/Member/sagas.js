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
const TALENTS = 'Jolly/Member/TALENTS';
const MEMBER_PROFILE = 'Jolly/Member/MEMBER_PROFILE';
const FILES = 'Jolly/Member/FILES';
// ------------------------------------
// Actions
// ------------------------------------
export const requestMemberProfile = (slug: string) => ({
  type: MEMBER_PROFILE + REQUESTED,
  payload: slug,
});
const memberProfileRequestSuccess = (payload: Object) => ({
  type: MEMBER_PROFILE + SUCCEDED,
  payload,
});
const memberProfileRequestFailed = (error: string) => ({
  type: MEMBER_PROFILE + FAILED,
  payload: error,
});
const memberProfileRequestError = (error: string) => ({
  type: MEMBER_PROFILE + ERROR,
  payload: error,
});

export const requestMemberTalents = (slug: string) => ({
  type: TALENTS + REQUESTED,
  payload: slug,
});
const memberTalentsRequestSuccess = (payload: Object) => ({
  type: TALENTS + SUCCEDED,
  payload,
});
const memberTalentsRequestFailed = (error: string) => ({
  type: TALENTS + FAILED,
  payload: error,
});
const memberTalentsRequestError = (error: string) => ({
  type: TALENTS + ERROR,
  payload: error,
});

export const requestMemberFiles = (slug: string) => ({
  type: FILES + REQUESTED,
  payload: slug,
});
const memberFilesRequestSuccess = (payload: Object) => ({
  type: FILES + SUCCEDED,
  payload,
});
const memberFilesRequestFailed = (error: string) => ({
  type: FILES + FAILED,
  payload: error,
});
const memberFilesRequestError = (error: string) => ({
  type: FILES + ERROR,
  payload: error,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  talents: fromJS([]),
  isLoading: false,
  error: '',
  data: fromJS({}),
  isMemberLoading: false,
  memberError: '',
  files: [],
  isFileLoading: false,
  fileError: '',
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

    case MEMBER_PROFILE + REQUESTED:
      return state.set('isMemberLoading', true);

    case MEMBER_PROFILE + SUCCEDED:
      return state
        .set('isMemberLoading', false)
        .set('data', fromJS(payload))
        .set('memberError', '');

    case MEMBER_PROFILE + FAILED:
      return state.set('isMemberLoading', false).set('memberError', payload);

    case MEMBER_PROFILE + ERROR:
      return state.set('isMemberLoading', false).set(
        'memberError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case FILES + REQUESTED:
      return state.set('isFileLoading', true);

    case FILES + SUCCEDED:
      return state
        .set('isFileLoading', false)
        .set('files', fromJS(payload))
        .set('fileError', '');

    case FILES + FAILED:
      return state.set('isFileLoading', false).set('fileError', payload);

    case FILES + ERROR:
      return state.set('isFileLoading', false).set(
        'fileError',
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
function* MemberTalentsRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/talent/user/${payload}`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(memberTalentsRequestSuccess(response.data.response));
    } else {
      yield put(memberTalentsRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(memberTalentsRequestError(error));
  }
}

function* MemberProfileRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/user/slug/${payload}`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(memberProfileRequestSuccess(response.data.response));
    } else {
      yield put(memberProfileRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(memberProfileRequestError(error));
  }
}

function* MemberFilesRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/user/slug/${payload}/files`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(memberFilesRequestSuccess(response.data.response));
    } else {
      yield put(memberFilesRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(memberFilesRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(TALENTS + REQUESTED, MemberTalentsRequest),
    takeLatest(MEMBER_PROFILE + REQUESTED, MemberProfileRequest),
    takeLatest(FILES + REQUESTED, MemberFilesRequest),
  ]);
}
