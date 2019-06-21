// @flow
import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import { debounce } from 'lodash-es';
import update from 'immutability-helper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import PositionCard from 'components/PositionCard';
import OnboardingPositionSkipModal from 'components/OnboardingPositionSkipModal';

import saga, {
  reducer,
  requestCreateRole,
  requestDeleteRole,
  requestRoles,
} from 'containers/Role/sagas';
import { requestUserDataUpdate } from 'containers/App/sagas';
import injectSagas from 'utils/injectSagas';

import ROLES from 'enum/roles';

const COMMON_POSITIONS = [
  'Bartender',
  'Event Setup Crew',
  'Server',
  'Brand Ambassador',
];
const perPage = 12;
const styles = theme => ({
  banner: {
    backgroundColor: theme.palette.common.darkBlue,
    paddingTop: 50,
    paddingBottom: 30,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '35px 20px 40px 20px',
    },
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 1.46,
    letterSpacing: 0.6,
    color: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
      lineHeight: 1.94,
      letterSpacing: 0.4,
    },
  },
  text: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.5px',
    color: theme.palette.common.white,
    marginBottom: 30,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      lineHeight: 1.75,
      letterSpacing: 0.4,
    },
  },
  skip: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: 'none',
    textDecoration: 'none',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      letterSpacing: 0.4,
    },
  },
  content: {
    maxWidth: 1064,
    margin: '0 auto',
    display: 'flex',
    paddingBottom: 137,
    paddingTop: 30,
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      paddingBottom: 50,
    },
  },
  leftPanel: {
    width: 353,
    marginRight: 26,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  positionsBox: {
    backgroundColor: theme.palette.common.white,
    padding: 25,
    paddingRight: 2,
    marginBottom: 12,
  },
  positionsTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#4a4a4a',
    marginBottom: 20,
  },
  rightPanel: {
    flex: 1,
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 25,
      paddingRight: 25,
    },
  },
  formControl: {
    backgroundColor: theme.palette.common.white,
    marginBottom: 30,
    boxShadow: '0 10px 20px 0 rgba(187, 187, 187, 0.2)',
  },
  textInput: {
    paddingLeft: 18,
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
  adornment: {
    position: 'relative',
    top: -8,
  },
  commonTitle: {
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: 0.5,
    color: '#1b1b1b',
    marginBottom: 15,
    paddingLeft: 5,
  },
  loadMoreButton: {
    backgroundColor: theme.palette.common.white,
    textTransform: 'none',
    borderRadius: 0,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.3,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 4,
    [theme.breakpoints.down('xs')]: {
      paddingTop: 15,
      paddingBottom: 15,
    },
  },
  nextButtonWrapper: {
    textAlign: 'right',
    marginTop: 19,
  },
  nextButton: {
    textTransform: 'none',
    borderRadius: 0,
    fontSize: 14,
    fontWeight: 600,
    padding: '14px 70px',
    marginTop: 12,
    [theme.breakpoints.down('xs')]: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
    },
  },
  positionCard: {
    padding: 0,
    marginBottom: 10,
  },
  iconButton: {
    padding: 0,
  },
  positionRoot: {
    paddingLeft: 8,
  },
  position: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0.4,
    color: '#4a4a4a',
  },
  positionGroup: {
    marginTop: 30,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: '#313131',
    paddingLeft: 5,
  },
  headText: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: 0.4,
    textTransform: 'none',
    color: '#7cc6fe',
  },
});

type Props = {
  user: Object,
  roles: List,
  isSaving: boolean,
  saveError: string,
  isDeleting: boolean,
  deleteError: string,
  classes: Object,
  requestCreateRole: Function,
  requestDeleteRole: Function,
  requestRoles: Function,
  updateUser: Function,
};

type State = {
  keyword: string,
  selectedPositions: Array<string>,
  commonPositions: Array<string>,
  filteredPositions: Array<string>,
  page: number,
  isSkipOpen: boolean,
};

