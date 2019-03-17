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
const CREATE = 'Jolly/Feed/CREATE_POST';
const REMOVE = 'Jolly/Feed/REMOVE_POST';
const POST = 'Jolly/Feed/POST';
const VOTE = 'Jolly/Feed/VOTE_POST';
// ------------------------------------
// Actions
// ------------------------------------
export const requestCreatePost = (payload: Object) => ({
  type: CREATE + REQUESTED,
  payload,
});
const postCreateRequestSuccess = (payload: Object) => ({
  type: CREATE + SUCCEDED,
  payload,
});
const postCreateRequestFailed = (error: string) => ({
  type: CREATE + FAILED,
  payload: error,
});
const postCreateRequestError = (error: string) => ({
  type: CREATE + ERROR,
  payload: error,
});

export const requestRemovePost = (id: string) => ({
  type: REMOVE + REQUESTED,
  payload: id,
});
const postRemoveRequestSuccess = (payload: Object) => ({
  type: REMOVE + SUCCEDED,
  payload,
});
const postRemoveRequestFailed = (error: string) => ({
  type: REMOVE + FAILED,
  payload: error,
});
const postRemoveRequestError = (error: string) => ({
  type: REMOVE + ERROR,
  payload: error,
});

export const requestPosts = (query: Object) => ({
  type: POST + REQUESTED,
  payload: query,
});
const postsRequestSuccess = (payload: Object) => ({
  type: POST + SUCCEDED,
  payload,
});
const postsRequestFailed = (error: string) => ({
  type: POST + FAILED,
  payload: error,
});
const postsRequestError = (error: string) => ({
  type: POST + ERROR,
  payload: error,
});

export const requestVotePost = (postId: string) => ({
  type: VOTE + REQUESTED,
  payload: postId,
});
const postVoteRequestSuccess = (payload: Object) => ({
  type: VOTE + SUCCEDED,
  payload,
});
const postVoteRequestFailed = (error: string) => ({
  type: VOTE + FAILED,
  payload: error,
});
const postVoteRequestError = (error: string) => ({
  type: VOTE + ERROR,
  payload: error,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  posts: null,
  isLoading: false,
  error: '',
  isCreating: false,
  createError: '',
  isRemoving: false,
  removeError: '',
  isVoting: false,
  voteError: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload }: Action
) => {
  switch (type) {
    case CREATE + REQUESTED:
      return state.set('isCreating', true);

    case CREATE + SUCCEDED:
      return state.set('isCreating', false).set('createError', '');

    case CREATE + FAILED:
      return state.set('isCreating', false).set('createError', payload.message);

    case CREATE + ERROR:
      return state.set('isCreating', false).set(
        'createError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case REMOVE + REQUESTED:
      return state.set('isRemoving', true);

    case REMOVE + SUCCEDED:
      return state.set('isRemoving', false).set('removeError', '');

    case REMOVE + FAILED:
      return state.set('isRemoving', false).set('removeError', payload.message);

    case REMOVE + ERROR:
      return state.set('isRemoving', false).set(
        'removeError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case POST + REQUESTED:
      return state.set('isLoading', true);

    case POST + SUCCEDED:
      return state
        .set('isLoading', false)
        .set('posts', fromJS(payload.posts))
        .set('error', '');

    case POST + FAILED:
      return state.set('isLoading', false).set('error', payload.message);

    case POST + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case VOTE + REQUESTED:
      return state.set('isVoting', true);

    case VOTE + SUCCEDED:
      return state.set('isVoting', false).set('voteError', '');

    case VOTE + FAILED:
      return state.set('isVoting', false).set('voteError', payload.message);

    case VOTE + ERROR:
      return state.set('isVoting', false).set(
        'voteError',
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
function* CreatePostRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/post`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(postCreateRequestSuccess(response.data.response));
    } else {
      yield put(postCreateRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(postCreateRequestError(error));
  }
}

function* RemovePostRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/post/${payload}`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(postRemoveRequestSuccess(response.data.response));
    } else {
      yield put(postRemoveRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(postRemoveRequestError(error));
  }
}

function* PostsRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/post/search`,
      headers: { 'x-access-token': token },
      data: {
        query: payload,
      },
    });
    if (response.status === 200) {
      yield put(postsRequestSuccess(response.data.response));
    } else {
      yield put(postsRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(postsRequestError(error));
  }
}

function* PostVoteRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/post/${payload}/vote`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(postVoteRequestSuccess(response.data.response));
    } else {
      yield put(postVoteRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(postVoteRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(CREATE + REQUESTED, CreatePostRequest),
    takeLatest(REMOVE + REQUESTED, RemovePostRequest),
    takeLatest(POST + REQUESTED, PostsRequest),
    takeLatest(VOTE + REQUESTED, PostVoteRequest),
  ]);
}
