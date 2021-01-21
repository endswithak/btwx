import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { removeArtboardPreset } from '../store/actions/documentSettings';
import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import ContextMenu from './ContextMenu';

const ContextMenuArtboardCustomPreset = (): ReactElement => {
  const contextMenu = useSelector((state: RootState) => state.contextMenu);
  const dispatch = useDispatch();

  const options = [{
    label: 'Edit',
    click: (): void => {
      dispatch(openArtboardPresetEditor({
        id: contextMenu.id,
        category: 'Custom',
        type: contextMenu.data.type,
        width: contextMenu.data.width,
        height: contextMenu.data.width
      }));
    }
  },{
    label: 'Remove',
    click: (): void => {
      dispatch(removeArtboardPreset({id: contextMenu.id}));
    }
  }] as any[];

  return (
    <ContextMenu
      options={options} />
  );
}

export default ContextMenuArtboardCustomPreset;