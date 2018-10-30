// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { generate } from 'shortid';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';

import TalentInput from 'components/TalentInput';
import UnitInput from 'components/UnitInput';

import saga, {
  reducer,
  requestTalents,
  requestUpdateTalent,
  requestCreateTalent,
  requestDeleteTalent,
  requestUnits,
  requestUpdateUnit,
  requestCreateUnit,
  requestDeleteUnit,
} from 'containers/Talent/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {
    maxWidth: '989px',
    margin: '50px auto 300px auto',
    display: 'flex',
  },
  leftPanel: {
    width: 242,
    marginRight: 35,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  menuItem: {
    color: '#5a5d64',
    paddingTop: 15,
    paddingLeft: 20,
    paddingBottom: 15,
    fontWeight: 500,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  activeMenuItem: {
    paddingTop: 15,
    paddingLeft: 20,
    paddingBottom: 15,
    fontWeight: 500,
    backgroundColor: '#e4e6e6',
    color: theme.palette.primary.main,
    cursor: 'pointer',
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  line: {
    position: 'absolute',
    display: 'block',
    content: '',
    width: 3,
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    top: 0,
    left: 0,
  },
  rightPanel: {
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      margin: 5,
    },
  },
  profileInfo: {
    marginBottom: 20,
  },
  section: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    marginBottom: 20,
  },
  sectionHeader: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    backgroundColor: '#edeeee',
  },
  helpButton: {
    padding: 0,
    textTransform: 'none',
  },
  sectionBody: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
  },
  addButton: {
    color: theme.palette.primary.main,
    border: '1px solid #e5e5e5',
    backgroundColor: theme.palette.common.white,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    borderRadius: 3,
    width: 339,
    fontSize: 15,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
});

type Props = {
  talents: Object,
  isSaving: boolean,
  saveError: string,
  isCreating: boolean,
  createError: string,
  isDeleting: boolean,
  deleteError: string,
  units: Object,
  isUnitSaving: boolean,
  unitSaveError: string,
  isUnitCreating: boolean,
  unitCreateError: string,
  isUnitDeleting: boolean,
  unitDeleteError: string,
  classes: Object,
  requestTalents: Function,
  updateTalent: Function,
  addTalent: Function,
  deleteTalent: Function,
  requestUnits: Function,
  updateUnit: Function,
  addUnit: Function,
  deleteUnit: Function,
};

type State = {
  selectedSection: string,
  newTalent: ?Object,
  newUnit: ?Object,
};

