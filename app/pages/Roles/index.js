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

import RoleInput from 'components/RoleInput';
import BaseModal from 'components/BaseModal';

import saga, {
  reducer,
  requestRoles,
  requestUpdateRole,
  requestCreateRole,
  requestDeleteRole,
} from 'containers/Role/sagas';
import injectSagas from 'utils/injectSagas';

const styles = theme => ({
  root: {
    maxWidth: '712px',
    margin: '50px auto 300px auto',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      padding: 10,
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
      padding: '10px 15px',
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

const rolesHelp =
  'Enter the different types of work you do at events and, optionally, the rate you charge for those services.';

type Props = {
  roles: Object,
  isSaving: boolean,
  saveError: string,
  isCreating: boolean,
  createError: string,
  isDeleting: boolean,
  deleteError: string,
  classes: Object,
  requestRoles: Function,
  updateRole: Function,
  addRole: Function,
  deleteRole: Function,
};

type State = {
  newRole: ?Object,
  isOpen: boolean,
  helpText: string,
};

class RolesPage extends Component<Props, State> {
  state = {
    newRole: null,
    isOpen: false,
    helpText: '',
  };
  componentDidMount() {
    this.props.requestRoles();
  }
  componentDidUpdate(prevProps: Props) {
    const {
      isSaving,
      saveError,
      isCreating,
      createError,
      isDeleting,
      deleteError,
    } = this.props;
    if (prevProps.isSaving && !isSaving && !saveError) {
      this.props.requestRoles();
    }
    if (prevProps.isDeleting && !isDeleting && !deleteError) {
      this.props.requestRoles();
    }
    if (prevProps.isCreating && !isCreating && !createError) {
      this.props.requestRoles();
    }
  }
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
        rate: '',
        unit: 'hour',
      },
    });
  };
  render() {
    const { roles, classes } = this.props;
    const { newRole, isOpen, helpText } = this.state;
    return (
      <div className={classes.root}>
        <div className={classes.section}>
          <div className={classes.sectionHeader}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h6" className={classes.sectionTitle}>
                  Roles &amp; Rate
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
                      helpText: rolesHelp,
                    })
                  }
                >
                  Help?
                </Button>
              </Grid>
            </Grid>
          </div>
          <div className={classes.sectionBody}>
            {roles &&
              roles.map(role => (
                <RoleInput
                  key={generate()}
                  mode="read"
                  data={role.toJS()}
                  units={[]}
                  onCancel={this.onCancelEdit}
                  updateRole={this.props.updateRole}
                  deleteRole={this.props.deleteRole}
                />
              ))}
            {newRole && (
              <RoleInput
                mode="edit"
                data={newRole}
                units={[]}
                onCancel={this.onCancelEdit}
                addRole={this.props.addRole}
              />
            )}
            <Grid container justify="center">
              <Grid item className={classes.addButtonContainer}>
                <Button className={classes.addButton} onClick={this.addNewRole}>
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
  roles: state.getIn(['role', 'roles']),
  isSaving: state.getIn(['role', 'isSaving']),
  saveError: state.getIn(['role', 'saveError']),
  isCreating: state.getIn(['role', 'isCreating']),
  createError: state.getIn(['role', 'createError']),
  isDeleting: state.getIn(['role', 'isDeleting']),
  deleteError: state.getIn(['role', 'deleteError']),
});

const mapDispatchToProps = dispatch => ({
  requestRoles: () => dispatch(requestRoles()),
  updateRole: (id, payload) => dispatch(requestUpdateRole(id, payload)),
  addRole: payload => dispatch(requestCreateRole(payload)),
  deleteRole: payload => dispatch(requestDeleteRole(payload)),
});

export default compose(
  injectSagas({ key: 'role', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles)
)(RolesPage);
