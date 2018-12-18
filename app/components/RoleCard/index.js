// @flow

import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CheckCircle from '@material-ui/icons/CheckCircleOutline';

const styles = () => ({
  root: {
    marginBottom: 20,
    padding: '10px 15px',
    boxShadow: '0 10px 20px 0 rgba(187, 187, 187, 0.5)',
  },
  name: {
    fontSize: 18,
    fontWeight: 600,
    color: '#474747',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

type Props = {
  role: Object,
  classes: Object,
};

class RoleCard extends Component<Props> {
  render() {
    const { role, classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h6" className={classes.name}>
            {role.name}
          </Typography>
          <Typography component="p">
            {`$${role.rate} / ${role.unit}`}
          </Typography>
        </CardContent>
        <CardActions className={classes.actionBar}>
          <Button>
            <CheckCircle />
            &nbsp;&nbsp;0
          </Button>
          <Button>
            <CheckCircle />
            &nbsp;&nbsp;0
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(RoleCard);