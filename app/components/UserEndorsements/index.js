// @flow

import React, { Component } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { generate } from 'shortid';
import { groupBy, toPairs, fromPairs, zip } from 'lodash-es';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import { history } from 'components/ConnectedRouter';
import BaseModal from 'components/BaseModal';
import Icon from 'components/Icon';

import MedalIcon from 'images/sprite/medal.svg';

const styles = theme => ({
  root: {},
  header: {
    paddingLeft: 15,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 30,
    [theme.breakpoints.down('xs')]: {
      padding: '25px 15px 0px 15px',
      backgroundColor: theme.palette.common.white,
    },
  },
  body: {
    marginBottom: 20,
    padding: '20px 30px',
    boxShadow: '0 10px 20px 0 rgba(187, 187, 187, 0.5)',
    backgroundColor: theme.palette.common.white,
    [theme.breakpoints.down('xs')]: {
      padding: 15,
      boxShadow: 'none',
    },
  },
  chart: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0074d7',
  },
  modal: {
    padding: 25,
    width: 380,
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 50px)',
      padding: 20,
    },
  },
  modalTitle: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 30,
    textAlign: 'center',
  },
  icon: {
    margin: '0 auto',
  },
  endorserGroup: {
    position: 'relative',
    paddingLeft: 30,
    marginBottom: 30,
  },
  verticalLine: {
    position: 'absolute',
    width: 5,
    height: '100%',
    left: 0,
    top: 0,
    backgroundColor: '#f00',
  },
  endorseQuality: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0d0d0d',
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: '#afafaf',
    width: 30,
    height: 30,
  },
  count: {
    position: 'absolute',
    textAlign: 'center',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 14,
    color: '#0d0d0d',
    fontWeight: 600,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0d0d0d',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  roleCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#989898',
  },
  roleName: {
    fontSize: 14,
    fontWeight: 500,
    color: '#989898',
  },
  roleDot: {
    width: 4,
    height: 4,
    backgroundColor: '#989898',
    borderRadius: 4,
    display: 'inline-block',
    marginLeft: 5,
    marginRight: 5,
  },
});

const emptyData = [
  { name: 'Group A', value: 2 },
  { name: 'Group B', value: 1 },
  { name: 'Group C', value: 1 },
];
const COLORS = ['#1575D9', '#033D78', '#7CC6FE', '#4AA8F7'];
const EMPTY_COLORS = ['#D3E7F9', '#DFF0FE', '#ECF5FF'];

type Props = {
  user: Object,
  endorsements: Object,
  classes: Object,
  publicMode?: boolean,
};

type State = {
  isOpen: boolean,
};

class UserEndorsements extends Component<Props, State> {
  state = {
    isOpen: false,
  };
  closeModal = () => {
    this.setState({ isOpen: false });
  };
  openModal = () => {
    this.setState({ isOpen: true });
  };
  render() {
    const { user, endorsements, publicMode, classes } = this.props;
    const { isOpen } = this.state;
    const qualityNames = {
      hardest_worker: 'Hardest Worker',
      most_professional: 'Most Professional',
      best_attitude: 'Best Attitude',
      team_player: 'Team Player',
    };
    const result = toPairs(groupBy(endorsements.toJS(), 'quality'));
    const groupedEndorsers = result.map(currentItem =>
      fromPairs(zip(['quality', 'users'], currentItem))
    );
    const data = groupedEndorsers.map(group => ({
      name: group.quality,
      value: group.users.length,
    }));
    const roles = groupedEndorsers.map(group => {
      const roleGroup = {
        name: group.quality,
        roles: [],
      };
      const roleCounts = group.users.map(u => u.role).reduce((p, c) => {
        const newP = p;
        if (!newP[c]) {
          newP[c] = 0;
        }
        newP[c] += 1;
        return newP;
      }, {});
      roleGroup.roles = Object.keys(roleCounts).map(k => ({
        name: k,
        count: roleCounts[k],
      }));
      return roleGroup;
    });
    return (
      <div>
        <div className={classes.header}>
          <Typography variant="h6">Endorsements</Typography>
        </div>
        <div className={classes.body}>
          {endorsements && endorsements.size === 0 ? (
            <React.Fragment>
              <div className={classes.chart}>
                <PieChart width={170} height={170}>
                  <Pie
                    data={emptyData}
                    dataKey="value"
                    cx={80}
                    cy={80}
                    innerRadius={55}
                    outerRadius={80}
                    startAngle={450}
                    endAngle={90}
                  >
                    {emptyData.map((entry, index) => (
                      <Cell
                        key={generate()}
                        fill={EMPTY_COLORS[index % EMPTY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <Typography className={classes.emptyText}>
                  0<br />
                  Total
                </Typography>
              </div>
              {!publicMode && (
                <Grid container justify="center">
                  <Grid item>
                    <Button
                      color="primary"
                      classes={{
                        label: classes.buttonLabel,
                      }}
                      onClick={this.openModal}
                    >
                      + Get Endorsed
                    </Button>
                  </Grid>
                </Grid>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className={classes.chart}>
                <PieChart width={170} height={170}>
                  <Pie
                    data={data}
                    dataKey="value"
                    cx={80}
                    cy={80}
                    innerRadius={55}
                    outerRadius={80}
                    startAngle={450}
                    endAngle={90}
                  >
                    {emptyData.map((entry, index) => (
                      <Cell
                        key={generate()}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <Typography className={classes.count}>
                  {endorsements.size}
                  <br />
                  Total
                </Typography>
              </div>
              <div className={classes.endorsersSection}>
                {groupedEndorsers.map((group, index) => (
                  <div key={generate()} className={classes.endorserGroup}>
                    <div
                      className={classes.verticalLine}
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <Typography className={classes.endorseQuality}>
                      {qualityNames[group.quality]}
                    </Typography>
                    <div>
                      {roles[index] &&
                        roles[index].roles.map((role, i) => (
                          <span key={generate()}>
                            <span className={classes.roleCount}>
                              {role.count}
                              &nbsp;
                            </span>
                            <span className={classes.roleName}>
                              {role.name}
                            </span>
                            {i < roles[index].roles.length - 1 && (
                              <div className={classes.roleDot} />
                            )}
                          </span>
                        ))}
                    </div>
                    <Grid
                      container
                      className={classes.endorseUsers}
                      spacing={8}
                    >
                      {group.users.map(u => (
                        <Grid item key={generate()}>
                          <Avatar
                            className={classes.avatar}
                            src={u.from.profile.avatar}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>
        <BaseModal
          className={classes.modal}
          isOpen={isOpen}
          onCloseModal={this.closeModal}
        >
          <Icon
            glyph={MedalIcon}
            width={40}
            height={70}
            className={classes.icon}
          />
          <Typography
            variant="h6"
            component="h1"
            className={classes.modalTitle}
          >
            To Get Endorsements...
          </Typography>
          <Typography component="p" className={classes.modalText}>
            Add an event you worked in the past,
            <br />
            and tag your coworkers—they’ll be able
            <br />
            to endorse you for the role you worked
          </Typography>
          <Grid container justify="space-between">
            <Grid item>
              <Button onClick={this.closeModal}>Back</Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => {
                  this.setState({ isOpen: false }, () => {
                    history.push(`/f/${user.get('slug')}/add`);
                  });
                }}
              >
                Add Experience
              </Button>
            </Grid>
          </Grid>
        </BaseModal>
      </div>
    );
  }
}

export default withStyles(styles)(UserEndorsements);
