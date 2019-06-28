// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

import UserAvatar from 'components/UserAvatar';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    height: 50,
    width: 50,
  },
  businessAvatar: {
    width: 50,
    height: 50,
    fontWeight: 600,
    fontSize: 18,
    border: 0,
    paddingTop: 3,
    paddingLeft: 1,
    margin: '0 auto',
    backgroundColor: '#c415d9',
  },
  userInfo: {
    paddingLeft: 20,
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 12,
    },
  },
  location: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0.3,
    color: '#9b9b9b',
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: '#4a4a4a',
  },
  ignoreButton: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none',
    padding: '11px 35px',
    borderRadius: 0,
    boxShadow: 'none',
    marginRight: 10,
    [theme.breakpoints.down('xs')]: {
      padding: '11px 30px',
      fontWeight: 600,
      display: 'none',
    },
  },
  acceptButton: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none',
    padding: '11px 35px',
    borderRadius: 0,
    boxShadow: 'none',
    [theme.breakpoints.down('xs')]: {
      padding: '11px 30px',
      fontWeight: 600,
      display: 'none',
    },
  },
  smallIgnoreButton: {
    display: 'none',
    backgroundColor: '#e9e9e9',
    padding: 6,
    marginRight: 10,
    [theme.breakpoints.down('xs')]: {
      display: 'inline-flex',
    },
  },
  smallAcceptButton: {
    display: 'none',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: 6,
    [theme.breakpoints.down('xs')]: {
      display: 'inline-flex',
    },
  },
});

type Props = {
  connection: Object,
  classes: Object,
  ignore: Function,
  accept: Function,
};

class ConnectionFromBusinessCard extends Component<Props> {
  handleIgnore = () => {
    const { connection } = this.props;
    this.props.ignore(connection.get('id'));
  };
  handleAccept = () => {
    const { connection } = this.props;
    this.props.accept(connection.get('id'));
  };
  render() {
    const { connection, classes } = this.props;
    const business = connection.get('from');
    const name = business.get('name');
    const category = business.get('category');

    return (
      <div className={classes.root}>
        <UserAvatar className={classes.businessAvatar} content={name} />
        <div className={classes.userInfo}>
          <Typography className={classes.location}>{category}</Typography>
          <Typography className={classes.name}>{name}</Typography>
        </div>
        {connection.get('status') === 'PENDING' && (
          <React.Fragment>
            <Button
              className={classes.ignoreButton}
              onClick={this.handleIgnore}
            >
              Ignore
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.acceptButton}
              onClick={this.handleAccept}
            >
              Accept
            </Button>
            <IconButton
              className={classes.smallIgnoreButton}
              onClick={this.handleIgnore}
            >
              <ClearIcon />
            </IconButton>
            <IconButton
              variant="contained"
              color="primary"
              className={classes.smallAcceptButton}
              onClick={this.handleAccept}
            >
              <DoneIcon />
            </IconButton>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ConnectionFromBusinessCard);
