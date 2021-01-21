import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clipboard } from 'electron';
import { RootState } from '../store/reducers';
import { closeContextMenu, openContextMenu } from '../store/actions/contextMenu';
import { addLayerTweenEvent, removeLayers, selectLayers, selectAllLayers, copyLayersThunk, pasteLayersThunk, sendLayersBackward, bringLayersForward, groupLayersThunk, ungroupLayers, removeLayerTweenEvent, duplicateLayers, setLayerHover, toggleSelectedMaskThunk, toggleSelectionIgnoreUnderlyingMask, replaceSelectedImagesThunk } from '../store/actions/layer';
import { removeArtboardPreset } from '../store/actions/documentSettings';
import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { canGroupSelected, canUngroupSelected, canToggleSelectedUseAsMask, canBringSelectedForward, canSendSelectedBackward, selectedIgnoreUnderlyingMaskEnabled, selectedUseAsMaskEnabled, canToggleSelectedIgnoreUnderlyingMask, canReplaceSelectedImages } from '../store/selectors/layer';
import { setEventDrawerEventHoverThunk, setEventDrawerEventThunk } from '../store/actions/eventDrawer';
import { setEditing } from '../store/actions/leftSidebar';
import { APP_NAME, DEFAULT_TWEEN_EVENTS } from '../constants';
import ContextMenu from './ContextMenu';

