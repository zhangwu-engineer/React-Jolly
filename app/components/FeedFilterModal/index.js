// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import ClearIcon from '@material-ui/icons/Clear';

import BaseModal from 'components/BaseModal';

import { CATEGORY_OPTIONS } from 'enum/constants';

const styles = theme => ({
  modal: {
    padding: 0,
    width: 581,
    borderRadius: '0px !important',
    top: '96px !important',
    transform: 'translateX(-50%) !important',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      transform: 'none !important',
      top: 'initial !important',
      left: '0px !important',
      bottom: '0px !important',
      height: '100%',
    },
  },
  blueLine: {
    backgroundColor: theme.palette.primary.main,
    height: 10,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  content: {
    position: 'relative',
    padding: 30,
    [theme.breakpoints.down('xs')]: {
      padding: '30px 20px 20px',
    },
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#464646',
  },
  radio: {
    color: '#404040 !important',
    padding: 6,
  },
  optionLabel: {
    fontWeight: 500,
    color: '#404040',
  },
  firstDivider: {
    height: 1,
    marginTop: 15,
    marginBottom: 20,
  },
  secondDivider: {
    height: 1,
    marginTop: 10,
    marginBottom: 25,
  },
  thirdDivider: {
    height: 1,
    marginTop: 20,
    marginBottom: 30,
  },
  options: {
    paddingLeft: 5,
  },
  buttonsWrapper: {
    marginTop: 7,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
    textTransform: 'none',
    padding: '12px 40px',
    borderRadius: 0,
  },
  closeButton: {
    position: 'absolute',
    padding: 5,
    right: 10,
    top: 10,
  },
});

type Props = {
  user: Object,
  query: Object, // eslint-disable-line
  isOpen: boolean,
  classes: Object,
  onCloseModal: Function,
  onChange: Function,
};

type State = {
  query: ?Object,
  location: string,
  categories: Array,
};

class FeedFilterModal extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.query && prevState.query === undefined) {
      return {
        query: nextProps.query,
      };
    }
    return null;
  }
  state = {
    query: undefined,
  };
  handleLocationChange = e => {
    this.setState(
      update(this.state, {
        query: {
          location: { $set: e.target.value },
        },
      })
    );
  };
  handleCategoryChange = category => () => {
    const {
      query: { categories },
    } = this.state;
    const pos = categories.indexOf(category);
    if (pos !== -1) {
      this.setState(
        update(this.state, {
          query: {
            categories: { $splice: [[pos, 1]] },
          },
        })
      );
    } else {
      this.setState(
        update(this.state, {
          query: {
            categories: { $push: [category] },
          },
        })
      );
    }
  };
  reset = () => {
    const { user } = this.props;
    this.setState(
      update(this.state, {
        query: {
          location: { $set: user.getIn(['profile', 'location']) },
          categories: { $set: CATEGORY_OPTIONS.map(option => option.value) },
        },
      })
    );
  };
  save = () => {
    const { query } = this.state;
    this.props.onCloseModal();
    this.props.onChange(query);
  };
  render() {
    const { user, isOpen, classes } = this.props;
    const { query } = this.state;
    return (
      <BaseModal
        className={classes.modal}
        isOpen={isOpen}
        onCloseModal={this.props.onCloseModal}
        shouldCloseOnOverlayClick={false}
      >
        <div className={classes.blueLine} />
        <div className={classes.content}>
          <IconButton
            className={classes.closeButton}
            onClick={this.props.onCloseModal}
          >
            <ClearIcon />
          </IconButton>
          <Typography className={classes.title}>Filter your feed</Typography>
          <Divider className={classes.firstDivider} />
          <FormControl component="fieldset" className={classes.options}>
            <RadioGroup
              name="location"
              className={classes.group}
              value={query.location}
              onChange={this.handleLocationChange}
            >
              <FormControlLabel
                key={generate()}
                value={user.getIn(['profile', 'location'])}
                control={
                  <Radio
                    classes={{ root: classes.radio }}
                    checked={
                      query.location === user.getIn(['profile', 'location'])
                    }
                  />
                }
                label={`All in ${user.getIn(['profile', 'location'])}`}
                classes={{
                  label: classes.optionLabel,
                }}
              />
              <FormControlLabel
                key={generate()}
                value="my-posts"
                control={
                  <Radio
                    classes={{ root: classes.radio }}
                    checked={query.location === 'my-posts'}
                  />
                }
                label="My posts only"
                classes={{
                  label: classes.optionLabel,
                }}
              />
            </RadioGroup>
          </FormControl>
          <Divider className={classes.secondDivider} />
          <FormControl component="fieldset" className={classes.options}>
            <FormGroup>
              {CATEGORY_OPTIONS.map(option => (
                <FormControlLabel
                  key={generate()}
                  control={
                    <Checkbox
                      checked={query.categories.includes(option.value)}
                      classes={{ root: classes.radio }}
                      value={option.value}
                      onChange={this.handleCategoryChange(option.value)}
                    />
                  }
                  label={option.label}
                  classes={{
                    label: classes.optionLabel,
                  }}
                />
              ))}
            </FormGroup>
          </FormControl>
          <Divider className={classes.thirdDivider} />
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Button
                className={classes.resetButton}
                color="primary"
                onClick={this.reset}
              >
                Reset Filters
              </Button>
            </Grid>
            <Grid item>
              <Button
                className={classes.saveButton}
                variant="contained"
                color="primary"
                onClick={this.save}
              >
                Save Filters
              </Button>
            </Grid>
          </Grid>
        </div>
      </BaseModal>
    );
  }
}

export default withStyles(styles)(FeedFilterModal);
