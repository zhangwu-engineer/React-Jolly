import CONFIG from '../conf';

export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const USERNAME_MIN_CHAR = 2;
export const USERNAME_MAX_CHAR = 30;

export const API_URL = CONFIG.API.URL;

export const REQUESTED = '_REQUESTED';
export const SUCCEDED = '_SUCCEDED';
export const STARTED = '_STARTED';
export const SKIPPED = '_SKIPPED';
export const FAILED = '_FAILED';
export const ERROR = '_ERROR';
export const CLEAR = '_CLEAR';

export const DEFAULT_LAT = 45.4215;
export const DEFAULT_LONG = -75.6972;

export const CATEGORY_OPTIONS = [
  {
    label: 'Gig info or question',
    value: 'gig-info-or-question',
  },
  {
    label: 'Work opportunity',
    value: 'work-opportunity',
  },
  {
    label: 'Business review',
    value: 'business-review',
  },
  {
    label: 'Coworker shout-out',
    value: 'coworker-shout-out',
  },
  {
    label: 'General message',
    value: 'general-message',
  },
];

export const BUSINESS_CATEGORY_OPTIONS = [
  {
    label: 'Event services',
    value: 'Event services',
  },
  {
    label: 'Event organizer',
    value: 'Event organizer',
  },
  {
    label: 'Event venue',
    value: 'Event venue',
  },
  {
    label: 'Brand',
    value: 'Brand',
  },
  {
    label: 'Event staffing',
    value: 'Event staffing',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

export const ACTIVE_OPTIONS = [
  {
    label: 'Active & Inactive',
    value: '',
  },
  {
    label: 'Active',
    value: 'Active',
  },
  {
    label: 'Inactive',
    value: 'Inactive',
  },
];

export const SET_USER_TRUSTED = 'SET_USER_TRUSTED';
