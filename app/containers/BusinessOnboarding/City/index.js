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
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { history } from 'components/ConnectedRouter';
import Icon from 'components/Icon';
import HandIcon from 'images/sprite/hand.svg';
import CategoryIcon from 'images/sprite/role.svg';
import { BUSINESS_CATEGORY_OPTIONS } from 'enum/constants';
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
    marginBottom: 18,
  },
  textInput: {
    paddingLeft: 36,
    marginTop: 20,
    fontSize: 16,
    fontWeight: 600,
    color: '#3e3e3e',
    '&:before': {
      borderBottom: '2px solid #f1f1f1',
    },
    '& input': {
      paddingTop: 8,
      paddingBottom: 28,
      fontSize: 16,
      fontWeight: 600,
      lineHeight: '22px',
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
  categoryWrapper: {
    marginBottom: 18,
  },
  categoryHeader: {
    backgroundColor: theme.palette.common.white,
    paddingLeft: 35,
    paddingTop: 26,
    paddingBottom: 26,
    paddingRight: 24,
    cursor: 'pointer',
    borderBottom: '2px solid #f1f1f1',
  },
  categoryTitleWrapper: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: 600,
    color: '#3e3e3e',
    paddingLeft: 17,
  },
  categoryList: {
    backgroundColor: theme.palette.common.white,
    paddingTop: 12,
    paddingBottom: 65,
  },
  categoryItem: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 3.3,
    letterSpacing: 0.3,
    color: '#3e3e3e',
    cursor: 'pointer',
    paddingLeft: 75,
    '&:hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  dropdownIcon: {
    height: 24,
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
  businessName: string,
  businessNamePassed: boolean,
  businessCategory: string,
  address: string,
  isCategoryOpen: boolean,
};

class OnboardingCityPage extends Component<Props, State> {
  state = {
    businessName: '',
    businessNamePassed: false,
    businessCategory: '',
    address: '',
    isCategoryOpen: false,
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
    const { businessName, businessCategory } = this.state;
    if (placeId) {
      this.props.updateUser({
        profile: {
          location: address,
        },
        business: {
          name: businessName,
          category: businessCategory,
        },
      });
      analytics.track('Business Created', {
        location: address,
        name: businessName,
        category: businessCategory,
      });
    } else if (this.addressInput.current) {
      this.addressInput.current.blur();
    }
  };
  toggleOption = () => {
    this.setState(state => ({ isCategoryOpen: !state.isCategoryOpen }));
  };
  businessNameInput = React.createRef();
  addressInput = React.createRef();
  render() {
    const { classes } = this.props;
    const {
      businessName,
      businessNamePassed,
      businessCategory,
      address,
      isCategoryOpen,
    } = this.state;
    return (
      <div className={classes.root}>
        <Icon glyph={HandIcon} size={30} className={classes.icon} />
        <Typography align="center" className={classes.welcome}>
          Welcome!
        </Typography>
        <Typography align="center" className={classes.text}>
          Jolly is a convenient and helpful platform to network with event
          freelancers and connect with gigs.
        </Typography>
        <FormControl classes={{ root: classes.formControl }} fullWidth>
          <Input
            className={classes.textInput}
            inputRef={this.businessNameInput}
            value={businessName}
            id="businessName"
            placeholder="Enter your Business Name"
            onChange={e => {
              this.setState({ [e.target.id]: e.target.value });
            }}
            onKeyDown={e => {
              if (e.keyCode === 13 && businessName) {
                this.setState(
                  {
                    businessNamePassed: true,
                  },
                  () => {
                    if (this.businessNameInput.current) {
                      this.businessNameInput.current.blur();
                    }
                  }
                );
              }
            }}
            // startAdornment={
            //   <InputAdornment position="start" className={classes.adornment}>
            //     <SearchIcon />
            //   </InputAdornment>
            // }
          />
        </FormControl>
        {businessNamePassed && (
          <div className={classes.categoryWrapper}>
            <Grid
              container
              alignItems="center"
              className={classes.categoryHeader}
              onClick={this.toggleOption}
            >
              <Grid item>
                <Icon glyph={CategoryIcon} size={24} />
              </Grid>
              <Grid item className={classes.categoryTitleWrapper}>
                <Typography className={classes.category}>
                  {businessCategory
                    ? BUSINESS_CATEGORY_OPTIONS.map(
                        option =>
                          option.value === businessCategory && option.label
                      )
                    : 'Select business category'}
                </Typography>
              </Grid>
              <Grid item className={classes.dropdownIcon}>
                {isCategoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Grid>
            </Grid>
            {isCategoryOpen && (
              <div className={classes.categoryList}>
                {BUSINESS_CATEGORY_OPTIONS.map(option => (
                  <Typography
                    key={generate()}
                    className={classes.categoryItem}
                    onClick={() => {
                      this.setState({
                        isCategoryOpen: false,
                        businessCategory: option.value,
                      });
                    }}
                  >
                    {option.label}
                  </Typography>
                ))}
              </div>
            )}
          </div>
        )}
        {businessCategory && (
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
                      placeholder: 'What city do you work in most often?',
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
        )}
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
