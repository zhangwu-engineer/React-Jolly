// @flow

import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircleOutline';

import Icon from 'components/Icon';

import EndorsementIcon from 'images/sprite/endorsement.svg';

const styles = () => ({
  root: {
    marginBottom: 20,
    padding: '20px 30px',
    boxShadow: '0 10px 20px 0 rgba(187, 187, 187, 0.5)',
  },
  content: {
    padding: 0,
    paddingBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 600,
    color: '#474747',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 0,
  },
  icon: {
    fontSize: 17,
    color: '#9B9B9B',
  },
  desc: {
    fontSize: 14,
    fontWeight: 500,
    color: '#a1a1a1',
  },
});

type Props = {
  role?: Object,
  classes: Object,
};

class RoleCard extends Component<Props> {
  render() {
    const { role, classes } = this.props;
    if (!role) {
      return (
        <Card className={classes.root}>
          <CardContent className={classes.content}>
            <Typography variant="h6" className={classes.name}>
              No Roles added yet
            </Typography>
            <Typography className={classes.desc}>
              Add your first Role now
            </Typography>
          </CardContent>
        </Card>
      );
    }
    return (
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <Typography variant="h6" className={classes.name}>
            {role.name}
          </Typography>
          {role.minRate &&
            role.maxRate &&
            role.unit && (
              <Typography component="p">
                {`$${role.minRate} - ${role.maxRate} / ${role.unit}`}
              </Typography>
            )}
          {role.minRate &&
            !role.maxRate &&
            role.unit && (
              <Typography component="p">
                {`$${role.minRate} / ${role.unit}`}
              </Typography>
            )}
        </CardContent>
        <CardActions className={classes.actionBar}>
          <Button>
            <CheckCircle className={classes.icon} />
            &nbsp;&nbsp;
            {role.verifiedJobs}
          </Button>
          <Button>
            <Icon glyph={EndorsementIcon} />
            &nbsp;&nbsp;
            {role.endorsements}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(RoleCard);