const ContextMenuWrapLayerEdit = (): ReactElement => {
  const contextMenu = useSelector((state: RootState) => state.contextMenu);
  const artboards = useSelector((state: RootState) => ({
    allIds: state.layer.present.allArtboardIds,
    byId: state.layer.present.allArtboardIds.reduce((result, current) => ({
      ...result,
      [current]: state.layer.present.byId[current]
    }), {})
  })) as { allIds: string[]; byId: { [id: string]: Btwx.Artboard } };
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const layerItem = useSelector((state: RootState) => Object.prototype.hasOwnProperty.call(state.layer.present.byId, state.contextMenu.id) && state.contextMenu.id !== 'root' ? state.layer.present.byId[state.contextMenu.id] : null);
  const tweenEventLayerScope = layerItem ? layerItem.scope : null;
  const canAddTweenEvent = useSelector((state: RootState) => layerItem && (state.layer.present.selected.length === 0 || (state.layer.present.selected.length === 1 && state.layer.present.selected[0] === state.contextMenu.id)) && (tweenEventLayerScope.some(id => state.layer.present.allArtboardIds.includes(id)) || state.layer.present.allArtboardIds.includes(state.contextMenu.id)));
  const canSelectAll = useSelector((state: RootState) => state.layer.present.allIds.length > 1);
  const canMoveBackward = useSelector((state: RootState) => canSendSelectedBackward(state));
  const canMoveForward = useSelector((state: RootState) => canBringSelectedForward(state));
  const canGroup = useSelector((state: RootState) => canGroupSelected(state));
  const canUngroup = useSelector((state: RootState) => canUngroupSelected(state));
  const canMask = useSelector((state: RootState) => canToggleSelectedUseAsMask(state));
  const useAsMaskChecked = useSelector((state: RootState) => selectedUseAsMaskEnabled(state));
  const canIgnoreUnderlyingMask = useSelector((state: RootState) => canToggleSelectedIgnoreUnderlyingMask(state));
  const ignoreUnderlyingMaskChecked = useSelector((state: RootState) => selectedIgnoreUnderlyingMaskEnabled(state));
  const canDuplicate = selected.length > 0 || layerItem !== null;
  const canRename = selected.length === 1;
  const canReplaceImage = useSelector((state: RootState) => canReplaceSelectedImages(state));
  const hasArtboardParent = useSelector((state: RootState) => layerItem ? tweenEventLayerScope[1] && state.layer.present.byId[tweenEventLayerScope[1]].type === 'Artboard' : false);
  const isArtboard = layerItem ? layerItem.type === 'Artboard' : false;
  const artboardParent = isArtboard ? layerItem.id : hasArtboardParent ? tweenEventLayerScope[1] : null;
  const tweenEvents = useSelector((state: RootState) => layerItem && canAddTweenEvent ? state.layer.present.events.allIds.filter((id) => state.layer.present.events.byId[id].layer === state.contextMenu.id && state.layer.present.events.byId[id].artboard === artboardParent) : null);
  const tweenEventItems = useSelector((state: RootState) => tweenEvents ? tweenEvents.reduce((result, current) => {
    result = [...result, state.layer.present.events.byId[current]];
    return result;
   }, []) : null);
  const clipboardType: Btwx.ClipboardType = ((): Btwx.ClipboardType => {
    try {
      const text = clipboard.readText();
      const parsedText: Btwx.ClipboardLayers = JSON.parse(text);
      return parsedText.type ? parsedText.type : null;
    } catch (error) {
      return null;
    }
  })();
  const dispatch = useDispatch();

  const options = [{
    label: 'Add Event Listener...',
    visible: contextMenu.id && contextMenu.id !== 'root',
    enabled: canAddTweenEvent,
    submenu: [...DEFAULT_TWEEN_EVENTS.reduce((eventResult, eventCurrent) => {
      const isDisabled = tweenEventItems && tweenEventItems.some((tweenEvent) => tweenEvent.layer === contextMenu.id && tweenEvent.event === eventCurrent.event);
      return [
        ...eventResult,
        {
          label: `On ${eventCurrent.titleCase}...`,
          enabled: !isDisabled,
          submenu: [...artboards.allIds.reduce((destinationResult, destinationCurrent) => {
            const artboardItem = artboards.byId[destinationCurrent];
            const disabled = tweenEventItems && tweenEventItems.some((tweenEvent) => tweenEvent.layer === contextMenu.id && tweenEvent.event === eventCurrent.event && tweenEvent.destinationArtboard === artboardItem.id );
            if (artboardItem.id !== artboardParent && artboardItem.id !== contextMenu.id) {
              destinationResult = [
                ...destinationResult,
                {
                  label: `Go to ${artboardItem.name}`,
                  enabled: !disabled,
                  click: (): void => {
                    dispatch(addLayerTweenEvent({
                      name: 'Tween Event',
                      artboard: artboardParent,
                      destinationArtboard: artboardItem.id,
                      event: eventCurrent.event,
                      layer: contextMenu.id,
                      tweens: []
                    }));
                    dispatch(closeContextMenu());
                  }
                }
              ]
            }
            return destinationResult;
          }, [])]
        }
      ]
    }, [])]
  },{
    type: 'separator',
    visible: contextMenu.id && contextMenu.id !== 'root'
  },{
    label: 'Select',
    visible: contextMenu.id && contextMenu.id !== 'root',
    click: (): void => {
      dispatch(selectLayers({layers: [contextMenu.id], newSelection: true}));
    }
  },{
    label: 'Select All',
    enabled: canSelectAll,
    visible: contextMenu.id && contextMenu.id === 'root',
    accelerator: process.platform === 'darwin' ? 'Cmd+A' : 'Ctrl+A',
    click: (): void => {
      dispatch(selectAllLayers());
    }
  },{
    label: 'Copy',
    visible: contextMenu.id && contextMenu.id !== 'root',
    accelerator: process.platform === 'darwin' ? 'Cmd+C' : 'Ctrl+C',
    click: (): void => {
      dispatch(copyLayersThunk());
    }
  },{
    label: 'Paste Here',
    visible: contextMenu.data && contextMenu.data.origin && contextMenu.data.origin !== 'sidebar',
    enabled: clipboardType,
    click: (): void => {
      dispatch(pasteLayersThunk({overPoint: { x: contextMenu.paperX, y: contextMenu.paperY }, overLayer: contextMenu.id}));
    }
  },{
    label: 'Paste Over',
    visible: contextMenu.id && contextMenu.id !== 'root',
    enabled: clipboardType,
    click: (): void => {
      if (selected.length > 0) {
        if (selected.length === 1) {
          dispatch(pasteLayersThunk({overLayer: selected[0]}));
        } else {
          dispatch(pasteLayersThunk({overSelection: true}));
        }
      } else {
        dispatch(pasteLayersThunk({overLayer: contextMenu.id}));
      }
    }
  },{
    label: 'Duplicate',
    visible: contextMenu.id && contextMenu.id !== 'root',
    enabled: canDuplicate,
    accelerator: process.platform === 'darwin' ? 'Cmd+D' : 'Ctrl+D',
    click: (): void => {
      if (selected.length > 0) {
        dispatch(duplicateLayers({layers: selected}));
      } else {
        dispatch(duplicateLayers({layers: [contextMenu.id]}));
      }
    }
  },{
    type: 'separator',
    visible: contextMenu.id && contextMenu.id !== 'root'
  },{
    label: 'Delete',
    visible: contextMenu.id && contextMenu.id !== 'root',
    accelerator: 'Backspace',
    click: (): void => {
      if (selected.length > 0) {
        dispatch(removeLayers({layers: selected}));
      } else {
        dispatch(removeLayers({layers: [contextMenu.id]}));
      }
    }
  },{
    type: 'separator',
    visible: contextMenu.id && contextMenu.id !== 'root'
  },{
    label: 'Bring Forward',
    visible: contextMenu.id && contextMenu.id !== 'root',
    enabled: canMoveForward,
    accelerator: process.platform === 'darwin' ? 'Cmd+]' : 'Ctrl+]',
    click: (): void => {
      if (selected.length > 0) {
        dispatch(bringLayersForward({layers: selected}));
      } else {
        dispatch(bringLayersForward({layers: [contextMenu.id]}));
      }
    }
  },{
    label: 'Send Backward',
    visible: contextMenu.id && contextMenu.id !== 'root',
    enabled: canMoveBackward,
    accelerator: process.platform === 'darwin' ? 'Cmd+[' : 'Ctrl+[',
    click: (): void => {
      if (selected.length > 0) {
        dispatch(sendLayersBackward({layers: selected}));
      } else {
        dispatch(sendLayersBackward({layers: [contextMenu.id]}));
      }
    }
  },{
    type: 'separator',
    visible: contextMenu.id && contextMenu.id !== 'root'
  },{
    label: 'Group',
    visible: contextMenu.id && contextMenu.id !== 'root',
    enabled: canGroup,
    accelerator: process.platform === 'darwin' ? 'Cmd+G' : 'Ctrl+G',
    click: (): void => {
      if (selected.length > 0) {
        dispatch(groupLayersThunk({layers: selected}));
      } else {
        dispatch(groupLayersThunk({layers: [contextMenu.id]}));
      }
    }
  },{
    label: 'Ungroup',
    visible: contextMenu.id && contextMenu.id !== 'root',
    enabled: canUngroup,
    accelerator: process.platform === 'darwin' ? 'Cmd+Shift+G' : 'Ctrl+Shift+G',
    click: (): void => {
      if (selected.length > 0) {
        dispatch(ungroupLayers({layers: selected}));
      } else {
        dispatch(ungroupLayers({layers: [contextMenu.id]}));
      }
    }
  },{
    label: 'Rename Layer',
    visible: contextMenu.id && contextMenu.id !== 'root',
    enabled: canRename,
    accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
    click: (): void => {
      dispatch(setEditing({editing: selected[0]}));
    }
  },{
    type: 'separator',
    visible: contextMenu.id && contextMenu.id !== 'root'
  },{
    label: 'Mask',
    visible: contextMenu.id && contextMenu.id !== 'root',
    enabled: canMask,
    type: 'checkbox',
    checked: useAsMaskChecked,
    click: (): void => {
      dispatch(toggleSelectedMaskThunk());
    }
  },{
    label: 'Ignore Underlying Mask',
    visible: contextMenu.id && contextMenu.id !== 'root',
    enabled: canIgnoreUnderlyingMask,
    type: 'checkbox',
    checked: ignoreUnderlyingMaskChecked,
    click: (): void => {
      dispatch(toggleSelectionIgnoreUnderlyingMask());
    }
  },{
    type: 'separator',
    visible: canReplaceImage
  },{
    label: 'Replace Image...',
    visible: canReplaceImage,
    click: (): void => {
      dispatch(replaceSelectedImagesThunk());
    }
  }] as any[];

  return (
    <ContextMenu
      options={options} />
  );
}

export default ContextMenuWrapLayerEdit;