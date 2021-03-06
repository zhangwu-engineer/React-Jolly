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

import BusinessRoleInput from 'components/BusinessRoleInput';
import BaseModal from 'components/BaseModal';

import saga, {
  reducer,
  requestBusinessRoles,
  requestUpdateRole,
  requestCreateRole,
  requestDeleteRole,
} from 'containers/Role/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {
    paddingBottom: 35,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#404040',
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
    marginBottom: 20,
    [theme.breakpoints.down('xs')]: {
      boxShadow: 'none',
      marginBottom: 0,
    },
  },
  sectionHeader: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 600,
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
  },
  addButtonContainer: {
    [theme.breakpoints.down('xs')]: {
      flex: 1,
    },
  },
  addButton: {
    color: theme.palette.primary.main,
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'none',
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

type Props = {
  business: Object,
  roles: Object,
  isSaving: boolean,
  saveError: string,
  isCreating: boolean,
  createError: string,
  isDeleting: boolean,
  deleteError: string,
  classes: Object,
  requestBusinessRoles: Function,
  updateRole: Function,
  addRole: Function,
  deleteRole: Function,
};

type State = {
  newRole: ?Object,
  isOpen: boolean,
  helpText: string,
  activeEditId: any,
};

class BusinessPositionsForm extends Component<Props, State> {
  state = {
    newRole: null,
    isOpen: false,
    helpText: '',
    activeEditId: null,
  };
  componentDidMount() {
    const { business } = this.props;
    const slug = business && business.slug;
    this.props.requestBusinessRoles(slug);
  }
  componentDidUpdate(prevProps: Props) {
    const {
      isSaving,
      saveError,
      isCreating,
      createError,
      isDeleting,
      deleteError,
      business,
    } = this.props;
    const slug = business && business.slug;
    if (prevProps.isSaving && !isSaving && !saveError) {
      this.props.requestBusinessRoles(slug);
    }
    if (prevProps.isDeleting && !isDeleting && !deleteError) {
      this.props.requestBusinessRoles(slug);
    }
    if (prevProps.isCreating && !isCreating && !createError) {
      this.props.requestBusinessRoles(slug);
    }
  }
  onEdit = activeEditId => {
    this.setState({ activeEditId });
  };
  onCancelEdit = () => {
    this.setState({ newRole: null });
  };
  onCloseModal = () => {
    this.setState({ isOpen: false });
  };
  addNewRole = () => {
    this.setState({
      newRole: {
        name: '',
        years: '',
        minRate: '',
        maxRate: '',
        unit: 'hour',
      },
    });
    document.getElementById('addButton').style.display = 'none';
  };
  render() {
    const { roles, classes, business } = this.props;
    const { newRole, isOpen, helpText, activeEditId } = this.state;
    const businessId = business && business.id;
    return (
      <div className={classes.root}>
        <div className={classes.section}>
          <div className={classes.sectionHeader}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h1" className={classes.title}>
                  Positions
                </Typography>
              </Grid>
              <Grid item>
                <Grid container justify="center" id="addButton">
                  <Grid item className={classes.addButtonContainer}>
                    <Button
                      className={classes.addButton}
                      onClick={this.addNewRole}
                    >
                      <AddIcon />
                      &nbsp;Add new position
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <div className={classes.sectionBody}>
            {roles &&
              roles.map((role, index) => (
                <BusinessRoleInput
                  key={generate()}
                  id={index}
                  activeEditId={activeEditId}
                  data={role.toJS()}
                  units={[]}
                  onEdit={this.onEdit}
                  onCancel={this.onCancelEdit}
                  updateRole={this.props.updateRole}
                  deleteRole={this.props.deleteRole}
                />
              ))}
            {newRole && (
              <BusinessRoleInput
                data={newRole}
                units={[]}
                onCancel={this.onCancelEdit}
                businessId={businessId}
                addRole={this.props.addRole}
              />
            )}
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
  roles: state.getIn(['role', 'roles']),
  isSaving: state.getIn(['role', 'isSaving']),
  saveError: state.getIn(['role', 'saveError']),
  isCreating: state.getIn(['role', 'isCreating']),
  createError: state.getIn(['role', 'createError']),
  isDeleting: state.getIn(['role', 'isDeleting']),
  deleteError: state.getIn(['role', 'deleteError']),
});

const mapDispatchToProps = dispatch => ({
  requestBusinessRoles: slug => dispatch(requestBusinessRoles(slug)),
  updateRole: (id, payload, isBusinessRole) =>
    dispatch(requestUpdateRole(id, payload, isBusinessRole)),
  addRole: (payload, businessId) =>
    dispatch(requestCreateRole(payload, businessId)),
  deleteRole: payload => dispatch(requestDeleteRole(payload)),
});

export default compose(
  injectSagas({ key: 'role', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(BusinessPositionsForm);
