// @flow

import * as React from 'react';
import { Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import load from 'utils/load';

import { history } from 'components/ConnectedRouter';
import { Route, PrivateRoute } from 'components/Routes';
import { requestMember } from 'containers/App/sagas';

const Member = load(() => import('pages/Member'));
const MemberGallery = load(() => import('pages/MemberGallery'));
const PersonalInformation = load(() => import('pages/PersonalInformation'));
const WorkDetail = load(() => import('pages/WorkDetail'));
const Mobile = load(() => import('pages/Mobile'));
const Invite = load(() => import('pages/Invite'));

type Props = {
  user: Object,
  member: Object,
  isMemberLoading: boolean,
  memberError: string,
  match: Object,
  requestMember: Function,
};

class UserPage extends React.Component<Props> {
  componentDidMount() {
    const {
      match: {
        params: { slug },
      },
    } = this.props;
    this.props.requestMember(slug);
  }
  componentDidUpdate(prevProps: Props) {
    const {
      user,
      member,
      isMemberLoading,
      memberError,
      match: {
        params: { slug },
      },
    } = this.props;
    if (prevProps.isMemberLoading && !isMemberLoading) {
      if (memberError === 'User not found') {
        history.push('/404');
      } else if (member.size > 0 && user && user.get('slug') !== slug) {
        if (
          !window.location.pathname.includes('gallery') &&
          !/e\/.*/.test(window.location.pathname)
        ) {
          history.push(`/f/${slug}`);
        }
      }
    }
  }
  render() {
    const { url } = this.props.match;
    return (
      <Switch>
        <Route exact path={url} render={props => <Member {...props} />} />
        <PrivateRoute
          exact
          path={`${url}/edit/personal-information`}
          render={props => <PersonalInformation {...props} />}
        />
        <PrivateRoute
          path={`${url}/mobile`}
          render={props => <Mobile {...props} />}
        />
        <Route
          path={`${url}/e/:eventSlug/work/:token`}
          render={props => <Invite {...props} />}
        />
        <Route
          path={`${url}/e/:eventSlug/work`}
          render={props => <Invite {...props} />}
        />
        <Route
          path={`${url}/e/:eventSlug`}
          render={props => <WorkDetail {...props} />}
        />
        <Route
          path={`${url}/gallery`}
          render={props => <MemberGallery {...props} />}
        />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  member: state.getIn(['app', 'member']),
  isMemberLoading: state.getIn(['app', 'isMemberLoading']),
  memberError: state.getIn(['app', 'memberError']),
});

const mapDispatchToProps = dispatch => ({
  requestMember: slug => dispatch(requestMember(slug)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPage);
