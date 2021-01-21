import { remote } from 'electron';
import React, { useEffect, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { closeContextMenu } from '../store/actions/contextMenu';

interface ContextMenuProps {
  options: Electron.MenuItem[];
  onClose?(): void;
}

const ContextMenu = (props: ContextMenuProps): ReactElement => {
  const { options, onClose } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    const menu = remote.Menu.buildFromTemplate(options);
    menu.popup({
      callback: () => {
        dispatch(closeContextMenu());
        if (onClose) {
          onClose();
        }
      }
    });
  }, []);

  return (
    <></>
  );
}

export default ContextMenu;