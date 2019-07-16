// @flow

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import CheckIcon from 'images/sprite/green_checkmark.svg';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '18px 2px 18px 18px',
    cursor: 'pointer',
  },
  rootHover: {
    '&:hover': {
      backgroundColor: '#eaf1f7',
    },
  },
  noPadding: {
    padding: 0,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  businessAvatar: {
    width: 50,
    height: 50,
    fontWeight: 600,
    fontSize: 18,
    border: 0,
    paddingTop: 3,
    paddingLeft: 1,
    margin: '0 auto',
    backgroundColor: '#c415d9',
  },
  smallAvatar: {
    width: 40,
    height: 40,
  },
  location: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0.3,
    color: '#9b9b9b',
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: '#4a4a4a',
  },
  icon: {
    position: 'absolute',
    right: 18,
    top: 18,
  },
});

type Props = {
  business: Object,
  classes: Object,
  selected: boolean,
  onSelect: Function,
};

class BusinessCard extends Component<Props> {
  handleClick = () => {
    const { business, selected } = this.props;
    if (!selected) {
      this.props.onSelect(business);
    }
  };
  render() {
    const { business, selected, classes } = this.props;
    return (
      <ListItem className={classes.root} onClick={this.handleClick}>
        <UserAvatar
          className={
            business.get('name') ? classes.businessAvatar : classes.avatar
          }
          content={business.get('name')}
        />
        <ListItemText
          primary={business.get('category')}
          secondary={business.get('name')}
          classes={{
            primary: classes.location,
            secondary: classes.name,
          }}
        />
        {selected && (
          <Icon glyph={CheckIcon} size={20} className={classes.icon} />
        )}
      </ListItem>
    );
  }
}

export default withStyles(styles)(BusinessCard);
