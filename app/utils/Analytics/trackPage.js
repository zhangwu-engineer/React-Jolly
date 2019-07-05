class TrackPage {
  static send(location, user) {
    if (location.pathname.split('/').length === 3) {
      if (location.pathname.startsWith('/f/')) {
        analytics.page('User Profile', {
          viewer:
            user &&
            user.get('slug') === location.pathname.split('/').slice(-1)[0]
              ? 'this-user'
              : 'other-user',
        });
      } else if (location.pathname.startsWith('/b/')) {
        analytics.page('Business Profile Page Viewed');
      } else if (location.pathname.startsWith('/feed/')) {
        analytics.page('Post Page Viewed');
      }
    } else if (location.pathname.startsWith('/reset-password/')) {
      analytics.page('Reset Password Page Viewed');
    } else if (location.pathname.startsWith('/email-verification/')) {
      analytics.page('Email Verification Page Viewed');
    } else {
      analytics.page(location.pathname);
    }
  }
}

export default TrackPage;
