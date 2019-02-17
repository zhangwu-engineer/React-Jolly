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
const WORK = 'Jolly/Work/WORK';
const SEARCH_USERS = 'Jolly/Work/SEARCH_USERS';
const RELATED_USERS = 'Jolly/Work/RELATED_USERS';
const ADD_COWORKER = 'Jolly/Work/ADD_COWORKER';
const VERIFY_COWORKER = 'Jolly/Work/VERIFY_COWORKER';
const ENDORSE_USER = 'Jolly/Work/ENDORSE_USER';
const ENDORSEMENTS = 'Jolly/Work/ENDORSEMENTS';
const ENDORSERS = 'Jolly/Work/ENDORSERS';
const INVITE_INFORMATION = 'Jolly/Work/INVITE_INFORMATION';
const ACCEPT_INVITE = 'Jolly/Work/ACCEPT_INVITE';

declare var analytics;
// ------------------------------------
// Actions
// ------------------------------------
export const requestCreateWork = (payload: Array<Object>) => ({
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

export const requestWork = (payload: Object) => ({
  type: WORK + REQUESTED,
  payload,
});
const workRequestSuccess = (payload: Object) => ({
  type: WORK + SUCCEDED,
  payload,
});
const workRequestFailed = (error: string) => ({
  type: WORK + FAILED,
  payload: error,
});
const workRequestError = (error: string) => ({
  type: WORK + ERROR,
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

export const requestSearchUsers = (keyword: string) => ({
  type: SEARCH_USERS + REQUESTED,
  payload: keyword,
});
const usersSearchRequestSuccess = (payload: Object) => ({
  type: SEARCH_USERS + SUCCEDED,
  payload,
});
const usersSearchRequestFailed = (error: string) => ({
  type: SEARCH_USERS + FAILED,
  payload: error,
});
const usersSearchRequestError = (error: string) => ({
  type: SEARCH_USERS + ERROR,
  payload: error,
});

export const requestWorkRelatedUsers = (eventId: string) => ({
  type: RELATED_USERS + REQUESTED,
  payload: eventId,
});
const relatedUsersRequestSuccess = (payload: Object) => ({
  type: RELATED_USERS + SUCCEDED,
  payload,
});
const relatedUsersRequestFailed = (error: string) => ({
  type: RELATED_USERS + FAILED,
  payload: error,
});
const relatedUsersRequestError = (error: string) => ({
  type: RELATED_USERS + ERROR,
  payload: error,
});

export const requestAddCoworker = (eventId: string, coworker: string) => ({
  type: ADD_COWORKER + REQUESTED,
  payload: eventId,
  meta: coworker,
});
const coworkerAddRequestSuccess = (payload: Object) => ({
  type: ADD_COWORKER + SUCCEDED,
  payload,
});
const coworkerAddRequestFailed = (error: string) => ({
  type: ADD_COWORKER + FAILED,
  payload: error,
});
const coworkerAddRequestError = (error: string) => ({
  type: ADD_COWORKER + ERROR,
  payload: error,
});

export const requestVerifyCoworker = (payload: Object, eventId: string) => ({
  type: VERIFY_COWORKER + REQUESTED,
  payload,
  meta: eventId,
});
const coworkerVerifyRequestSuccess = (payload: Object) => ({
  type: VERIFY_COWORKER + SUCCEDED,
  payload,
});
const coworkerVerifyRequestFailed = (error: string) => ({
  type: VERIFY_COWORKER + FAILED,
  payload: error,
});
const coworkerVerifyRequestError = (error: string) => ({
  type: VERIFY_COWORKER + ERROR,
  payload: error,
});

export const requestEndorseUser = (workId: string) => ({
  type: ENDORSE_USER + REQUESTED,
  payload: workId,
});
const userEndorseRequestSuccess = (payload: Object) => ({
  type: ENDORSE_USER + SUCCEDED,
  payload,
});
const userEndorseRequestFailed = (error: string) => ({
  type: ENDORSE_USER + FAILED,
  payload: error,
});
const userEndorseRequestError = (error: string) => ({
  type: ENDORSE_USER + ERROR,
  payload: error,
});

export const requestEndorsements = (workId: string) => ({
  type: ENDORSEMENTS + REQUESTED,
  payload: workId,
});
const endorsementsRequestSuccess = (payload: Object) => ({
  type: ENDORSEMENTS + SUCCEDED,
  payload,
});
const endorsementsRequestFailed = (error: string) => ({
  type: ENDORSEMENTS + FAILED,
  payload: error,
});
const endorsementsRequestError = (error: string) => ({
  type: ENDORSEMENTS + ERROR,
  payload: error,
});

export const requestEndorsers = (workSlug: string, userSlug: string) => ({
  type: ENDORSERS + REQUESTED,
  payload: workSlug,
  meta: userSlug,
});
const endorsersRequestSuccess = (payload: Object) => ({
  type: ENDORSERS + SUCCEDED,
  payload,
});
const endorsersRequestFailed = (error: string) => ({
  type: ENDORSERS + FAILED,
  payload: error,
});
const endorsersRequestError = (error: string) => ({
  type: ENDORSERS + ERROR,
  payload: error,
});

export const requestInviteInformation = (token: string) => ({
  type: INVITE_INFORMATION + REQUESTED,
  payload: token,
});
const inviteInformationRequestSuccess = (payload: Object) => ({
  type: INVITE_INFORMATION + SUCCEDED,
  payload,
});
const inviteInformationRequestFailed = (error: string) => ({
  type: INVITE_INFORMATION + FAILED,
  payload: error,
});
const inviteInformationRequestError = (error: string) => ({
  type: INVITE_INFORMATION + ERROR,
  payload: error,
});

export const requestAcceptInvite = (payload: Object) => ({
  type: ACCEPT_INVITE + REQUESTED,
  payload,
});
const inviteAcceptRequestSuccess = (payload: Object) => ({
  type: ACCEPT_INVITE + SUCCEDED,
  payload,
});
const inviteAcceptRequestFailed = (error: string) => ({
  type: ACCEPT_INVITE + FAILED,
  payload: error,
});
const inviteAcceptRequestError = (error: string) => ({
  type: ACCEPT_INVITE + ERROR,
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
  users: fromJS([]),
  isUsersLoading: false,
  usersError: '',
  work: fromJS({}),
  isWorkLoading: false,
  workError: '',
  relatedUsers: fromJS([]),
  isRelatedUsersLoading: false,
  relatedUsersError: '',
  isAddingCoworker: false,
  addCoworkerError: '',
  isVerifyingCoworker: false,
  verifyCoworkerError: '',
  isEndorsing: false,
  endorseError: '',
  endorsements: fromJS([]),
  isEndorsementsLoading: false,
  endorsementsError: '',
  endorsers: fromJS([]),
  isEndorsersLoading: false,
  endorsersError: '',
  invite: null,
  isInviteLoading: false,
  inviteError: '',
  isAcceptInviteLoading: false,
  acceptInviteError: '',
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

    case WORK + REQUESTED:
      return state.set('isWorkLoading', true);

    case WORK + SUCCEDED:
      return state
        .set('isWorkLoading', false)
        .set('work', fromJS(payload.work[0]))
        .set('workError', '');

    case WORK + FAILED:
      return state
        .set('isWorkLoading', false)
        .set('workError', payload.message);

    case WORK + ERROR:
      return state.set('isWorkLoading', false).set(
        'workError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case ROLES + REQUESTED:
      return state.set('isRolesLoading', true);

    case ROLES + SUCCEDED:
      return state
        .set('isRolesLoading', false)
        .set('roles', fromJS(payload.roles))
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

    case SEARCH_USERS + REQUESTED:
      return state.set('isUsersLoading', true);

    case SEARCH_USERS + SUCCEDED:
      return state
        .set('isUsersLoading', false)
        .set('users', fromJS(payload.user_list))
        .set('usersError', '');

    case SEARCH_USERS + FAILED:
      return state
        .set('isUsersLoading', false)
        .set('usersError', payload.message);

    case SEARCH_USERS + ERROR:
      return state.set('isUsersLoading', false).set(
        'usersError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case RELATED_USERS + REQUESTED:
      return state.set('isRelatedUsersLoading', true);

    case RELATED_USERS + SUCCEDED:
      return state
        .set('isRelatedUsersLoading', false)
        .set('relatedUsers', fromJS(payload.users))
        .set('relatedUsersError', '');

    case RELATED_USERS + FAILED:
      return state
        .set('isRelatedUsersLoading', false)
        .set('relatedUsersError', payload.message);

    case RELATED_USERS + ERROR:
      return state.set('isRelatedUsersLoading', false).set(
        'relatedUsersError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case ADD_COWORKER + REQUESTED:
      return state.set('isAddingCoworker', true);

    case ADD_COWORKER + SUCCEDED:
      return state.set('isAddingCoworker', false).set('addCoworkerError', '');

    case ADD_COWORKER + FAILED:
      return state
        .set('isAddingCoworker', false)
        .set('addCoworkerError', payload.message);

    case ADD_COWORKER + ERROR:
      return state.set('isAddingCoworker', false).set(
        'addCoworkerError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case VERIFY_COWORKER + REQUESTED:
      return state.set('isVerifyingCoworker', true);

    case VERIFY_COWORKER + SUCCEDED:
      return state
        .set('isVerifyingCoworker', false)
        .set('verifyCoworkerError', '');

    case VERIFY_COWORKER + FAILED:
      return state
        .set('isVerifyingCoworker', false)
        .set('verifyCoworkerError', payload.message);

    case VERIFY_COWORKER + ERROR:
      return state.set('isVerifyingCoworker', false).set(
        'verifyCoworkerError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case ENDORSE_USER + REQUESTED:
      return state.set('isEndorsing', true);

    case ENDORSE_USER + SUCCEDED:
      return state.set('isEndorsing', false).set('endorseError', '');

    case ENDORSE_USER + FAILED:
      return state
        .set('isEndorsing', false)
        .set('endorseError', payload.message);

    case ENDORSE_USER + ERROR:
      return state.set('isEndorsing', false).set(
        'endorseError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case ENDORSEMENTS + REQUESTED:
      return state.set('isEndorsementsLoading', true);

    case ENDORSEMENTS + SUCCEDED:
      return state
        .set('isEndorsementsLoading', false)
        .set('endorsements', fromJS(payload.endorsements))
        .set('endorsementsError', '');

    case ENDORSEMENTS + FAILED:
      return state
        .set('isEndorsementsLoading', false)
        .set('endorsementsError', payload.message);

    case ENDORSEMENTS + ERROR:
      return state.set('isEndorsementsLoading', false).set(
        'endorsementsError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case ENDORSERS + REQUESTED:
      return state.set('isEndorsersLoading', true);

    case ENDORSERS + SUCCEDED:
      return state
        .set('isEndorsersLoading', false)
        .set('endorsers', fromJS(payload.endorsers))
        .set('endorsersError', '');

    case ENDORSERS + FAILED:
      return state
        .set('isEndorsersLoading', false)
        .set('endorsersError', payload.message);

    case ENDORSERS + ERROR:
      return state.set('isEndorsersLoading', false).set(
        'endorsersError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case INVITE_INFORMATION + REQUESTED:
      return state.set('isInviteLoading', true);

    case INVITE_INFORMATION + SUCCEDED:
      return state
        .set('isInviteLoading', false)
        .set('invite', fromJS(payload))
        .set('inviteError', '');

    case INVITE_INFORMATION + FAILED:
      return state
        .set('isInviteLoading', false)
        .set('inviteError', payload.message);

    case INVITE_INFORMATION + ERROR:
      return state.set('isInviteLoading', false).set(
        'inviteError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case ACCEPT_INVITE + REQUESTED:
      return state.set('isAcceptInviteLoading', true);

    case ACCEPT_INVITE + SUCCEDED:
      return state
        .set('isAcceptInviteLoading', false)
        .set('acceptInviteError', '');

    case ACCEPT_INVITE + FAILED:
      return state
        .set('isAcceptInviteLoading', false)
        .set('acceptInviteError', payload.message);

    case ACCEPT_INVITE + ERROR:
      return state.set('isAcceptInviteLoading', false).set(
        'acceptInviteError',
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
      data: {
        jobs: payload,
      },
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
      url: `${API_URL}/role`,
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

function* UsersSearchRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/search`,
      data: {
        keyword: payload,
      },
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(usersSearchRequestSuccess(response.data.response));
    } else {
      yield put(usersSearchRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(usersSearchRequestError(error));
  }
}

function* WorkRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/work/search`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(workRequestSuccess(response.data.response));
    } else {
      yield put(workRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(workRequestError(error));
  }
}

function* RelatedUsersRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/work/${payload}/user`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(relatedUsersRequestSuccess(response.data.response));
    } else {
      yield put(relatedUsersRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(relatedUsersRequestError(error));
  }
}

function* CoworkerAddRequest({ payload, meta }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/work/${payload}/addCoworker`,
      data: {
        coworker: meta,
      },
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(coworkerAddRequestSuccess(response.data.response));
    } else {
      yield put(coworkerAddRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(coworkerAddRequestError(error));
  }
}

function* CoworkerVerifyRequest({ payload, meta }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/work/${meta}/verifyCoworker`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(coworkerVerifyRequestSuccess(response.data.response));
    } else {
      yield put(coworkerVerifyRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(coworkerVerifyRequestError(error));
  }
}

function* EndorseUserRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/endorsement`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(userEndorseRequestSuccess(response.data.response));
    } else {
      yield put(userEndorseRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(userEndorseRequestError(error));
  }
}

function* EndorsementsRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/endorsement/work/${payload}`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(endorsementsRequestSuccess(response.data.response));
    } else {
      yield put(endorsementsRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(endorsementsRequestError(error));
  }
}

function* EndorsersRequest({ payload, meta }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/endorsement/work/${payload}/endorsers`,
      data: { userSlug: meta },
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(endorsersRequestSuccess(response.data.response));
    } else {
      yield put(endorsersRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(endorsersRequestError(error));
  }
}

function* InviteInformationRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/work/invite`,
      data: { token: payload },
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(inviteInformationRequestSuccess(response.data.response));
    } else {
      yield put(inviteInformationRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(inviteInformationRequestError(error));
  }
}

function* InviteAcceptRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/work/invite/accept`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(inviteAcceptRequestSuccess(response.data.response));
    } else {
      yield put(inviteAcceptRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(inviteAcceptRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(CREATE_WORK + REQUESTED, CreateWorkRequest),
    takeLatest(WORKS + REQUESTED, WorksRequest),
    takeLatest(ROLES + REQUESTED, RolesRequest),
    takeLatest(SEARCH_USERS + REQUESTED, UsersSearchRequest),
    takeLatest(WORK + REQUESTED, WorkRequest),
    takeLatest(RELATED_USERS + REQUESTED, RelatedUsersRequest),
    takeLatest(ADD_COWORKER + REQUESTED, CoworkerAddRequest),
    takeLatest(VERIFY_COWORKER + REQUESTED, CoworkerVerifyRequest),
    takeLatest(ENDORSE_USER + REQUESTED, EndorseUserRequest),
    takeLatest(ENDORSEMENTS + REQUESTED, EndorsementsRequest),
    takeLatest(ENDORSERS + REQUESTED, EndorsersRequest),
    takeLatest(INVITE_INFORMATION + REQUESTED, InviteInformationRequest),
    takeLatest(ACCEPT_INVITE + REQUESTED, InviteAcceptRequest),
  ]);
}