class OnboardingPositionPage extends Component<Props, State> {
  state = {
    keyword: '',
    selectedPositions: [],
    commonPositions: COMMON_POSITIONS.sort(),
    filteredPositions: ROLES.sort(),
    page: 1,
    isSkipOpen: false,
    isHirer: false,
  };
  componentDidMount() {
    this.props.requestRoles();
  }
  componentDidUpdate(prevProps: Props) {
    const { user, isSaving, saveError, isDeleting, deleteError } = this.props;
    const { isHirer } = this.state;
    if (prevProps.isSaving && !isSaving && !saveError) {
      if (isHirer) history.push(`/network`);
      else history.push(`/f/${user.get('slug')}`);
    }
    if (prevProps.isDeleting && !isDeleting && !deleteError) {
      this.props.requestRoles();
    }
  }
  openSkipModal = () => {
    this.setState({ isSkipOpen: true });
  };
  closeSkipModal = () => {
    this.setState({ isSkipOpen: false, isHirer: false });
  };
  debouncedSearch = debounce(value => {
    if (value) {
      const regExStartWith = new RegExp(`^${value}`, 'i');
      const regExContains = new RegExp(`${value}`, 'i');
      const startWith = ROLES.sort().filter(r => regExStartWith.test(r));
      const contains = ROLES.sort().filter(
        r => regExContains.test(r) && !startWith.includes(r)
      );
      const commonStartWith = COMMON_POSITIONS.sort().filter(r =>
        regExStartWith.test(r)
      );
      const commonContains = COMMON_POSITIONS.sort().filter(
        r => regExContains.test(r) && !commonStartWith.includes(r)
      );
      this.setState({
        filteredPositions: [...startWith, ...contains],
        commonPositions: [...commonStartWith, ...commonContains],
        page: 1,
      });
    } else {
      this.setState({
        filteredPositions: ROLES.sort(),
        commonPositions: COMMON_POSITIONS.sort(),
        page: 1,
      });
    }
  }, 500);
  handleChange = e => {
    e.persist();
    this.setState({ keyword: e.target.value }, () => {
      this.debouncedSearch(e.target.value);
    });
  };
  addPosition = position => {
    this.setState(
      update(this.state, {
        selectedPositions: { $push: [position] },
      })
    );
  };
  removePosition = position => {
    const { roles } = this.props;
    const { selectedPositions } = this.state;
    const pos = selectedPositions.indexOf(position);
    if (pos !== -1) {
      this.setState(
        update(this.state, {
          selectedPositions: { $splice: [[pos, 1]] },
        })
      );
    } else {
      const selectedRoles = roles.filter(role => role.get('name') === position);
      if (selectedRoles.size === 1) {
        this.props.requestDeleteRole({ id: selectedRoles.getIn([0, 'id']) });
      }
    }
  };
  handleNext = (isSkip, isHirer) => {
    const { selectedPositions } = this.state;
    if (selectedPositions.length) {
      this.handleHirerNext(isHirer);
      const positions = selectedPositions.map(position => ({
        name: position,
        years: '',
        minRate: '',
        maxRate: '',
        unit: 'hour',
      }));
      this.props.requestCreateRole(positions);
    } else if (isSkip) {
      this.handleHirerNext(isHirer);
      history.push('/network');
    } else {
      this.setState({ isSkipOpen: true });
    }
  };
  handleHirerNext = isHirer => {
    this.setState({ isHirer });
    this.props.updateUser({
      profile: {
        isHirer,
        showBadges: !isHirer,
        showPositions: !isHirer,
        showCoworkers: !isHirer,
        showRecommendations: !isHirer,
      },
    });
  };
  groupPositions = positions =>
    positions.reduce((group, position) => {
      const newGroup = group;
      const firstLetter = position.charAt(0).toUpperCase();
      if (newGroup[firstLetter]) {
        newGroup[firstLetter] = [...newGroup[firstLetter], position];
      } else {
        newGroup[firstLetter] = [position];
      }
      return newGroup;
    }, {});
  loadMore = () => {
    this.setState(
      update(this.state, {
        page: { $set: this.state.page + 1 },
      })
    );
  };
  render() {
    const { roles, classes } = this.props;
    const {
      keyword,
      selectedPositions,
      commonPositions,
      filteredPositions,
      page,
      isSkipOpen,
    } = this.state;
    const groupedPositions = this.groupPositions(
      filteredPositions.slice(0, page * perPage)
    );
    const existingRoles = roles
      ? roles.map(role => role.get('name')).toJS()
      : [];
    return (
      <React.Fragment>
        <div className={classes.banner}>
          <Typography className={classes.bannerTitle} align="center">
            Select the positions you&apos;re willing &amp; able to work
          </Typography>
          <Typography className={classes.text} align="center">
            These will be visible on your profile so you can get hired!
          </Typography>
          <Grid item xs={12} className={classes.hirerContentSection}>
            <Typography className={classes.headText}>
              Not looking for work?
            </Typography>
            <Link
              onClick={() => this.handleNext(false, true)}
              className={classes.headText}
            >
              I want to hire event workers
            </Link>
          </Grid>
        </div>
        <div className={classes.content}>
          <div className={classes.leftPanel}>
            <div className={classes.positionsBox}>
              <Typography className={classes.positionsTitle}>
                I&apos;m available as a:
              </Typography>
              {roles &&
                roles.map(role => (
                  <ListItem
                    key={generate()}
                    className={classes.positionCard}
                    onClick={() =>
                      this.props.requestDeleteRole({ id: role.get('id') })
                    }
                  >
                    <IconButton className={classes.iconButton}>
                      <ClearIcon />
                    </IconButton>
                    <ListItemText
                      primary={role.get('name')}
                      classes={{
                        root: classes.positionRoot,
                        primary: classes.position,
                      }}
                    />
                  </ListItem>
                ))}
              {selectedPositions.map(position => (
                <ListItem
                  key={generate()}
                  className={classes.positionCard}
                  onClick={() => this.removePosition(position)}
                >
                  <IconButton className={classes.iconButton}>
                    <ClearIcon />
                  </IconButton>
                  <ListItemText
                    primary={position}
                    classes={{
                      root: classes.positionRoot,
                      primary: classes.position,
                    }}
                  />
                </ListItem>
              ))}
            </div>
          </div>
          <div className={classes.rightPanel}>
            <FormControl classes={{ root: classes.formControl }} fullWidth>
              <Input
                className={classes.textInput}
                value={keyword}
                inputProps={{
                  placeholder: 'Find positions',
                }}
                startAdornment={
                  <InputAdornment
                    position="start"
                    className={classes.adornment}
                  >
                    <SearchIcon />
                  </InputAdornment>
                }
                disableUnderline
                onChange={this.handleChange}
              />
            </FormControl>
            <Typography className={classes.commonTitle}>Most common</Typography>
            <Grid container spacing={8}>
              {commonPositions.map(position => (
                <Grid item xs={12} lg={6} key={generate()}>
                  <PositionCard
                    position={position}
                    selected={
                      selectedPositions.includes(position) ||
                      existingRoles.includes(position)
                    }
                    addPosition={this.addPosition}
                    removePosition={this.removePosition}
                  />
                </Grid>
              ))}
            </Grid>
            {Object.keys(groupedPositions).map(letter => (
              <Grid
                container
                spacing={8}
                key={letter}
                className={classes.positionGroup}
              >
                <Grid item xs={12} lg={12}>
                  <Typography className={classes.groupTitle}>
                    {letter}
                  </Typography>
                </Grid>
                {groupedPositions[letter].map(position => (
                  <Grid item xs={12} lg={6} key={generate()}>
                    <PositionCard
                      position={position}
                      selected={
                        selectedPositions.includes(position) ||
                        existingRoles.includes(position)
                      }
                      addPosition={this.addPosition}
                      removePosition={this.removePosition}
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
            <Grid container spacing={8}>
              {filteredPositions.length > page * perPage && (
                <Grid item xs={12} lg={12}>
                  <Button
                    fullWidth
                    color="primary"
                    className={classes.loadMoreButton}
                    onClick={this.loadMore}
                  >
                    See More
                  </Button>
                </Grid>
              )}
              <Grid item xs={12} lg={12} className={classes.nextButtonWrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.nextButton}
                  onClick={() => this.handleNext(false, false)}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
        <OnboardingPositionSkipModal
          isOpen={isSkipOpen}
          onCloseModal={this.closeSkipModal}
          handleHire={() => this.handleNext(true, true)}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  roles: state.getIn(['role', 'roles']),
  isSaving: state.getIn(['role', 'isCreating']),
  saveError: state.getIn(['role', 'createError']),
  isDeleting: state.getIn(['role', 'isDeleting']),
  deleteError: state.getIn(['role', 'deleteError']),
});

const mapDispatchToProps = dispatch => ({
  requestRoles: () => dispatch(requestRoles()),
  requestCreateRole: payload => dispatch(requestCreateRole(payload)),
  requestDeleteRole: payload => dispatch(requestDeleteRole(payload)),
  updateUser: payload => dispatch(requestUserDataUpdate(payload)),
});

export default compose(
  injectSagas({ key: 'role', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(OnboardingPositionPage);
