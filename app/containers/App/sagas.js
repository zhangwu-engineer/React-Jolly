// @flow

// Rules on how to organize this file: https://github.com/erikras/ducks-modular-redux

import storage from 'store';
import { fromJS, List } from 'immutable';
import { call, put, select, takeLatest, all } from 'redux-saga/effects';
import request from 'utils/request';
import { API_URL, REQUESTED, SUCCEDED, FAILED, ERROR } from 'enum/constants';
import { LOCATION_CHANGE } from 'react-router-redux';
import type { Action, State } from 'types/common';
import type { Saga } from 'redux-saga';
import { getToken, getUserId, getAdminToken } from 'containers/App/selectors';

// ------------------------------------
// Constants
// ------------------------------------
const REGISTER = 'Jolly/App/REGISTER';
const LOGIN = 'Jolly/App/LOGIN';
const SOCIAL_LOGIN = 'Acheev/App/SOCIAL_LOGIN';
const LOGOUT = 'Jolly/App/LOGOUT';
const USER = 'Jolly/App/USER';
const USER_DATA_UPDATE = 'Jolly/App/UPDATE_USER_DATA';
const USER_PHOTO_UPLOAD = 'Jolly/App/USER_PHOTO_UPLOAD';
const USER_RESUME_UPLOAD = 'Jolly/App/USER_RESUME_UPLOAD';
const USER_RESUME_DELETE = 'Jolly/App/USER_RESUME_DELETE';
const USER_FILES = 'Jolly/App/USER_FILES';
const USER_COWORKERS = 'Jolly/App/USER_COWORKERS';
const EMAIL_VERIFICATION = 'Jolly/App/EMAIL_VERIFICATION';
const CITY_USERS = 'Jolly/App/CITY_USERS';
const SIGNUP_INVITE = 'Jolly/App/SIGNUP_INVITE';
const MEMBER = 'Jolly/App/Member';
const WORKS = 'Jolly/App/WORKS';
const ENDORSEMENTS = 'Jolly/App/ENDORSEMENTS';
const OPEN_NAVBAR = 'Jolly/App/OPEN_NAVBAR';
const CLOSE_NAVBAR = 'Jolly/App/CLOSE_NAVBAR';
const ADMIN_LOGIN = 'Jolly/App/ADMIN_LOGIN';
const ADMIN_USER = 'Jolly/App/ADMIN_USER';
const ADMIN_LOGOUT = 'Jolly/App/ADMIN_LOGOUT';

const SET_META_JSON = 'Jolly/App/SET_META_JSON';

