// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import storage from 'store';
import { fromJS } from 'immutable';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken, getUserId } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const REGISTER = 'Jolly/App/REGISTER';
const LOGIN = 'Jolly/App/LOGIN';
const SOCIAL_LOGIN = 'Acheev/App/SOCIAL_LOGIN';
const LOGOUT = 'Jolly/App/LOGOUT';
const USER = 'Jolly/App/USER';
const USER_DATA_UPDATE = 'Jolly/App/UPDATE_USER_DATA';
const USER_PHOTO_UPLOAD = 'Jolly/App/UPLOAD_USER_PHOTO';
const USER_FILES = 'Jolly/App/USER_FILES';
const EMAIL_VERIFICATION = 'Jolly/App/EMAIL_VERIFICATION';
const MEMBER = 'Jolly/App/Member';
const WORKS = 'Jolly/App/WORKS';
const ENDORSEMENTS = 'Jolly/App/ENDORSEMENTS';
const OPEN_NAVBAR = 'Jolly/App/OPEN_NAVBAR';
const CLOSE_NAVBAR = 'Jolly/App/CLOSE_NAVBAR';

const SET_META_JSON = 'Jolly/App/SET_META_JSON';

// ------------------------------------
// Actions
// ------------------------------------
export const requestRegister = (payload: Object) => ({
  type: REGISTER + REQUESTED,
  payload,
});
const registerRequestSuccess = (payload: Object) => ({
  type: REGISTER + SUCCEDED,
  payload,
});
const registerRequestFailed = (error: string) => ({
  type: REGISTER + FAILED,
  payload: error,
});
const registerRequestError = (error: string) => ({
  type: REGISTER + ERROR,
  payload: error,
});

export const requestUserDataUpdate = (payload: Object) => ({
  type: USER_DATA_UPDATE + REQUESTED,
  payload,
});

const userDataUpdateSuccess = (payload: Object) => ({
  type: USER_DATA_UPDATE + SUCCEDED,
  payload,
});

const userDataUpdateFailed = error => ({
  type: USER_DATA_UPDATE + FAILED,
  payload: error,
});
const userDataUpdateError = error => ({
  type: USER_DATA_UPDATE + ERROR,
  payload: error,
});

export const requestUserPhotoUpload = (photo: string, type: string) => ({
  type: USER_PHOTO_UPLOAD + REQUESTED,
  payload: photo,
  meta: type,
});
const userPhotoUploadSuccess = (payload: Object) => ({
  type: USER_PHOTO_UPLOAD + SUCCEDED,
  payload,
});
const userPhotoUploadFailed = error => ({
  type: USER_PHOTO_UPLOAD + FAILED,
  payload: error,
});
const userPhotoUploadError = error => ({
  type: USER_PHOTO_UPLOAD + ERROR,
  payload: error,
});

export const requestLogin = (payload: Object) => ({
  type: LOGIN + REQUESTED,
  payload,
});
export const loginRequestSuccess = (payload: Object) => ({
  type: LOGIN + SUCCEDED,
  payload,
});
const loginRequestFailed = (error: string) => ({
  type: LOGIN + FAILED,
  payload: error,
});
const loginRequestError = (error: string) => ({
  type: LOGIN + ERROR,
  payload: error,
});

export const requestSocialLogin = (payload: Object, type: string) => ({
  type: SOCIAL_LOGIN + REQUESTED,
  payload,
  meta: {
    type,
  },
});
const socialLoginRequestSuccess = (payload: Object) => ({
  type: SOCIAL_LOGIN + SUCCEDED,
  payload,
});
const socialLoginRequestFailed = (error: string) => ({
  type: SOCIAL_LOGIN + FAILED,
  payload: error,
});
const socialLoginRequestError = (error: string) => ({
  type: SOCIAL_LOGIN + ERROR,
  payload: error,
});

export const logout = () => ({
  type: LOGOUT,
});

