export const getToken = state => state.getIn(['app', 'token']);
export const getAdminToken = state => state.getIn(['app', 'adminToken']);
export const getUserId = state => state.getIn(['app', 'user', 'id']);

export const getClientId = () => {
  let clientID;
  if (!(typeof ga === 'undefined')) {
    // eslint-disable-next-line
    ga(tracker => {
      clientID = tracker.get('clientId');
    });
  }
  return clientID;
};

export const getUserHeaders = state => {
  const params = {
    'x-access-token': getToken(state),
    'client-id': getClientId(),
  };
  return JSON.parse(JSON.stringify(params));
};
