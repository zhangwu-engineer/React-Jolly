// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import BusinessPositionsForm from 'components/BusinessPositionsForm';

import { requestUser } from 'containers/App/sagas';

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
  requestUser: Function,
};

class BusinessSettingsPositions extends Component<Props> {
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
          Positions
        </Typography>
        <div className={classes.root}>
          <BusinessPositionsForm business={currentBusiness} />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({
  requestUser: () => dispatch(requestUser()),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(BusinessSettingsPositions);
