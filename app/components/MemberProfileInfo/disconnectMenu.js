// @flow

import React from 'react';
import { capitalize } from 'lodash-es';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

type Props = { classes: Object, onClick: () => void, member: Object };

export function DisconnectMenu(props: Props) {
  return (
    <MenuItem className={props.classes.menuItem} onClick={props.onClick}>
      <ListItemText
        classes={{ primary: props.classes.menuItemText }}
        primary={`Disconnect from ${capitalize(props.member.get('firstName'))}`}
      />
    </MenuItem>
  );
}
