// @flow

import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircleOutline';
import Grid from '@material-ui/core/Grid';
import Icon from 'components/Icon';
import Link from 'components/Link';
import EndorsementIcon from 'images/sprite/endorsement.svg';

const styles = theme => ({
  root: {
    marginBottom: 20,
    padding: '20px 30px',
    boxShadow: '0 10px 20px 0 rgba(187, 187, 187, 0.5)',
    borderRadius: 0,
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
  years: {
    fontSize: 14,
    fontWeight: 500,
    color: '#a1a1a1',
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
  emptyText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#6f6f73',
    marginBottom: 20,
    marginTop: 28,
    paddingLeft: 20,
    paddingRight: 20,
  },
  addPositionButton: {
    borderRadius: 0,
    fontWeight: 600,
    textTransform: 'none',
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
    paddingLeft: 46,
    paddingRight: 46,
    '&:hover': {
      borderWidth: 2,
    },
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
            <Typography
              variant="h6"
              className={classes.emptyText}
              align="center"
            >
              You haven’t added any positions you’re ready and willing to work
            </Typography>
            <Grid container justify="center">
              <Grid item>
                <Button
                  className={classes.addPositionButton}
                  variant="outlined"
                  size="large"
                  color="primary"
                  component={props => <Link to="/types-of-work" {...props} />}
                >
                  Add Position
                </Button>
              </Grid>
            </Grid>
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
          {role.years !== '' && (
            <Typography variant="h6" className={classes.years}>
              {role.years === 0 ? '< 1 year experience' : ''}
              {role.years === 1 ? '1 year experience' : ''}
              {role.years > 1 && role.years < 20
                ? `${role.years} years experience`
                : ''}
              {role.years === 20 ? 'Over 20 years experience' : ''}
            </Typography>
          )}
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
