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
const ROLES = 'Jolly/Member/ROLES';
const MEMBER_PROFILE = 'Jolly/Member/MEMBER_PROFILE';
const MEMBER_BADGES = 'Jolly/Member/MEMBER_BADGES';
const FILES = 'Jolly/Member/FILES';
const WORKS = 'Jolly/Member/WORKS';
const COWORKERS = 'Jolly/Member/COWORKERS';
const ENDORSEMENTS = 'Jolly/Member/ENDORSEMENTS';
const CREATE_CONNECTION = 'Jolly/Member/CREATE_CONNECTION';
const DELETE_CONNECTION = 'Jolly/Member/DELETE_CONNECTION';
const CONNECTION_INFORMATION = 'Jolly/Member/CONNECTION_INFORMATION';
const CHECK_CONNECTION = 'Jolly/Network/CHECK_CONNECTION';

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

export const requestMemberBadges = (slug: string) => ({
  type: MEMBER_BADGES + REQUESTED,
  payload: slug,
});
const memberBadgesRequestSuccess = (payload: Object) => ({
  type: MEMBER_BADGES + SUCCEDED,
  payload,
});
const memberBadgesRequestFailed = (error: string) => ({
  type: MEMBER_BADGES + FAILED,
  payload: error,
});
const memberBadgesRequestError = (error: string) => ({
  type: MEMBER_BADGES + ERROR,
  payload: error,
});

