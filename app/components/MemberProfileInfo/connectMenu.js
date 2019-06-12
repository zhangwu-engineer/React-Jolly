// @flow

import React from 'react';
import { capitalize } from 'lodash-es';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

type Props = { classes: Object, onClick: Function, member: Object };

export function ConnectMenu(props: Props) {
  return (
    <MenuItem className={props.classes.menuItem} onClick={props.onClick}>
      <ListItemText
        classes={{ primary: props.classes.menuItemText }}
        primary={`Connect with ${capitalize(props.member.get('firstName'))}`}
      />
    </MenuItem>
  );
}
