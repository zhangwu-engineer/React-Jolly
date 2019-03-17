// @flow
import React, { Component } from 'react';
import { generate } from 'shortid';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';

import { CATEGORY_OPTIONS } from 'enum/constants';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: 20,
  },
  title: {
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
  options: {
    paddingLeft: 5,
  },
});

type Props = {
  user: Map,
  query: Object, // eslint-disable-line
  classes: Object,
  onChange: Function,
};

type State = {
  query: ?Object,
  location: string,
  categories: Array,
};

class FeedFilter extends Component<Props, State> {
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
      }),
      () => {
        this.props.onChange(this.state.query);
      }
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
        }),
        () => {
          this.props.onChange(this.state.query);
        }
      );
    } else {
      this.setState(
        update(this.state, {
          query: {
            categories: { $push: [category] },
          },
        }),
        () => {
          this.props.onChange(this.state.query);
        }
      );
    }
  };
  render() {
    const { user, classes } = this.props;
    const { query } = this.state;
    return (
      <div className={classes.root}>
        <Typography className={classes.title}>Feed Filters</Typography>
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
      </div>
    );
  }
}

export default withStyles(styles)(FeedFilter);