export const requestUser = () => ({
  type: USER + REQUESTED,
});
export const userRequestSuccess = (payload: Object) => ({
  type: USER + SUCCEDED,
  payload,
});
const userRequestFailed = (error: string) => ({
  type: USER + FAILED,
  payload: error,
});
const userRequestError = (error: string) => ({
  type: USER + ERROR,
  payload: error,
});

export const requestUserFiles = () => ({
  type: USER_FILES + REQUESTED,
});
const userFilesRequestSuccess = (payload: Object) => ({
  type: USER_FILES + SUCCEDED,
  payload,
});
const userFilesRequestFailed = (error: string) => ({
  type: USER_FILES + FAILED,
  payload: error,
});
const userFilesRequestError = (error: string) => ({
  type: USER_FILES + ERROR,
  payload: error,
});

export const requestUserEmailVerification = (payload: Object) => ({
  type: EMAIL_VERIFICATION + REQUESTED,
  payload,
});
const userEmailVerificationRequestSuccess = (payload: Object) => ({
  type: EMAIL_VERIFICATION + SUCCEDED,
  payload,
});
const userEmailVerificationRequestFailed = (error: string) => ({
  type: EMAIL_VERIFICATION + FAILED,
  payload: error,
});
const userEmailVerificationRequestError = (error: string) => ({
  type: EMAIL_VERIFICATION + ERROR,
  payload: error,
});