export const requestMemberRoles = (slug: string) => ({
  type: ROLES + REQUESTED,
  payload: slug,
});
const memberRolesRequestSuccess = (payload: Object) => ({
  type: ROLES + SUCCEDED,
  payload,
});
const memberRolesRequestFailed = (error: string) => ({
  type: ROLES + FAILED,
  payload: error,
});
const memberRolesRequestError = (error: string) => ({
  type: ROLES + ERROR,
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

export const requestMemberWorks = (slug: string) => ({
  type: WORKS + REQUESTED,
  payload: slug,
});
const memberWorksRequestSuccess = (payload: Object) => ({
  type: WORKS + SUCCEDED,
  payload,
});
const memberWorksRequestFailed = (error: string) => ({
  type: WORKS + FAILED,
  payload: error,
});
const memberWorksRequestError = (error: string) => ({
  type: WORKS + ERROR,
  payload: error,
});

export const requestMemberCoworkers = (slug: string) => ({
  type: COWORKERS + REQUESTED,
  payload: slug,
});
const memberCoworkersRequestSuccess = (payload: Object) => ({
  type: COWORKERS + SUCCEDED,
  payload,
});
const memberCoworkersRequestFailed = (error: string) => ({
  type: COWORKERS + FAILED,
  payload: error,
});
const memberCoworkersRequestError = (error: string) => ({
  type: COWORKERS + ERROR,
  payload: error,
});

export const requestMemberEndorsements = (userSlug: string) => ({
  type: ENDORSEMENTS + REQUESTED,
  payload: userSlug,
});
const memberEndorsementsRequestSuccess = (payload: Object) => ({
  type: ENDORSEMENTS + SUCCEDED,
  payload,
});
const memberEndorsementsRequestFailed = (error: string) => ({
  type: ENDORSEMENTS + FAILED,
  payload: error,
});
const memberEndorsementsRequestError = (error: string) => ({
  type: ENDORSEMENTS + ERROR,
  payload: error,
});

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

export const requestCheckConnection = (payload: Object) => ({
  type: CHECK_CONNECTION + REQUESTED,
  payload,
});
const connectionCheckRequestSuccess = (payload: Object) => ({
  type: CHECK_CONNECTION + SUCCEDED,
  payload,
});
const connectionCheckRequestFailed = (error: string) => ({
  type: CHECK_CONNECTION + FAILED,
  payload: error,
});
const connectionCheckRequestError = (error: string) => ({
  type: CHECK_CONNECTION + ERROR,
  payload: error,
});

export const getConnectionInformation = (userProfile: Object) => ({
  type: CONNECTION_INFORMATION + REQUESTED,
  payload: userProfile,
});
const getConnectionInformationSuccess = (payload: Object) => ({
  type: CONNECTION_INFORMATION + SUCCEDED,
  payload,
});
const getConnectionInformationFailed = (error: string) => ({
  type: CONNECTION_INFORMATION + FAILED,
  payload: error,
});
const getConnectionInformationError = (error: string) => ({
  type: CONNECTION_INFORMATION + ERROR,
  payload: error,
});

export const requestDeleteConnection = (userId: string) => ({
  type: DELETE_CONNECTION + REQUESTED,
  payload: userId,
});
const connectionDeleteRequestSuccess = (payload: Object) => ({
  type: DELETE_CONNECTION + SUCCEDED,
  payload,
});
const connectionDeleteRequestFailed = (error: string) => ({
  type: DELETE_CONNECTION + FAILED,
  payload: error,
});
const connectionDeleteRequestError = (error: string) => ({
  type: DELETE_CONNECTION + ERROR,
  payload: error,
});
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  roles: fromJS([]),
  isLoading: false,
  error: '',
  data: fromJS({}),
  isMemberLoading: false,
  memberError: '',
  badges: null,
  isBadgesLoading: false,
  badgesError: '',
  files: [],
  isFileLoading: false,
  fileError: '',
  works: null,
  isWorksLoading: false,
  worksError: '',
  endorsements: fromJS([]),
  isEndorsementsLoading: false,
  endorsementsError: '',
  coworkers: null,
  isCoworkersLoading: false,
  coworkersError: '',
  isCreatingConnection: false,
  createConnectionError: '',
  isDeletingConnection: false,
  deleteConnectionError: '',
  isRequestingConnectionInformation: false,
  requestingConnectionInformationError: '',
  isChecking: false,
  checkError: '',
  connectionStatus: fromJS({}),
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
        .set('roles', fromJS(payload.roles))
        .set('error', '');

    case ROLES + FAILED:
      return state.set('isLoading', false).set('error', payload.message);

    case ROLES + ERROR:
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
      return state
        .set('isMemberLoading', false)
        .set('memberError', payload.message);

    case MEMBER_PROFILE + ERROR:
      return state.set('isMemberLoading', false).set(
        'memberError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case MEMBER_BADGES + REQUESTED:
      return state.set('isBadgesLoading', true);

    case MEMBER_BADGES + SUCCEDED:
      return state
        .set('isBadgesLoading', false)
        .set('badges', fromJS(payload))
        .set('badgesError', '');

    case MEMBER_BADGES + FAILED:
      return state
        .set('isBadgesLoading', false)
        .set('badgesError', payload.message);

    case MEMBER_BADGES + ERROR:
      return state.set('isBadgesLoading', false).set(
        'badgesError',
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
      return state
        .set('isFileLoading', false)
        .set('fileError', payload.message);

    case FILES + ERROR:
      return state.set('isFileLoading', false).set(
        'fileError',
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

    case COWORKERS + REQUESTED:
      return state.set('isCoworkersLoading', true);

    case COWORKERS + SUCCEDED:
      return state
        .set('isCoworkersLoading', false)
        .set('coworkers', fromJS(payload.coworkers))
        .set('coworkersError', '');

    case COWORKERS + FAILED:
      return state
        .set('isCoworkersLoading', false)
        .set('coworkersError', payload);

    case COWORKERS + ERROR:
      return state.set('isFileLoading', false);

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

    case CREATE_CONNECTION + REQUESTED:
      return state.set('isCreatingConnection', true);

    case CREATE_CONNECTION + SUCCEDED:
      return state
        .set('isCreatingConnection', false)
        .set('createConnectionError', '');

    case CREATE_CONNECTION + FAILED:
      return state
        .set('isCreatingConnection', false)
        .set('createConnectionError', payload.message);

    case CREATE_CONNECTION + ERROR:
      return state.set('isCreatingConnection', false).set(
        'createConnectionError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );
    case DELETE_CONNECTION + REQUESTED:
      return state.set('isDeletingConnection', true);

    case DELETE_CONNECTION + SUCCEDED:
      return state
        .set('isDeletingConnection', false)
        .set('deleteConnectionError', '');

    case DELETE_CONNECTION + FAILED:
      return state
        .set('isDeletingConnection', false)
        .set('deleteConnectionError', payload.message);

    case DELETE_CONNECTION + ERROR:
      return state.set('isDeletingConnection', false).set(
        'createConnectionError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case CONNECTION_INFORMATION + REQUESTED:
      return state.set('isRequestingConnectionInformation', true);

    case CONNECTION_INFORMATION + SUCCEDED:
      return state
        .set('isRequestingConnectionInformation', false)
        .set('requestingConnectionInformationError', '')
        .set('connectionInformation', payload.connectionType);

    case CONNECTION_INFORMATION + FAILED:
      return state
        .set('isRequestingConnectionInformation', false)
        .set('requestingConnectionInformationError', payload.message);

    case CONNECTION_INFORMATION + ERROR:
      return state.set('isRequestingConnectionInformation', false).set(
        'requestingConnectionInformationError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case CHECK_CONNECTION + REQUESTED:
      return state.set('isChecking', true);

    case CHECK_CONNECTION + SUCCEDED:
      return state
        .set('isChecking', false)
        .set('connectionStatus', fromJS(payload))
        .set('checkError', '');

    case CHECK_CONNECTION + FAILED:
      return state.set('isChecking', false).set('checkError', payload.message);

    case CHECK_CONNECTION + ERROR:
      return state.set('isChecking', false).set(
        'checkError',
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
function* MemberRolesRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/role/user/${payload}`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(memberRolesRequestSuccess(response.data.response));
    } else {
      yield put(memberRolesRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(memberRolesRequestError(error));
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
      yield all([
        put(memberProfileRequestSuccess(response.data.response)),
        put(getConnectionInformation(response.data.response)),
      ]);
    } else {
      yield put(memberProfileRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(memberProfileRequestError(error));
  }
}

function* MemberBadgesRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/user/${payload}/badges`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(memberBadgesRequestSuccess(response.data.response));
    } else {
      yield put(memberBadgesRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(memberBadgesRequestError(error));
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

function* MemberWorksRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/work/user/${payload}`,
    });
    if (response.status === 200) {
      yield put(memberWorksRequestSuccess(response.data.response));
    } else {
      yield put(memberWorksRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(memberWorksRequestError(error));
  }
}

function* MemberCoworkersRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/user/${payload}/coworkers`,
    });
    if (response.status === 200) {
      yield put(memberCoworkersRequestSuccess(response.data.response));
    } else {
      yield put(memberCoworkersRequestFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(memberCoworkersRequestError(error));
  }
}

function* EndorsementsRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/endorsement/user/${payload}`,
    });
    if (response.status === 200) {
      yield put(memberEndorsementsRequestSuccess(response.data.response));
    } else {
      yield put(memberEndorsementsRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(memberEndorsementsRequestError(error));
  }
}

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

function* DeleteConnectionRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/connection/${payload}/disconnect`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield all([
        put(connectionDeleteRequestSuccess(response.data.response)),
        put(getConnectionInformation(response.data.response)),
      ]);
    } else {
      yield put(connectionDeleteRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(connectionDeleteRequestError(error));
  }
}

function* CreateConnectionInformationRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/connection/${payload.id}/info`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(getConnectionInformationSuccess(response.data.response));
    } else {
      yield put(getConnectionInformationFailed(response.data.error));
    }
  } catch (error) {
    yield put(getConnectionInformationError(error));
  }
}

function* CheckConnectionRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/connection/check`,
      data: {
        toSlug: payload.toSlug,
        from: payload.from,
      },
      headers: { 'x-access-token': token },
    });

    if (response.status === 200) {
      yield put(connectionCheckRequestSuccess(response.data.response));
    } else {
      yield put(connectionCheckRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(connectionCheckRequestError(error));
  }
}

export default function*(): Saga<void> {
  yield all([
    takeLatest(ROLES + REQUESTED, MemberRolesRequest),
    takeLatest(MEMBER_PROFILE + REQUESTED, MemberProfileRequest),
    takeLatest(MEMBER_BADGES + REQUESTED, MemberBadgesRequest),
    takeLatest(FILES + REQUESTED, MemberFilesRequest),
    takeLatest(WORKS + REQUESTED, MemberWorksRequest),
    takeLatest(COWORKERS + REQUESTED, MemberCoworkersRequest),
    takeLatest(ENDORSEMENTS + REQUESTED, EndorsementsRequest),
    takeLatest(CREATE_CONNECTION + REQUESTED, CreateConnectionRequest),
    takeLatest(DELETE_CONNECTION + REQUESTED, DeleteConnectionRequest),
    takeLatest(
      CONNECTION_INFORMATION + REQUESTED,
      CreateConnectionInformationRequest
    ),
    takeLatest(CHECK_CONNECTION + REQUESTED, CheckConnectionRequest),
  ]);
}
