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
import BaseModal from 'components/BaseModal';

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
} from 'containers/Role/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {
    maxWidth: '712px',
    margin: '50px auto 300px auto',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
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
      margin: 10,
    },
  },
  profileInfo: {
    marginBottom: 20,
  },
  section: {
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      boxShadow: 'none',
      marginBottom: 0,
    },
  },
  sectionHeader: {
    paddingLeft: 30,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    backgroundColor: '#edeeee',
    [theme.breakpoints.down('sm')]: {
      backgroundColor: 'transparent',
      padding: '25px 0px 5px 0px',
    },
  },
  sectionTitle: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 18,
    },
  },
  helpButton: {
    padding: 0,
    textTransform: 'none',
  },
  sectionBody: {
    backgroundColor: theme.palette.common.white,
    padding: 30,
    [theme.breakpoints.down('xs')]: {
      boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
      borderRadius: 3,
      padding: '10px 15px',
    },
  },
  addButtonContainer: {
    [theme.breakpoints.down('xs')]: {
      flex: 1,
    },
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
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  modal: {
    padding: 30,
    width: 320,
  },
});

const talentsHelp =
  'Enter the different types of work you do at events and, optionally, the rate you charge for those services.';
const unitsHelp =
  'If for a particular type of work you charge differently than hourly, daily or per event, you can enter the unit you charge by here.';

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
  newTalent: ?Object,
  newUnit: ?Object,
  isOpen: boolean,
  helpText: string,
};

class RolesPage extends Component<Props, State> {
  state = {
    newTalent: null,
    newUnit: null,
    isOpen: false,
    helpText: '',
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
  onCloseModal = () => {
    this.setState({ isOpen: false });
  };
  addNewTalent = () => {
    this.setState({
      newTalent: {
        name: '',
        rate: '',
        unit: 'hour',
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
    const { newTalent, newUnit, isOpen, helpText } = this.state;
    const unitValues = units.map(unit => unit.get('name')).toJS();
    return (
      <div className={classes.root}>
        <div className={classes.section}>
          <div className={classes.sectionHeader}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6" className={classes.sectionTitle}>
                  Talents &amp; Rate
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  className={classes.helpButton}
                  variant="text"
                  color="primary"
                  onClick={() =>
                    this.setState({
                      isOpen: true,
                      helpText: talentsHelp,
                    })
                  }
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
              <Grid item className={classes.addButtonContainer}>
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
                <Typography variant="h6" className={classes.sectionTitle}>
                  Custom Billing Units
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  className={classes.helpButton}
                  variant="text"
                  color="primary"
                  onClick={() =>
                    this.setState({
                      isOpen: true,
                      helpText: unitsHelp,
                    })
                  }
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
              <Grid item className={classes.addButtonContainer}>
                <Button className={classes.addButton} onClick={this.addNewUnit}>
                  <AddIcon />
                  &nbsp;Add New
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
        <BaseModal
          className={classes.modal}
          isOpen={isOpen}
          onCloseModal={this.onCloseModal}
        >
          <Typography variant="body2" component="p">
            {helpText}
          </Typography>
        </BaseModal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  talents: state.getIn(['role', 'talents']),
  isSaving: state.getIn(['role', 'isSaving']),
  saveError: state.getIn(['role', 'saveError']),
  isCreating: state.getIn(['role', 'isCreating']),
  createError: state.getIn(['role', 'createError']),
  isDeleting: state.getIn(['role', 'isDeleting']),
  deleteError: state.getIn(['role', 'deleteError']),
  units: state.getIn(['role', 'units']),
  isUnitSaving: state.getIn(['role', 'isUnitSaving']),
  unitSaveError: state.getIn(['role', 'unitSaveError']),
  isUnitCreating: state.getIn(['role', 'isUnitCreating']),
  unitCreateError: state.getIn(['role', 'unitCreateError']),
  isUnitDeleting: state.getIn(['role', 'isUnitDeleting']),
  unitDeleteError: state.getIn(['role', 'unitDeleteError']),
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
  injectSagas({ key: 'role', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(RolesPage);