export const requestMember = (slug: string) => ({
  type: MEMBER + REQUESTED,
  payload: slug,
});
const memberRequestSuccess = (payload: Object) => ({
  type: MEMBER + SUCCEDED,
  payload,
});
const memberRequestFailed = (error: string) => ({
  type: MEMBER + FAILED,
  payload: error,
});
const memberRequestError = (error: string) => ({
  type: MEMBER + ERROR,
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

export const requestEndorsements = () => ({
  type: ENDORSEMENTS + REQUESTED,
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

export const openNavbar = () => ({
  type: OPEN_NAVBAR,
});

export const closeNavbar = () => ({
  type: CLOSE_NAVBAR,
});

export const setMetaJson = (path: string, value: ?Object) => ({
  type: SET_META_JSON,
  payload: value,
  meta: {
    path,
  },
});

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = fromJS({
  user: fromJS(storage.get('user')),
  token: storage.get('token'),
  isLoading: false,
  error: '',
  isUploading: false,
  uploadError: '',
  navbarOpen: false,
  metaJson: {},
  isSocialLoading: false,
  socialError: '',
  files: [],
  isFileLoading: false,
  fileError: '',
  member: fromJS({}),
  isMemberLoading: false,
  memberError: '',
  works: null,
  isWorksLoading: false,
  worksError: '',
  endorsements: fromJS([]),
  isEndorsementsLoading: false,
  endorsementsError: '',
});

export const reducer = (
  state: State = initialState,
  { type, payload, meta }: Action
) => {
  switch (type) {
    case REGISTER + REQUESTED:
      return state.set('isLoading', true).set('error', null);

    case REGISTER + SUCCEDED: {
      storage.set('token', payload.auth_token);
      analytics.identify(payload.user.id, {
        full_name: `${payload.user.firstName} ${payload.user.lastName}`,
        email: payload.user.email,
      });
      analytics.track('Signed Up', {
        user_id: payload.user.id,
        full_name: `${payload.user.firstName} ${payload.user.lastName}`,
        email: payload.user.email,
        signup_method: 'email',
      });
      return state
        .set('isLoading', false)
        .set('token', payload.auth_token)
        .set('error', '');
    }

    case REGISTER + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case REGISTER + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case USER_DATA_UPDATE + REQUESTED:
      return state.set('isLoading', true).set('error', null);

    case USER_DATA_UPDATE + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case USER_DATA_UPDATE + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case USER_DATA_UPDATE + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case USER_PHOTO_UPLOAD + REQUESTED:
      return state.set('isUploading', true).set('uploadError', null);

    case USER_PHOTO_UPLOAD + SUCCEDED:
      return state.set('isUploading', false).set('uploadError', '');

    case USER_PHOTO_UPLOAD + FAILED:
      return state.set('isUploading', false).set('uploadError', payload);

    case USER_PHOTO_UPLOAD + ERROR:
      return state.set('isUploading', false).set(
        'uploadError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case LOGIN + REQUESTED:
      return state.set('isLoading', true);

    case LOGIN + SUCCEDED: {
      storage.set('token', payload.auth_token);
      analytics.identify(payload.user.id, {
        full_name: `${payload.user.firstName} ${payload.user.lastName}`,
        email: payload.user.email,
      });
      return state
        .set('isLoading', false)
        .set('token', payload.auth_token)
        .set('error', '');
    }

    case LOGIN + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case LOGIN + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case SOCIAL_LOGIN + REQUESTED:
      return state.set('isSocialLoading', true);

    case SOCIAL_LOGIN + SUCCEDED: {
      storage.set('token', payload.auth_token);
      analytics.identify(payload.user.id, {
        full_name: `${payload.user.firstName} ${payload.user.lastName}`,
        email: payload.user.email,
      });
      if (payload.action === 'signup') {
        analytics.track('Signed Up', {
          user_id: payload.user.id,
          full_name: `${payload.user.firstName} ${payload.user.lastName}`,
          email: payload.user.email,
          signup_method: payload.type,
        });
      }
      return state
        .set('isSocialLoading', false)
        .set('token', payload.auth_token)
        .set('socialError', '');
    }

    case SOCIAL_LOGIN + FAILED:
      return state.set('isSocialLoading', false).set('socialError', payload);

    case SOCIAL_LOGIN + ERROR:
      return state.set('isSocialLoading', false).set(
        'socialError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case LOGOUT:
      storage.remove('token');
      storage.remove('user');
      return state.set('user', null).set('token', null);

    case USER + REQUESTED:
      return state.set('isLoading', true);

    case USER + SUCCEDED:
      storage.set('user', payload);
      return state
        .set('isLoading', false)
        .set('user', fromJS(payload))
        .set('error', '');

    case USER + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case USER + ERROR:
      return state.set('isLoading', false);

    case USER_FILES + REQUESTED:
      return state.set('isFileLoading', true);

    case USER_FILES + SUCCEDED:
      return state
        .set('isFileLoading', false)
        .set('files', fromJS(payload))
        .set('fileError', '');

    case USER_FILES + FAILED:
      return state.set('isFileLoading', false).set('fileError', payload);

    case USER_FILES + ERROR:
      return state.set('isFileLoading', false);

    case EMAIL_VERIFICATION + REQUESTED:
      return state.set('isLoading', true);

    case EMAIL_VERIFICATION + SUCCEDED:
      return state.set('isLoading', false).set('error', '');

    case EMAIL_VERIFICATION + FAILED:
      return state.set('isLoading', false).set('error', payload);

    case EMAIL_VERIFICATION + ERROR:
      return state.set('isLoading', false).set(
        'error',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case MEMBER + REQUESTED:
      return state.set('isMemberLoading', true);

    case MEMBER + SUCCEDED:
      return state
        .set('isMemberLoading', false)
        .set('member', fromJS(payload))
        .set('memberError', '');

    case MEMBER + FAILED:
      return state
        .set('isMemberLoading', false)
        .set('memberError', payload.message);

    case MEMBER + ERROR:
      return state.set('isMemberLoading', false).set(
        'memberError',
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

    case OPEN_NAVBAR:
      return state.set('navbarOpen', true);

    case CLOSE_NAVBAR:
      return state.set('navbarOpen', false);

    case SET_META_JSON:
      if (meta.path)
        return state.setIn(['metaJson', ...meta.path], fromJS(payload));
      return state.set('metaJson', fromJS(payload));

    case LOCATION_CHANGE:
      return state.set('metaJson', fromJS({})).set('error', '');

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
function* RegisterRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/register`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(registerRequestSuccess(response.data.response));
      yield put(requestUser());
    } else {
      yield put(registerRequestFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(registerRequestError(error));
  }
}

function* LoginRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/login`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(loginRequestSuccess(response.data.response));
      yield put(requestUser());
    } else {
      yield put(loginRequestFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(loginRequestError(error));
  }
}

function* SocialLoginRequest({ payload, meta: { type } }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url:
        type === 'facebook'
          ? `${API_URL}/auth/facebook`
          : `${API_URL}/auth/linkedin`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(socialLoginRequestSuccess(response.data.response));
      yield put(requestUser());
    } else {
      yield put(socialLoginRequestFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(socialLoginRequestError(error));
  }
}

function* UserRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      url: `${API_URL}/user/me`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(userRequestSuccess(response.data.response));
    } else if (response.data.error.message === 'jwt expired') {
      yield put(userRequestFailed(''));
      yield put(logout());
    } else {
      yield put(userRequestFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(userRequestError(error));
  }
}

function* UpdateUserDataRequest({ payload }) {
  const token = yield select(getToken);
  const userId = yield select(getUserId);
  try {
    const response = yield call(request, {
      method: 'PUT',
      url: `${API_URL}/user/${userId}`,
      data: payload,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(userDataUpdateSuccess(response.data.response));
      yield put(requestUser());
    } else if (response.status === 403 || response.status === 401) {
      yield put(logout());
    } else {
      yield put(userDataUpdateFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(userDataUpdateError(error));
  }
}

function* UploadUserPhotoRequest({ payload, meta }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/image`,
      data: {
        image: payload,
      },
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(userPhotoUploadSuccess(response.data.response));
      if (meta === 'avatar' || meta === 'backgroundImage') {
        yield put(
          requestUserDataUpdate({
            profile: {
              [meta]: response.data.response.path,
            },
          })
        );
      }
    } else {
      yield put(userPhotoUploadFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(userPhotoUploadError(error));
  }
}

function* UserFilesRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/user/files`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(userFilesRequestSuccess(response.data.response));
    } else {
      yield put(userFilesRequestFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(userFilesRequestError(error));
  }
}

function* UserEmailVerificationRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/verify-email`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(userEmailVerificationRequestSuccess(response.data));
    } else {
      yield put(
        userEmailVerificationRequestFailed(response.data.error.message)
      );
    }
  } catch (error) {
    yield put(userEmailVerificationRequestError(error));
  }
}

function* MemberRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/user/slug/${payload}`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(memberRequestSuccess(response.data.response));
    } else {
      yield put(memberRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(memberRequestError(error));
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

function* EndorsementsRequest() {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/endorsement`,
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

export default function*(): Saga<void> {
  yield all([
    takeLatest(REGISTER + REQUESTED, RegisterRequest),
    takeLatest(LOGIN + REQUESTED, LoginRequest),
    takeLatest(SOCIAL_LOGIN + REQUESTED, SocialLoginRequest),
    takeLatest(USER + REQUESTED, UserRequest),
    takeLatest(USER_DATA_UPDATE + REQUESTED, UpdateUserDataRequest),
    takeLatest(USER_PHOTO_UPLOAD + REQUESTED, UploadUserPhotoRequest),
    takeLatest(USER_FILES + REQUESTED, UserFilesRequest),
    takeLatest(EMAIL_VERIFICATION + REQUESTED, UserEmailVerificationRequest),
    takeLatest(MEMBER + REQUESTED, MemberRequest),
    takeLatest(WORKS + REQUESTED, WorksRequest),
    takeLatest(ENDORSEMENTS + REQUESTED, EndorsementsRequest),
  ]);
}
