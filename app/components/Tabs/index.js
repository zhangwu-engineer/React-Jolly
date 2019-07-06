// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 10,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 20,
    },
  },
  tabWrapper: {
    flexGrow: 1,
  },
  tabItem: {
    height: 44,
    fontSize: 14,
    textAlign: 'center',
    color: '#1b1b1b',
    letterSpacing: 0.33,
    paddingTop: 12,
    boxSizing: 'border-box',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#eaf1f7',
    },
  },
  active: {
    fontWeight: 600,
    borderBottom: '4px solid #083f76',
  },
  inactive: {
    fontWeight: 400,
  },
});

type Props = {
  classes: Object,
  items: Array<Object>,
  activeIndex: Number,
  handleChange: Function,
};

class Tabs extends Component<Props> {
  render() {
    const { classes, items, activeIndex } = this.props;
    return (
      <div className={classes.root}>
        {items &&
          items.map((item, index) => (
            <Grid key={generate()} className={classes.tabWrapper}>
              <Typography
                className={cx(
                  index === activeIndex ? classes.active : classes.classes,
                  classes.tabItem
                )}
                onClick={() => {
                  if (index !== activeIndex) this.props.handleChange(item.link);
                }}
              >
                {item.caption}
              </Typography>
            </Grid>
          ))}
      </div>
    );
  }
}

export default withStyles(styles)(Tabs);
