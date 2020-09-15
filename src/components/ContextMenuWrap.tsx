import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { clipboard } from 'electron';
import { RootState } from '../store/reducers';
import { ContextMenuState } from '../store/reducers/contextMenu';
import { ContextMenuTypes, OpenContextMenuPayload } from '../store/actionTypes/contextMenu';
import { closeContextMenu, openContextMenu } from '../store/actions/contextMenu';
import { AddLayerTweenEventPayload, LayerTypes, RemoveLayersPayload, SelectLayerPayload, SendLayersBackwardPayload, SendLayersForwardPayload, GroupLayersPayload, UngroupLayersPayload, AddLayersMaskPayload } from '../store/actionTypes/layer';
import { addLayerTweenEvent, removeLayers, selectLayer, selectAllLayers, copyLayersThunk, pasteLayersThunk, sendLayersBackward, sendLayersForward, groupLayersThunk, ungroupLayers, addLayersMaskThunk } from '../store/actions/layer';
import { RemoveArtboardPresetPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { removeArtboardPreset } from '../store/actions/canvasSettings';
import { ArtboardPresetEditorTypes } from '../store/actionTypes/artboardPresetEditor';
import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { getLayerScope, orderLayersByDepth } from '../store/selectors/layer';
import { APP_NAME } from '../constants';
import ContextMenu from './ContextMenu';

interface ContextMenuWrapProps {
  contextMenu?: ContextMenuState;
  activeArtboard?: string;
  artboards?: em.Artboard[];
  selected?: string[];
  canAddTweenEvent?: boolean;
  tweenEventItems?: em.TweenEvent[];
  currentX?: number;
  currentY?: number;
  clipboardType?: em.ClipboardType;
  canMoveForward?: boolean;
  canMoveBackward?: boolean;
  canGroup?: boolean;
  canUngroup?: boolean;
  canMask?: boolean;
  closeContextMenu?(): ContextMenuTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
  addLayerTweenEvent?(payload: AddLayerTweenEventPayload): LayerTypes;
  removeArtboardPreset?(payload: RemoveArtboardPresetPayload): CanvasSettingsTypes;
  openArtboardPresetEditor?(payload: em.ArtboardPreset): ArtboardPresetEditorTypes;
  removeLayers?(payload: RemoveLayersPayload): LayerTypes;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
  selectAllLayers?(): LayerTypes;
  sendLayersBackward?(payload: SendLayersBackwardPayload): LayerTypes;
  sendLayersForward?(payload: SendLayersForwardPayload): LayerTypes;
  ungroupLayers?(payload: UngroupLayersPayload): LayerTypes;
  groupLayersThunk?(payload: GroupLayersPayload): Promise<any>;
  addLayersMaskThunk?(payload: AddLayersMaskPayload): Promise<any>;
  copyLayersThunk?(): Promise<any>;
  pasteLayersThunk?({overSelection, overPoint, overLayer}: { overSelection?: boolean; overPoint?: em.Point; overLayer?: string }): Promise<any>;
}

const ContextMenuWrap = (props: ContextMenuWrapProps): ReactElement => {
  const { clipboardType, canMask, addLayersMaskThunk, canGroup, canUngroup, ungroupLayers, groupLayersThunk, canMoveForward, canMoveBackward, contextMenu, closeContextMenu, currentX, currentY, openContextMenu, canAddTweenEvent, artboards, activeArtboard, tweenEventItems, selected, addLayerTweenEvent, selectAllLayers, removeArtboardPreset, openArtboardPresetEditor, removeLayers, selectLayer, copyLayersThunk, pasteLayersThunk, sendLayersBackward, sendLayersForward } = props;

  const getOptions = () => {
    switch(contextMenu.type) {
      case 'LayerEdit': {
        return [{
          type: 'MenuItem',
          text: 'Add Tween Event',
          hidden: contextMenu.id && contextMenu.id === 'page',
          disabled: !canAddTweenEvent,
          onClick: (): void => {
            closeContextMenu();
            openContextMenu({
              ...contextMenu,
              x: currentX,
              y: currentY,
              type: 'TweenEvent'
            });
          }
        },{
          type: 'MenuDivider',
          hidden: contextMenu.id && contextMenu.id === 'page'
        },{
          type: 'MenuItem',
          text: 'Select',
          hidden: contextMenu.id && contextMenu.id === 'page',
          onClick: (): void => {
            closeContextMenu();
            selectLayer({id: contextMenu.id, newSelection: true});
          }
        },{
          type: 'MenuItem',
          text: 'Select All',
          hidden: contextMenu.id && contextMenu.id !== 'page',
          onClick: (): void => {
            closeContextMenu();
            selectAllLayers();
          }
        },{
          type: 'MenuItem',
          text: 'Copy',
          hidden: contextMenu.id && contextMenu.id === 'page',
          onClick: (): void => {
            closeContextMenu();
            copyLayersThunk();
          }
        },{
          type: 'MenuItem',
          text: 'Paste Here',
          hidden: contextMenu.data && contextMenu.data.origin && contextMenu.data.origin === 'sidebar',
          disabled: !clipboardType,
          onClick: (): void => {
            pasteLayersThunk({overPoint: { x: contextMenu.paperX, y: contextMenu.paperY }, overLayer: contextMenu.id} as any).then(() => {
              closeContextMenu();
            });
          }
        },{
          type: 'MenuItem',
          text: 'Paste Over',
          hidden: contextMenu.id && contextMenu.id === 'page',
          disabled: !clipboardType,
          onClick: (): void => {
            if (selected.length > 0) {
              if (selected.length === 1) {
                pasteLayersThunk({overLayer: selected[0]} as any).then(() => { closeContextMenu() });
              } else {
                pasteLayersThunk({overSelection: true} as any).then(() => { closeContextMenu() });
              }
            } else {
              pasteLayersThunk({overLayer: contextMenu.id} as any).then(() => { closeContextMenu() });
            }
          }
        },{
          type: 'MenuDivider',
          hidden: contextMenu.id && contextMenu.id === 'page'
        },{
          type: 'MenuItem',
          text: 'Delete',
          hidden: contextMenu.id && contextMenu.id === 'page',
          onClick: (): void => {
            closeContextMenu();
            if (selected.length > 0) {
              removeLayers({layers: selected});
            } else {
              removeLayers({layers: [contextMenu.id]});
            }
          }
        },{
          type: 'MenuDivider',
          hidden: contextMenu.id && contextMenu.id === 'page'
        },{
          type: 'MenuItem',
          text: 'Move Forward',
          hidden: contextMenu.id && contextMenu.id === 'page',
          disabled: !canMoveForward,
          onClick: (): void => {
            closeContextMenu();
            if (selected.length > 0) {
              sendLayersForward({layers: selected});
            } else {
              sendLayersForward({layers: [contextMenu.id]});
            }
          }
        },{
          type: 'MenuItem',
          text: 'Move Backward',
          hidden: contextMenu.id && contextMenu.id === 'page',
          disabled: !canMoveBackward,
          onClick: (): void => {
            closeContextMenu();
            if (selected.length > 0) {
              sendLayersBackward({layers: selected});
            } else {
              sendLayersBackward({layers: [contextMenu.id]});
            }
          }
        },{
          type: 'MenuDivider',
          hidden: contextMenu.id && contextMenu.id === 'page'
        },{
          type: 'MenuItem',
          text: 'Group',
          hidden: contextMenu.id && contextMenu.id === 'page',
          disabled: !canGroup,
          onClick: (): void => {
            if (selected.length > 0) {
              groupLayersThunk({layers: selected}).then(() => { closeContextMenu(); });
            } else {
              groupLayersThunk({layers: [contextMenu.id]}).then(() => { closeContextMenu(); });
            }
          }
        },{
          type: 'MenuItem',
          text: 'Ungroup',
          hidden: contextMenu.id && contextMenu.id === 'page',
          disabled: !canUngroup,
          onClick: (): void => {
            closeContextMenu();
            if (selected.length > 0) {
              ungroupLayers({layers: selected});
            } else {
              ungroupLayers({layers: [contextMenu.id]});
            }
          }
        },{
          type: 'MenuDivider',
          hidden: contextMenu.id && contextMenu.id === 'page'
        },{
          type: 'MenuItem',
          text: 'Mask',
          hidden: contextMenu.id && contextMenu.id === 'page',
          disabled: !canMask,
          onClick: (): void => {
            if (selected.length > 0) {
              addLayersMaskThunk({layers: selected}).then(() => { closeContextMenu(); });
            } else {
              addLayersMaskThunk({layers: [contextMenu.id]}).then(() => { closeContextMenu(); });
            }
          }
        }]
      }
      case 'TweenEvent': {
        return [{
          type: 'MenuHead',
          text: 'Add Tween Event',
          backButton: true,
          backButtonClick: () => {
            closeContextMenu();
            openContextMenu({
              ...contextMenu,
              x: currentX,
              y: currentY,
              type: 'LayerEdit'
            });
          }
        },{
          type: 'MenuDivider'
        },{
          type: 'MenuItem',
          text: 'Click',
          onClick: (): void => {
            closeContextMenu();
            openContextMenu({
              ...contextMenu,
              x: currentX,
              y: currentY,
              type: 'TweenEventDestination',
              data: {
                tweenEvent: 'click'
              }
            });
          }
        },{
          type: 'MenuItem',
          text: 'Double Click',
          onClick: (): void => {
            closeContextMenu();
            openContextMenu({
              ...contextMenu,
              x: currentX,
              y: currentY,
              type: 'TweenEventDestination',
              data: {
                tweenEvent: 'doubleclick'
              }
            });
          }
        },{
          type: 'MenuItem',
          text: 'Mouse Enter',
          onClick: (): void => {
            closeContextMenu();
            openContextMenu({
              ...contextMenu,
              x: currentX,
              y: currentY,
              type: 'TweenEventDestination',
              data: {
                tweenEvent: 'mouseenter'
              }
            });
          }
        },{
          type: 'MenuItem',
          text: 'Mouse Leave',
          onClick: (): void => {
            closeContextMenu();
            openContextMenu({
              ...contextMenu,
              x: currentX,
              y: currentY,
              type: 'TweenEventDestination',
              data: {
                tweenEvent: 'mouseleave'
              }
            });
          }
        }]
      }
      case 'TweenEventDestination': {
        const tweenDestinations = artboards.reduce((result, current) => {
          const disabled = tweenEventItems && tweenEventItems.some((tweenEvent) => tweenEvent.layer === contextMenu.id && tweenEvent.event === contextMenu.data.tweenEvent);
          if (current.id !== activeArtboard) {
            result = [
              ...result,
              {
                type: 'MenuItem',
                text: current.name,
                disabled: disabled,
                onClick: (): void => {
                  addLayerTweenEvent({
                    name: `Tween Event`,
                    artboard: activeArtboard,
                    destinationArtboard: current.id,
                    event: contextMenu.data.tweenEvent,
                    layer: contextMenu.id,
                    tweens: []
                  });
                  closeContextMenu();
                }
              }
            ]
          }
          return result;
        }, []);
        return tweenDestinations.length > 0 ? [{
          type: 'MenuHead',
          text: 'Add Tween Destination',
          backButton: true,
          backButtonClick: () => {
            closeContextMenu();
            openContextMenu({
              ...contextMenu,
              x: currentX,
              y: currentY,
              type: 'TweenEvent'
            });
          }
        },{
          type: 'MenuDivider'
        }, ...tweenDestinations] : tweenDestinations;
      }
      case 'ArtboardCustomPreset': {
        return [{
          type: 'MenuItem',
          text: 'Edit',
          onClick: (): void => {
            closeContextMenu();
            openArtboardPresetEditor({
              id: contextMenu.id,
              category: 'Custom',
              type: contextMenu.data.type,
              width: contextMenu.data.width,
              height: contextMenu.data.width
            });
          }
        },{
          type: 'MenuItem',
          text: 'Remove',
          onClick: (): void => {
            closeContextMenu();
            removeArtboardPreset({id: contextMenu.id});
          }
        }]
      }
    }
  }

  const getEmptyState = () => {
    switch(contextMenu.type) {
      case 'TweenEvent': {
        return null;
      }
      case 'TweenEventDestination': {
        return `Need two or more artboards to create a ${APP_NAME} event.`;
      }
      case 'ArtboardCustomPreset': {
        return null;
      }
    }
  }

  return (
    contextMenu.isOpen
    ? <ContextMenu
        options={getOptions()}
        emptyState={getEmptyState()} />
    : null
  );
}

const mapStateToProps = (state: RootState) => {
  const { contextMenu, layer } = state;
  const activeArtboard = layer.present.activeArtboard;
  const artboards = layer.present.allArtboardIds.reduce((result, current) => {
    if (layer.present.byId[current]) {
      result = [...result, { ...layer.present.byId[current] }];
    }
    return result;
  }, []);
  const selected = layer.present.selected;
  const selectedById: {[id: string]: em.Page | em.Artboard | em.Group | em.Shape | em.Text} = selected.reduce((result, current) => {
    result = {
      ...result,
      [current]: layer.present.byId[current]
    }
    return result;
  }, {});
  const selectedByDepth = orderLayersByDepth(state.layer.present, selected);
  const layerItem = contextMenu.id && contextMenu.id !== 'page' ? layer.present.byId[contextMenu.id] : null;
  const isMask = layerItem ? layerItem.mask : null;
  const parent = layerItem ? state.layer.present.byId[layerItem.parent] : null;
  const inMaskedGroup = parent ? parent.type === 'Group' && (parent as em.Group).clipped : null;
  const isFirstMaskChild = inMaskedGroup && parent.children[1] === contextMenu.id;
  const tweenEventLayerScope = layerItem ? getLayerScope(layer.present, contextMenu.id) : null;
  const artboard = tweenEventLayerScope ? tweenEventLayerScope.find((id) => layer.present.allArtboardIds.includes(id)) : null;
  const canAddTweenEvent = layerItem && (selected.length === 0 || (selected.length === 1 && selected[0] === contextMenu.id)) && tweenEventLayerScope.some(id => layer.present.allArtboardIds.includes(id));
  const tweenEvents = layerItem && canAddTweenEvent ? layer.present.allTweenEventIds.filter((id) => layer.present.tweenEventById[id].layer === contextMenu.id && layer.present.tweenEventById[id].artboard === artboard) : null;
  const tweenEventItems = tweenEvents ? tweenEvents.reduce((result, current) => {
    result = [...result, layer.present.tweenEventById[current]];
    return result;
   }, []) : null;
  const currentY = contextMenu.y && document.getElementById('context-menu') ? document.getElementById('context-menu').offsetTop : contextMenu.y;
  const currentX = contextMenu.x && document.getElementById('context-menu') ? document.getElementById('context-menu').offsetLeft : contextMenu.x;
  const canMoveBackward = (selected.length > 0 && !layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    const parent = state.layer.present.byId[layer.parent];
    const inMaskedGroup = parent.type === 'Group' && (parent as em.Group).clipped;
    const isFirstMaskChild = inMaskedGroup && parent.children[1] === id;
    return parent.children[0] === id || isFirstMaskChild;
  })) || (selected.length === 0 && !((parent && parent.children[0] === contextMenu.id) || isFirstMaskChild));
  const canMoveForward = (selected.length > 0 && !layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    const parent = state.layer.present.byId[layer.parent];
    const isMask = layer.mask;
    return parent.children[parent.children.length - 1] === id || isMask;
  })) || (selected.length === 0 && !((parent && parent.children[parent.children.length - 1] === contextMenu.id) || isMask));
  const canGroup = (selected.length > 0 && !layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Artboard';
  })) || (selected.length === 0 && !(layerItem && layerItem.type === 'Artboard'));
  const canUngroup = (selected.length > 0 && layer.present.selected.some((id: string) => {
    const layer = state.layer.present.byId[id];
    return layer.type === 'Group';
  })) || (selected.length === 0 && layerItem && layerItem.type === 'Group');
  const canMask = (selected.length > 0 && selectedById[selectedByDepth[0]].type === 'Shape' && (selectedById[selectedByDepth[0]] as em.Shape).shapeType !== 'Line' && !(selectedById[selectedByDepth[0]] as em.Shape).mask) || (selected.length === 0 && layerItem && layerItem.type === 'Shape' && (layerItem as em.Shape).shapeType !== 'Line' && !(layerItem as em.Shape).mask);
  const clipboardType: em.ClipboardType = ((): em.ClipboardType => {
    try {
      const text = clipboard.readText();
      const parsedText: em.ClipboardLayers = JSON.parse(text);
      return parsedText.type ? parsedText.type : null;
    } catch (error) {
      return null;
    }
  })();
  return { contextMenu, canGroup, canMask, canUngroup, activeArtboard, artboards, selected, canAddTweenEvent, tweenEventItems, currentY, currentX, clipboardType, canMoveBackward, canMoveForward };
};

export default connect(
  mapStateToProps,
  { openContextMenu, closeContextMenu, addLayerTweenEvent, removeArtboardPreset, openArtboardPresetEditor, removeLayers, selectLayer, copyLayersThunk, pasteLayersThunk, sendLayersBackward, sendLayersForward, ungroupLayers, selectAllLayers, groupLayersThunk, addLayersMaskThunk }
)(ContextMenuWrap);