// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import { fromJS } from 'immutable';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getUserHeaders } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const CREATE = 'Jolly/Feed/CREATE_POST';
const UPDATE = 'Jolly/Feed/UPDATE_POST';
const REMOVE = 'Jolly/Feed/REMOVE_POST';
const POST = 'Jolly/Feed/POST';
const VOTE = 'Jolly/Feed/VOTE_POST';
const TOP_VOTED_USERS = 'Jolly/Feed/TOP_VOTED_USERS';
const CREATE_COMMENT = 'Jolly/Feed/CREATE_COMMENT';
const TOGGLE_COMMENT_SECTION = 'Jolly/Feed/TOGGLE_COMMENT_SECTION';
const SHOW_NEXT_COMMENT = 'Jolly/Feed/SHOW_NEXT_COMMENT';
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

export const requestUpdatePost = (id: string, payload: Object) => ({
  type: UPDATE + REQUESTED,
  payload,
  meta: id,
});
const postUpdateRequestSuccess = (payload: Object) => ({
  type: UPDATE + SUCCEDED,
  payload,
});
const postUpdateRequestFailed = (error: string) => ({
  type: UPDATE + FAILED,
  payload: error,
});
const postUpdateRequestError = (error: string) => ({
  type: UPDATE + ERROR,
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

export const requestTopUsers = (city: string) => ({
  type: TOP_VOTED_USERS + REQUESTED,
  payload: city,
});
const topUsersRequestSuccess = (payload: Object) => ({
  type: TOP_VOTED_USERS + SUCCEDED,
  payload,
});
const topUsersRequestFailed = (error: string) => ({
  type: TOP_VOTED_USERS + FAILED,
  payload: error,
});
const topUsersRequestError = (error: string) => ({
  type: TOP_VOTED_USERS + ERROR,
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

export const requestCreateComment = (payload: Object) => ({
  type: CREATE_COMMENT + REQUESTED,
  payload,
});
const commentCreateRequestSuccess = (payload: Object) => ({
  type: CREATE_COMMENT + SUCCEDED,
  payload,
});
const commentCreateRequestFailed = (error: string) => ({
  type: CREATE_COMMENT + FAILED,
  payload: error,
});
const commentCreateRequestError = (error: string) => ({
  type: CREATE_COMMENT + ERROR,
  payload: error,
});

export const toggleCommentSection = (postId: string) => ({
  type: TOGGLE_COMMENT_SECTION,
  payload: postId,
});

export const showNextComment = (postId: string) => ({
  type: SHOW_NEXT_COMMENT,
  payload: postId,
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  posts: null,
  topUsers: null,
  isLoading: false,
  isTopLoading: false,
  error: '',
  isCreating: false,
  createError: '',
  isUpdating: false,
  updateError: '',
  isRemoving: false,
  removeError: '',
  isVoting: false,
  voteError: '',
  isCommentCreating: false,
  commentCreateError: '',
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

    case UPDATE + REQUESTED:
      return state.set('isUpdating', true);

    case UPDATE + SUCCEDED:
      return state.set('isUpdating', false).set('updateError', '');

    case UPDATE + FAILED:
      return state.set('isUpdating', false).set('updateError', payload.message);

    case UPDATE + ERROR:
      return state.set('isUpdating', false).set(
        'updateError',
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

    case TOP_VOTED_USERS + REQUESTED:
      return state.set('isTopLoading', true);

    case TOP_VOTED_USERS + SUCCEDED:
      return state
        .set('isTopLoading', false)
        .set('topUsers', fromJS(payload.users))
        .set('error', '');

    case TOP_VOTED_USERS + FAILED:
      return state.set('isTopLoading', false).set('error', payload.message);

    case TOP_VOTED_USERS + ERROR:
      return state.set('isTopLoading', false).set(
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

    case CREATE_COMMENT + REQUESTED:
      return state.set('isCommentCreating', true);

    case CREATE_COMMENT + SUCCEDED: {
      const currentPosts = state.get('posts');
      const i = currentPosts.findIndex(
        post => post.get('id') === payload.comment.post
      );
      const currentPost = currentPosts.get(i);
      const currentComments = currentPost.get('comments');
      const currentFullComments = currentPost.get('fullComments');
      const newComments = currentComments.push(payload.comment.id);
      const newFullComments = currentFullComments.splice(
        0,
        0,
        fromJS(payload.comment)
      );
      const newPost = currentPost
        .set('comments', newComments)
        .set('fullComments', newFullComments);
      return state
        .setIn(['posts', i], newPost)
        .set('isCommentCreating', false)
        .set('commentCreateError', '');
    }

    case CREATE_COMMENT + FAILED:
      return state
        .set('isCommentCreating', false)
        .set('commentCreateError', payload.message);

    case CREATE_COMMENT + ERROR:
      return state.set('isCommentCreating', false).set(
        'commentCreateError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case TOGGLE_COMMENT_SECTION: {
      const currentPosts = state.get('posts');
      const i = currentPosts.findIndex(post => post.get('id') === payload);
      const currentStatus = currentPosts.getIn([i, 'showComments']);
      return state.setIn(['posts', i, 'showComments'], !currentStatus);
    }

    case SHOW_NEXT_COMMENT: {
      const currentPosts = state.get('posts');
      const i = currentPosts.findIndex(post => post.get('id') === payload);
      const currentPage = currentPosts.getIn([i, 'commentPage']);
      return state.setIn(['posts', i, 'commentPage'], currentPage + 1);
    }

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
  const header = yield select(getUserHeaders);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/post`,
      data: payload,
      headers: header,
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

function* UpdatePostRequest({ payload, meta }) {
  const header = yield select(getUserHeaders);
  try {
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/post/${meta}`,
      data: payload,
      headers: header,
    });
    if (response.status === 200) {
      yield put(postUpdateRequestSuccess(response.data.response));
    } else {
      yield put(postUpdateRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(postUpdateRequestError(error));
  }
}

function* RemovePostRequest({ payload }) {
  const header = yield select(getUserHeaders);
  try {
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/post/${payload}`,
      headers: header,
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
  const header = yield select(getUserHeaders);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/post/search`,
      headers: header,
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

function* TopUsersRequest({ payload }) {
  const header = yield select(getUserHeaders);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/top-voted`,
      headers: header,
      data: {
        city: payload,
      },
    });
    if (response.status === 200) {
      yield put(topUsersRequestSuccess(response.data.response));
    } else {
      yield put(topUsersRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(topUsersRequestError(error));
  }
}

function* PostVoteRequest({ payload }) {
  const header = yield select(getUserHeaders);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/post/${payload}/vote`,
      headers: header,
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

function* CreateCommentRequest({ payload }) {
  const header = yield select(getUserHeaders);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/comment`,
      data: payload,
      headers: header,
    });
    if (response.status === 200) {
      yield put(commentCreateRequestSuccess(response.data.response));
    } else {
      yield put(commentCreateRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(commentCreateRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(CREATE + REQUESTED, CreatePostRequest),
    takeLatest(UPDATE + REQUESTED, UpdatePostRequest),
    takeLatest(REMOVE + REQUESTED, RemovePostRequest),
    takeLatest(POST + REQUESTED, PostsRequest),
    takeLatest(TOP_VOTED_USERS + REQUESTED, TopUsersRequest),
    takeLatest(VOTE + REQUESTED, PostVoteRequest),
    takeLatest(CREATE_COMMENT + REQUESTED, CreateCommentRequest),
  ]);
}
