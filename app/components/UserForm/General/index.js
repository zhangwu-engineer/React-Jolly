// @flow

import React, { Component } from 'react';
import update from 'immutability-helper';
import { isEqual } from 'lodash-es';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import EditableInput from 'components/EditableInput';

const styles = () => ({
  saveButton: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'none',
    padding: '13px 34px',
    borderRadius: 0,
  },
});

type Props = {
  user: Object,
  classes: Object,
  updateUser: Function,
};

type State = {
  model: ?Object,
};

class UserGeneralForm extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.user && !prevState.model) {
      const name = `${nextProps.user.get('firstName')} ${nextProps.user.get(
        'lastName'
      )}`;
      return {
        ...prevState,
        model: {
          name,
          email: nextProps.user.get('email'),
        },
      };
    }
    return null;
  }
  state = {
    model: null,
  };
  onChange = (id, value) => {
    if (id !== 'phone') {
      this.setState(
        update(this.state, {
          model: {
            [id]: { $set: value },
          },
        })
      );
    }
  };
  handleSave = () => {
    const { user } = this.props;
    const { model } = this.state;
    if (model) {
      const { name, email } = model;
      const payload = {
        email,
        firstName: user.get('firstName'),
        lastName: user.get('lastName'),
      };
      if (name.split(' ').length >= 2) {
        const [firstName, ...rest] = name.split(' ');
        payload.firstName = firstName;
        payload.lastName = rest.join(' ');
      }
      this.props.updateUser(payload);
    }
  };
  render() {
    const { user, classes } = this.props;
    const { model } = this.state;
    const userData = {
      name: `${user.get('firstName')} ${user.get('lastName')}`,
      email: user.get('email'),
    };
    return (
      <React.Fragment>
        <EditableInput
          label="Name"
          id="name"
          value={model && model.name}
          onChange={this.onChange}
        />
        <EditableInput
          label="Email"
          id="email"
          value={model && model.email}
          onChange={this.onChange}
        />
        <EditableInput
          label={
            user.getIn(['profile', 'verifiedPhone'])
              ? 'Phone (verified)'
              : 'Phone (not verified)'
          }
          id="phone"
          value={user.getIn(['profile', 'phone'])}
          slug={user.get('slug')}
        />
        <Grid container justify="flex-end">
          <Grid item>
            <Button
              className={classes.saveButton}
              color="primary"
              variant="contained"
              disabled={isEqual(userData, model)}
              onClick={this.handleSave}
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(UserGeneralForm);
