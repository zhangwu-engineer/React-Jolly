// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import PlacesAutocomplete from 'react-places-autocomplete';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SearchIcon from '@material-ui/icons/Search';

import { history } from 'components/ConnectedRouter';
import Icon from 'components/Icon';
import HandIcon from 'images/sprite/hand.svg';
import { requestUserDataUpdate } from 'containers/App/sagas';

const styles = theme => ({
  root: {
    maxWidth: 660,
    margin: '50px auto 0px auto',
    [theme.breakpoints.down('xs')]: {
      padding: 10,
      height: 800,
    },
  },
  icon: {
    margin: '0 auto',
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.4,
    color: '#3e3e3e',
    marginBottom: 15,
  },
  text: {
    fontSize: 23,
    fontWeight: 500,
    lineHeight: 1.52,
    letterSpacing: 0.4,
    color: '#3e3e3e',
    marginBottom: 60,
  },
  formControl: {
    backgroundColor: theme.palette.common.white,
  },
  textInput: {
    paddingLeft: 35,
    marginTop: 20,
    fontSize: 16,
    fontWeight: 600,
    color: '#3e3e3e',
    '&:before': {
      borderBottom: '2px solid #f1f1f1',
    },
    '& input': {
      paddingTop: 5,
      paddingBottom: 20,
    },
  },
  placesList: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid #e5e5e5',
    position: 'absolute',
    width: '100%',
    maxHeight: 200,
    top: 58,
    zIndex: 10,
    overflowY: 'scroll',
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar': {
      width: 6,
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#a4acb3',
    },
  },
  adornment: {
    position: 'relative',
    top: -8,
  },
});

type Props = {
  user: Object,
  // isUpdating: boolean,
  // updateError: string,
  classes: Object,
  updateUser: Function,
};

type State = {
  address: string,
};

class OnboardingCityPage extends Component<Props, State> {
  state = {
    address: '',
  };
  componentDidMount() {
    const { user } = this.props;
    if (user.getIn(['profile', 'location'])) {
      history.push('/ob/2');
    }
  }
  componentDidUpdate() {
    const { user } = this.props;
    if (user.getIn(['profile', 'location'])) {
      history.push('/ob/2');
    }
  }
  handleChange = address => {
    this.setState({ address });
  };
  handleSelect = (address, placeId) => {
    if (placeId) {
      this.props.updateUser({
        profile: {
          location: address,
        },
      });
    } else if (this.addressInput.current) {
      this.addressInput.current.blur();
    }
  };
  addressInput = React.createRef();
  render() {
    const { classes } = this.props;
    const { address } = this.state;
    return (
      <div className={classes.root}>
        <Icon glyph={HandIcon} size={30} className={classes.icon} />
        <Typography align="center" className={classes.welcome}>
          Welcome!
        </Typography>
        <Typography align="center" className={classes.text}>
          Jolly is where event professionals connect, grow their network and
          find opportunities.
        </Typography>
        <FormControl classes={{ root: classes.formControl }} fullWidth>
          <PlacesAutocomplete
            value={address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
            searchOptions={{ types: ['(cities)'] }}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <React.Fragment>
                <Input
                  className={classes.textInput}
                  {...getInputProps({
                    placeholder: 'What city do you live in?',
                  })}
                  inputRef={this.addressInput}
                  startAdornment={
                    <InputAdornment
                      position="start"
                      className={classes.adornment}
                    >
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
                {suggestions.length || loading ? (
                  <div className={classes.placesList}>
                    {loading && (
                      <ListItem>
                        <ListItemText primary="Loading..." />
                      </ListItem>
                    )}
                    {suggestions.map(suggestion => {
                      const className = suggestion.active
                        ? 'suggestion-item--active'
                        : 'suggestion-item';
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? {
                            backgroundColor: '#fafafa',
                            cursor: 'pointer',
                          }
                        : {
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                          };
                      return (
                        <ListItem
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style,
                          })}
                          key={generate()}
                        >
                          <ListItemText primary={suggestion.description} />
                        </ListItem>
                      );
                    })}
                  </div>
                ) : null}
              </React.Fragment>
            )}
          </PlacesAutocomplete>
        </FormControl>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isUpdating: state.getIn(['app', 'isUpdating']),
  updateError: state.getIn(['app', 'updateError']),
});

const mapDispatchToProps = dispatch => ({
  updateUser: payload => dispatch(requestUserDataUpdate(payload)),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(OnboardingCityPage);
