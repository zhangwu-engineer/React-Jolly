// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import Link from 'components/Link';

import LogoWhite from 'images/logo-white.png';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 70,
    backgroundColor: '#1976d1',
    paddingLeft: theme.spacing.unit * 5,
    paddingRight: theme.spacing.unit * 5,
  },
  logo: {
    width: 70,
    height: 45,
  },
  desc: {
    color: '#9dbad6',
    fontWeight: 500,
  },
  btnSignIn: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: 14,
    '&:hover': {
      color: '#ffffff',
    },
  },
});

type Props = {
  classes: Object,
  pathname: string,
};

class Header extends React.Component<Props> {
  render() {
    const { classes, pathname } = this.props;
    return (
      <Grid
        className={classes.root}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Link to="/">
            <img className={classes.logo} src={LogoWhite} alt="logo" />
          </Link>
        </Grid>
        <Grid item>
          <Typography className={classes.desc}>
            Already a user?{' '}
            <Link
              to={
                pathname === '/email-sign-in'
                  ? '/freelancer-signup'
                  : '/email-sign-in'
              }
              className={classes.btnSignIn}
            >
              {pathname === '/email-sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Header);
