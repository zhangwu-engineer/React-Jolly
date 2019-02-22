// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Icon from 'components/Icon';
import CheckIcon from 'images/sprite/green_checkmark.svg';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    padding: '28px 25px 25px 26px',
    cursor: 'pointer',
  },
  position: {
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.4,
    color: '#313131',
  },
  icon: {
    position: 'absolute',
    right: 18,
    top: 18,
  },
});

type Props = {
  position: string,
  classes: Object,
  onSelect: Function,
  selected: boolean,
};

class PositionCard extends Component<Props> {
  handleClick = () => {
    const { position, selected } = this.props;
    if (!selected) {
      this.props.onSelect(position);
    }
  };
  render() {
    const { position, selected, classes } = this.props;
    return (
      <ListItem className={classes.root} onClick={this.handleClick}>
        <ListItemText
          primary={position}
          classes={{
            primary: classes.position,
          }}
        />
        {selected && (
          <Icon glyph={CheckIcon} size={20} className={classes.icon} />
        )}
      </ListItem>
    );
  }
}

export default withStyles(styles)(PositionCard);
