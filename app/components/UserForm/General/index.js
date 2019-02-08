// @flow

import React, { Component } from 'react';
import update from 'immutability-helper';

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
      const profile = nextProps.user.get('profile');
      const name = `${nextProps.user.get('firstName')} ${nextProps.user.get(
        'lastName'
      )}`;
      return {
        ...prevState,
        model: {
          name,
          email: nextProps.user.get('email'),
          profile: {
            phone: profile.get('phone') || '',
          },
        },
      };
    }
    if (prevState.model && prevState.model.profile) {
      const {
        model: {
          name,
          email,
          profile: { phone },
        },
      } = prevState;
      if (nextProps.user.getIn(['profile', 'phone']) !== phone) {
        const prevProfile = prevState.model ? prevState.model.profile : {};
        return {
          ...prevState,
          model: {
            name,
            email,
            profile: {
              ...prevProfile,
              phone: nextProps.user.getIn(['profile', 'phone']),
            },
          },
        };
      }
    }
    return null;
  }
  state = {
    model: null,
  };
  onChange = (id, value) => {
    if (id === 'name') {
      this.setState(
        update(this.state, {
          model: {
            name: { $set: value },
          },
        }),
        () => {
          if (value.split(' ').length >= 2) {
            const [firstName, ...rest] = value.split(' ');
            this.props.updateUser({
              firstName,
              lastName: rest.join(' '),
            });
          }
        }
      );
    } else if (id === 'email') {
      this.setState(
        update(this.state, {
          model: {
            email: { $set: value },
          },
        }),
        () => {
          this.props.updateUser({
            email: value,
          });
        }
      );
    } else {
      this.setState(
        update(this.state, {
          model: {
            profile: {
              [id]: { $set: value },
            },
          },
        }),
        () => {
          this.props.updateUser({
            profile: {
              [id]: value,
            },
          });
        }
      );
    }
  };
  render() {
    const { user, classes } = this.props;
    const { model } = this.state;
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
          value={model && model.profile.phone}
          slug={user.get('slug')}
        />
        <Grid container justify="flex-end">
          <Grid item>
            <Button
              className={classes.saveButton}
              color="primary"
              variant="contained"
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
