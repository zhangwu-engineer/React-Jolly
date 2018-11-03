// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

import ProfileInfo from 'components/ProfileInfo';
import Link from 'components/Link';

const styles = theme => ({
  root: {
    maxWidth: '712px',
    margin: '40px auto 300px auto',
  },
  profileInfo: {
    marginBottom: 20,
  },
  section: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
  },
  sectionHeader: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    backgroundColor: '#edeeee',
  },
  sectionBody: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
  },
  editButton: {
    color: theme.palette.primary.main,
    border: '1px solid #e5e5e5',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
  },
});

type Props = {
  user: Object,
  classes: Object,
  match: Object,
};

class Profile extends Component<Props> {
  render() {
    const {
      user,
      classes,
      match: {
        params: { slug },
      },
    } = this.props;
    if (user.get('slug') !== slug) {
      return null;
    }
    return (
      <div className={classes.root}>
        <div className={classes.profileInfo}>
          <ProfileInfo user={user} />
        </div>
        <div className={classes.section}>
          <div className={classes.sectionHeader}>
            <Typography variant="h6">Talents</Typography>
          </div>
          <div className={classes.sectionBody}>
            <Button
              className={classes.editButton}
              component={props => (
                <Link to={`/f/${user.get('slug')}/work`} {...props} />
              )}
            >
              <EditIcon />
              &nbsp;Edit Talents and Rates
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = () => ({});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(Profile);
