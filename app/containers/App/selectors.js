export const getToken = state => state.getIn(['app', 'token']);
export const getAdminToken = state => state.getIn(['app', 'adminToken']);
export const getUserId = state => state.getIn(['app', 'user', 'id']);