class TalentPage extends Component<Props, State> {
  state = {
    selectedSection: 'talents',
    newTalent: null,
    newUnit: null,
  };
  componentDidMount() {
    this.props.requestTalents();
    this.props.requestUnits();
  }
  componentDidUpdate(prevProps: Props) {
    const {
      isSaving,
      saveError,
      isCreating,
      createError,
      isDeleting,
      deleteError,
      isUnitSaving,
      unitSaveError,
      isUnitCreating,
      unitCreateError,
      isUnitDeleting,
      unitDeleteError,
    } = this.props;
    if (prevProps.isSaving && !isSaving && !saveError) {
      this.props.requestTalents();
    }
    if (prevProps.isDeleting && !isDeleting && !deleteError) {
      this.props.requestTalents();
    }
    if (prevProps.isCreating && !isCreating && !createError) {
      this.props.requestTalents();
    }
    if (prevProps.isUnitSaving && !isUnitSaving && !unitSaveError) {
      this.props.requestUnits();
    }
    if (prevProps.isUnitDeleting && !isUnitDeleting && !unitDeleteError) {
      this.props.requestUnits();
    }
    if (prevProps.isUnitCreating && !isUnitCreating && !unitCreateError) {
      this.props.requestUnits();
    }
  }
  onCancelEdit = () => {
    this.setState({ newTalent: null });
  };
  onCancelUnitEdit = () => {
    this.setState({ newUnit: null });
  };
  addNewTalent = () => {
    this.setState({
      newTalent: {
        name: '',
        rate: '',
        unit: '',
      },
    });
  };
  addNewUnit = () => {
    this.setState({
      newUnit: {
        name: '',
      },
    });
  };
  render() {
    const { talents, units, classes } = this.props;
    const { selectedSection, newTalent, newUnit } = this.state;
    const unitValues = units.map(unit => unit.get('name')).toJS();
    return (
      <div className={classes.root}>
        <div className={classes.leftPanel}>
          <Typography className={classes.title} variant="h6">
            Talents &amp; Rate
          </Typography>
          <div
            className={
              selectedSection === 'talents'
                ? classes.activeMenuItem
                : classes.menuItem
            }
            role="button"
            onClick={() => this.setState({ selectedSection: 'talents' })}
          >
            {selectedSection === 'talents' && <div className={classes.line} />}
            Talents and Rate
          </div>
          <div
            className={
              selectedSection === 'units'
                ? classes.activeMenuItem
                : classes.menuItem
            }
            role="button"
            onClick={() => this.setState({ selectedSection: 'units' })}
          >
            {selectedSection === 'units' && <div className={classes.line} />}
            Billing Units
          </div>
        </div>
        <div className={classes.rightPanel}>
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography variant="h6">Talents &amp; Rate</Typography>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.helpButton}
                    variant="text"
                    color="primary"
                  >
                    Help?
                  </Button>
                </Grid>
              </Grid>
            </div>
            <div className={classes.sectionBody}>
              {talents &&
                talents.map(talent => (
                  <TalentInput
                    key={generate()}
                    mode="read"
                    data={talent.toJS()}
                    units={unitValues}
                    onCancel={this.onCancelEdit}
                    updateTalent={this.props.updateTalent}
                    deleteTalent={this.props.deleteTalent}
                  />
                ))}
              {newTalent && (
                <TalentInput
                  mode="edit"
                  data={newTalent}
                  units={unitValues}
                  onCancel={this.onCancelEdit}
                  addTalent={this.props.addTalent}
                />
              )}
              <Grid container justify="center">
                <Grid item>
                  <Button
                    className={classes.addButton}
                    onClick={this.addNewTalent}
                  >
                    <AddIcon />
                    &nbsp;Add New
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
          <div className={classes.section}>
            <div className={classes.sectionHeader}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography variant="h6">Custom Billing Units</Typography>
                </Grid>
                <Grid item>
                  <Button
                    className={classes.helpButton}
                    variant="text"
                    color="primary"
                  >
                    Help?
                  </Button>
                </Grid>
              </Grid>
            </div>
            <div className={classes.sectionBody}>
              {units &&
                units.map(unit => (
                  <UnitInput
                    key={generate()}
                    mode="read"
                    data={unit.toJS()}
                    onCancel={this.onCancelUnitEdit}
                    updateUnit={this.props.updateUnit}
                    deleteUnit={this.props.deleteUnit}
                  />
                ))}
              {newUnit && (
                <UnitInput
                  mode="edit"
                  data={newUnit}
                  onCancel={this.onCancelUnitEdit}
                  addUnit={this.props.addUnit}
                />
              )}
              <Grid container justify="center">
                <Grid item>
                  <Button
                    className={classes.addButton}
                    onClick={this.addNewUnit}
                  >
                    <AddIcon />
                    &nbsp;Add New
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  talents: state.getIn(['talent', 'talents']),
  isSaving: state.getIn(['talent', 'isSaving']),
  saveError: state.getIn(['talent', 'saveError']),
  isCreating: state.getIn(['talent', 'isCreating']),
  createError: state.getIn(['talent', 'createError']),
  isDeleting: state.getIn(['talent', 'isDeleting']),
  deleteError: state.getIn(['talent', 'deleteError']),
  units: state.getIn(['talent', 'units']),
  isUnitSaving: state.getIn(['talent', 'isUnitSaving']),
  unitSaveError: state.getIn(['talent', 'unitSaveError']),
  isUnitCreating: state.getIn(['talent', 'isUnitCreating']),
  unitCreateError: state.getIn(['talent', 'unitCreateError']),
  isUnitDeleting: state.getIn(['talent', 'isUnitDeleting']),
  unitDeleteError: state.getIn(['talent', 'unitDeleteError']),
});

const mapDispatchToProps = dispatch => ({
  requestTalents: () => dispatch(requestTalents()),
  updateTalent: (id, payload) => dispatch(requestUpdateTalent(id, payload)),
  addTalent: payload => dispatch(requestCreateTalent(payload)),
  deleteTalent: payload => dispatch(requestDeleteTalent(payload)),
  requestUnits: () => dispatch(requestUnits()),
  updateUnit: (id, payload) => dispatch(requestUpdateUnit(id, payload)),
  addUnit: payload => dispatch(requestCreateUnit(payload)),
  deleteUnit: payload => dispatch(requestDeleteUnit(payload)),
});

export default compose(
  injectSagas({ key: 'talent', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(TalentPage);