declare var analytics;
// ------------------------------------
// Actions
// ------------------------------------
export const requestRegister = (payload: Object, invite: ?Object) => ({
  type: REGISTER + REQUESTED,
  payload,
  meta: invite,
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

export const requestUserResumeUpload = (resume: string) => ({
  type: USER_RESUME_UPLOAD + REQUESTED,
  payload: resume,
});
const userResumeUploadSuccess = (payload: Object) => ({
  type: USER_RESUME_UPLOAD + SUCCEDED,
  payload,
});
const userResumeUploadFailed = error => ({
  type: USER_RESUME_UPLOAD + FAILED,
  payload: error,
});
const userResumeUploadError = error => ({
  type: USER_RESUME_UPLOAD + ERROR,
  payload: error,
});

export const requestUserResumeDelete = () => ({
  type: USER_RESUME_DELETE + REQUESTED,
});
const userResumeDeleteSuccess = (payload: Object) => ({
  type: USER_RESUME_DELETE + SUCCEDED,
  payload,
});
const userResumeDeleteFailed = error => ({
  type: USER_RESUME_DELETE + FAILED,
  payload: error,
});
const userResumeDeleteError = error => ({
  type: USER_RESUME_DELETE + ERROR,
  payload: error,
});

export const requestLogin = (payload: Object, invite: ?Object) => ({
  type: LOGIN + REQUESTED,
  payload,
  meta: invite,
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

export const requestSocialLogin = (
  payload: Object,
  type: string,
  invite: ?Object
) => ({
  type: SOCIAL_LOGIN + REQUESTED,
  payload,
  meta: {
    type,
    invite,
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

export const requestUserCoworkers = (
  slug: string,
  city: string,
  query: string,
  role: string
) => ({
  type: USER_COWORKERS + REQUESTED,
  payload: slug,
  meta: {
    city,
    query,
    role,
  },
});
const userCoworkersRequestSuccess = (payload: Object) => ({
  type: USER_COWORKERS + SUCCEDED,
  payload,
});
const userCoworkersRequestFailed = (error: string) => ({
  type: USER_COWORKERS + FAILED,
  payload: error,
});
const userCoworkersRequestError = (error: string) => ({
  type: USER_COWORKERS + ERROR,
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

export const requestCityUsers = (
  city: string,
  query: string,
  page: Number,
  perPage: Number,
  role: string
) => ({
  type: CITY_USERS + REQUESTED,
  payload: city,
  meta: {
    query,
    role,
    page,
    perPage,
  },
});
const cityUsersRequestSuccess = (payload: Object) => ({
  type: CITY_USERS + SUCCEDED,
  payload,
});
const cityUsersRequestFailed = (error: string) => ({
  type: CITY_USERS + FAILED,
  payload: error,
});
const cityUsersRequestError = (error: string) => ({
  type: CITY_USERS + ERROR,
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

export const requestSignupInvite = (email: string) => ({
  type: SIGNUP_INVITE + REQUESTED,
  payload: email,
});
const signupInviteRequestSuccess = (payload: Object) => ({
  type: SIGNUP_INVITE + SUCCEDED,
  payload,
});
const signupInviteRequestFailed = (error: string) => ({
  type: SIGNUP_INVITE + FAILED,
  payload: error,
});
const signupInviteRequestError = (error: string) => ({
  type: SIGNUP_INVITE + ERROR,
  payload: error,
});

export const requestAdminLogin = (payload: Object) => ({
  type: ADMIN_LOGIN + REQUESTED,
  payload,
});
export const adminLoginRequestSuccess = (payload: Object) => ({
  type: ADMIN_LOGIN + SUCCEDED,
  payload,
});
const adminLoginRequestFailed = (error: string) => ({
  type: ADMIN_LOGIN + FAILED,
  payload: error,
});
const adminLoginRequestError = (error: string) => ({
  type: ADMIN_LOGIN + ERROR,
  payload: error,
});

export const requestAdminUser = () => ({
  type: ADMIN_USER + REQUESTED,
});
export const adminUserRequestSuccess = (payload: Object) => ({
  type: ADMIN_USER + SUCCEDED,
  payload,
});
const adminUserRequestFailed = (error: string) => ({
  type: ADMIN_USER + FAILED,
  payload: error,
});
const adminUserRequestError = (error: string) => ({
  type: ADMIN_USER + ERROR,
  payload: error,
});

export const logoutAdmin = () => ({
  type: ADMIN_LOGOUT,
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
  adminUser: fromJS(storage.get('adminUser')),
  adminToken: storage.get('adminToken'),
  isAdminLoading: false,
  adminError: '',
  isUpdating: false,
  updateError: '',
  isUploading: false,
  uploadError: '',
  isResumeUploading: false,
  resumeUploadError: '',
  isResumeDeleting: false,
  resumeDeleteError: '',
  navbarOpen: false,
  metaJson: {},
  isSocialLoading: false,
  socialError: '',
  files: [],
  isFileLoading: false,
  fileError: '',
  coworkers: null,
  isCoworkersLoading: false,
  coworkersError: '',
  member: fromJS({}),
  isMemberLoading: false,
  memberError: '',
  works: null,
  isWorksLoading: false,
  worksError: '',
  endorsements: fromJS([]),
  isEndorsementsLoading: false,
  endorsementsError: '',
  cityUsers: fromJS({
    total: null,
    page: null,
    users: [],
  }),
  isCityUsersLoading: false,
  cityUsersError: '',
  isSignupInviteLoading: false,
  signupInviteError: '',
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
      return state.set('isUpdating', true).set('updateError', null);

    case USER_DATA_UPDATE + SUCCEDED:
      return state.set('isUpdating', false).set('updateError', '');

    case USER_DATA_UPDATE + FAILED:
      return state.set('isUpdating', false).set('updateError', payload);

    case USER_DATA_UPDATE + ERROR:
      return state.set('isUpdating', false).set(
        'updateError',
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

    case USER_RESUME_UPLOAD + REQUESTED:
      return state
        .set('isResumeUploading', true)
        .set('resumeUploadError', null);

    case USER_RESUME_UPLOAD + SUCCEDED:
      return state.set('isResumeUploading', false).set('resumeUploadError', '');

    case USER_RESUME_UPLOAD + FAILED:
      return state
        .set('isResumeUploading', false)
        .set('resumeUploadError', payload);

    case USER_RESUME_UPLOAD + ERROR:
      return state.set('isResumeUploading', false).set(
        'resumeUploadError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case USER_RESUME_DELETE + REQUESTED:
      return state.set('isResumeDeleting', true).set('resumeDeleteError', null);

    case USER_RESUME_DELETE + SUCCEDED:
      return state.set('isResumeDeleting', false).set('resumeDeleteError', '');

    case USER_RESUME_DELETE + FAILED:
      return state
        .set('isResumeDeleting', false)
        .set('resumeDeleteError', payload);

    case USER_RESUME_DELETE + ERROR:
      return state.set('isResumeDeleting', false).set(
        'resumeDeleteError',
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
      return state.set('isCoworkersLoading', false);

    case USER_COWORKERS + REQUESTED:
      return state.set('isCoworkersLoading', true);

    case USER_COWORKERS + SUCCEDED:
      return state
        .set('isCoworkersLoading', false)
        .set('coworkers', fromJS(payload.coworkers))
        .set('coworkersError', '');

    case USER_COWORKERS + FAILED:
      return state
        .set('isCoworkersLoading', false)
        .set('coworkersError', payload);

    case USER_COWORKERS + ERROR:
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

    case CITY_USERS + REQUESTED:
      return state.set('isCityUsersLoading', true);

    case CITY_USERS + SUCCEDED: {
      const existingUsers: List = state.getIn(['cityUsers', 'users']);
      const currentPage = state.getIn(['cityUsers', 'page']);
      let newUsers;
      if (currentPage !== payload.page && payload.page !== 1) {
        newUsers = existingUsers.concat(fromJS(payload.users));
      } else {
        newUsers = fromJS(payload.users);
      }
      return state
        .set('isCityUsersLoading', false)
        .setIn(['cityUsers', 'total'], payload.total)
        .setIn(['cityUsers', 'page'], payload.page)
        .setIn(['cityUsers', 'users'], newUsers)
        .set('cityUsersError', '');
    }

    case CITY_USERS + FAILED:
      return state
        .set('isCityUsersLoading', false)
        .set('cityUsersError', payload.message);

    case CITY_USERS + ERROR:
      return state.set('isCityUsersLoading', false).set(
        'cityUsersError',
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

    case SIGNUP_INVITE + REQUESTED:
      return state.set('isSignupInviteLoading', true);

    case SIGNUP_INVITE + SUCCEDED:
      return state
        .set('isSignupInviteLoading', false)
        .set('signupInviteError', '');

    case SIGNUP_INVITE + FAILED:
      return state
        .set('isSignupInviteLoading', false)
        .set('signupInviteError', payload.message);

    case SIGNUP_INVITE + ERROR:
      return state.set('isSignupInviteLoading', false).set(
        'signupInviteError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case ADMIN_LOGIN + REQUESTED:
      return state.set('isAdminLoading', true);

    case ADMIN_LOGIN + SUCCEDED: {
      storage.set('adminToken', payload.auth_token);
      return state
        .set('isAdminLoading', false)
        .set('adminToken', payload.auth_token)
        .set('adminError', '');
    }

    case ADMIN_LOGIN + FAILED:
      return state.set('isAdminLoading', false).set('adminError', payload);

    case ADMIN_LOGIN + ERROR:
      return state.set('isAdminLoading', false).set(
        'adminError',
        `Something went wrong.
        Please try again later or contact support and provide the following error information: ${payload}`
      );

    case ADMIN_USER + REQUESTED:
      return state.set('isAdminLoading', true);

    case ADMIN_USER + SUCCEDED:
      storage.set('adminUser', payload);
      return state
        .set('isAdminLoading', false)
        .set('adminUser', fromJS(payload))
        .set('adminError', '');

    case ADMIN_USER + FAILED:
      return state.set('isAdminLoading', false).set('adminError', payload);

    case ADMIN_USER + ERROR:
      return state.set('isAdminLoading', false);

    case ADMIN_LOGOUT:
      storage.remove('adminToken');
      storage.remove('adminUser');
      return state.set('adminUser', null).set('adminToken', null);

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
function* RegisterRequest({ payload, meta }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/register`,
      data: {
        ...payload,
        invite: meta,
      },
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

function* LoginRequest({ payload, meta }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/login`,
      data: {
        ...payload,
        invite: meta,
      },
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

function* SocialLoginRequest({ payload, meta: { type, invite } }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url:
        type === 'facebook'
          ? `${API_URL}/auth/facebook`
          : `${API_URL}/auth/linkedin`,
      data: {
        ...payload,
        invite,
      },
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

function* UploadUserResumeRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/resume`,
      data: {
        resume: payload,
      },
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(userResumeUploadSuccess(response.data.response));
      yield put(requestUser());
    } else {
      yield put(userResumeUploadFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(userResumeUploadError(error));
  }
}

function* DeleteUserResumeRequest() {
  const token = yield select(getToken);
  const userId = yield select(getUserId);
  try {
    const response = yield call(request, {
      method: 'DELETE',
      url: `${API_URL}/user/${userId}/resume`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(userResumeDeleteSuccess(response.data.response));
      yield put(requestUser());
    } else {
      yield put(userResumeDeleteFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(userResumeDeleteError(error));
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

function* UserCoworkersRequest({ payload, meta }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'GET',
      url: `${API_URL}/user/${payload}/coworkers`,
      headers: { 'x-access-token': token },
      params: meta,
    });
    if (response.status === 200) {
      yield put(userCoworkersRequestSuccess(response.data.response));
    } else {
      yield put(userCoworkersRequestFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(userCoworkersRequestError(error));
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

function* CityUsersRequest({ payload, meta }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/city`,
      data: {
        city: payload,
        query: meta.query,
        page: meta.page,
        perPage: meta.perPage,
        role: meta.role,
      },
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(cityUsersRequestSuccess(response.data.response));
    } else {
      yield put(cityUsersRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(cityUsersRequestError(error));
  }
}

function* SignupInviteRequest({ payload }) {
  const token = yield select(getToken);
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/user/signup-invite`,
      data: {
        email: payload,
      },
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(signupInviteRequestSuccess(response.data.response));
    } else {
      yield put(signupInviteRequestFailed(response.data.error));
    }
  } catch (error) {
    yield put(signupInviteRequestError(error));
  }
}

function* AdminLoginRequest({ payload }) {
  try {
    const response = yield call(request, {
      method: 'POST',
      url: `${API_URL}/auth/admin-login`,
      data: payload,
    });
    if (response.status === 200) {
      yield put(adminLoginRequestSuccess(response.data.response));
      yield put(requestAdminUser());
    } else {
      yield put(adminLoginRequestFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(adminLoginRequestError(error));
  }
}

function* AdminUserRequest() {
  const token = yield select(getAdminToken);
  try {
    const response = yield call(request, {
      url: `${API_URL}/user/me`,
      headers: { 'x-access-token': token },
    });
    if (response.status === 200) {
      yield put(adminUserRequestSuccess(response.data.response));
    } else if (response.data.error.message === 'jwt expired') {
      yield put(adminUserRequestFailed(''));
      yield put(logoutAdmin());
    } else {
      yield put(adminUserRequestFailed(response.data.error.message));
    }
  } catch (error) {
    yield put(adminUserRequestError(error));
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
    takeLatest(USER_RESUME_UPLOAD + REQUESTED, UploadUserResumeRequest),
    takeLatest(USER_RESUME_DELETE + REQUESTED, DeleteUserResumeRequest),
    takeLatest(USER_FILES + REQUESTED, UserFilesRequest),
    takeLatest(USER_COWORKERS + REQUESTED, UserCoworkersRequest),
    takeLatest(EMAIL_VERIFICATION + REQUESTED, UserEmailVerificationRequest),
    takeLatest(MEMBER + REQUESTED, MemberRequest),
    takeLatest(WORKS + REQUESTED, WorksRequest),
    takeLatest(ENDORSEMENTS + REQUESTED, EndorsementsRequest),
    takeLatest(CITY_USERS + REQUESTED, CityUsersRequest),
    takeLatest(SIGNUP_INVITE + REQUESTED, SignupInviteRequest),
    takeLatest(ADMIN_LOGIN + REQUESTED, AdminLoginRequest),
    takeLatest(ADMIN_USER + REQUESTED, AdminUserRequest),
  ]);
}
