// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

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
  tabItem: {
    height: 44,
    flexGrow: 1,
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
  items: Array<String>,
  activeIndex: Number,
};

class Tabs extends Component<Props> {
  render() {
    const { classes, items, activeIndex } = this.props;
    return (
      <div className={classes.root}>
        {items &&
          items.map((item, index) => (
            <Typography
              key={generate()}
              className={cx(
                index === activeIndex ? classes.active : classes.classes,
                classes.tabItem
              )}
            >
              {item}
            </Typography>
          ))}
      </div>
    );
  }
}

export default withStyles(styles)(Tabs);
