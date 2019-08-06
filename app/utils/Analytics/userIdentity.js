class UserIdentity {
  static send(user) {
    const params = {
      full_name: `${user.get('firstName')} ${user.get('lastName')}`,
      email: user.get('email'),
      distance: user.getIn(['profile', 'distance']),
      linkedin: user.getIn(['profile', 'linkedin']),
      twitter: user.getIn(['profile', 'twitter']),
      location: user.getIn(['profile', 'location']),
      youtube: user.getIn(['profile', 'youtube']),
      facebook: user.getIn(['profile', 'facebook']),
      phone: user.getIn(['profile', 'phone']),
      bio: user.getIn(['profile', 'bio']),
      background_picture: user.getIn(['profile', 'backgroundImage']),
      profile_picture: user.getIn(['profile', 'avatar']),
      source: user.get('source'),
      cred_count: user.getIn(['profile', 'cred']),
      created_at: user.get('date_created'),
      isHirer: user.getIn(['profile', 'isHirer']),
    };
    if (user.get('isBusiness')) {
      const businesses =
        user.get('businesses') && user.get('businesses').toJSON();
      const [activeBusiness] = [businesses[0]];
      if (activeBusiness) {
        const { name, category, location } = activeBusiness;
        params.Business_name_1 = name;
        params.Business_type_1 = category;
        params.Business_headquarters_1 = location;
      }
    }
    if (window.localStorage.getItem('testUser') === 'true') params.test = true;
    analytics.identify(user.get('id'), params);
  }
}
export default UserIdentity;
