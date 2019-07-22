// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import BusinessProfileForm from 'components/BusinessProfileForm';

import { requestBusinessDataUpdate, requestUser } from 'containers/App/sagas';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#404040',
    padding: 20,
  },
});

type Props = {
  user: Object,
  classes: Object,
  updateBusiness: Function,
  requestUser: Function,
};

class BusinessSettingsProfilePage extends Component<Props> {
  componentDidMount() {
    this.props.requestUser();
  }
  render() {
    const { user, classes } = this.props;

    const businesses =
      user && user.get('businesses') && user.get('businesses').toJSON();
    const currentBusiness = businesses && businesses[0];

    return (
      <React.Fragment>
        <Typography variant="h1" className={classes.title}>
          Business Profile
        </Typography>
        <div className={classes.root}>
          <BusinessProfileForm
            business={currentBusiness}
            updateBusiness={this.props.updateBusiness}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({
  updateBusiness: payload => dispatch(requestBusinessDataUpdate(payload)),
  requestUser: () => dispatch(requestUser()),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(BusinessSettingsProfilePage);
