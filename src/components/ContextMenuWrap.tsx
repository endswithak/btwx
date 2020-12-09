import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { clipboard } from 'electron';
import { RootState } from '../store/reducers';
import { ContextMenuState } from '../store/reducers/contextMenu';
import { ContextMenuTypes, OpenContextMenuPayload } from '../store/actionTypes/contextMenu';
import { closeContextMenu, openContextMenu } from '../store/actions/contextMenu';
import { AddLayerTweenEventPayload, LayerTypes, RemoveLayersPayload, SelectLayersPayload, SendLayersBackwardPayload, BringLayersForwardPayload, GroupLayersPayload, UngroupLayersPayload, AddLayersMaskPayload, RemoveLayerTweenEventPayload, DuplicateLayersPayload, SetLayerHoverPayload } from '../store/actionTypes/layer';
import { addLayerTweenEvent, removeLayers, selectLayers, selectAllLayers, copyLayersThunk, pasteLayersThunk, sendLayersBackward, bringLayersForward, groupLayersThunk, ungroupLayers, removeLayerTweenEvent, duplicateLayers, setLayerHover, toggleSelectedMaskThunk, toggleSelectionIgnoreUnderlyingMask, replaceSelectedImagesThunk } from '../store/actions/layer';
import { RemoveArtboardPresetPayload, DocumentSettingsTypes } from '../store/actionTypes/documentSettings';
import { removeArtboardPreset } from '../store/actions/documentSettings';
import { ArtboardPresetEditorTypes } from '../store/actionTypes/artboardPresetEditor';
import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { canGroupSelected, canUngroupSelected, canToggleSelectedUseAsMask, canBringSelectedForward, canSendSelectedBackward, selectedIgnoreUnderlyingMaskEnabled, selectedUseAsMaskEnabled, canToggleSelectedIgnoreUnderlyingMask, canReplaceSelectedImages } from '../store/selectors/layer';
import { setTweenDrawerEventHoverThunk, setTweenDrawerEventThunk } from '../store/actions/tweenDrawer';
import { SetTweenDrawerEventHoverPayload, SetTweenDrawerEventPayload, TweenDrawerTypes } from '../store/actionTypes/tweenDrawer';
import { APP_NAME, DEFAULT_TWEEN_EVENTS } from '../constants';
import ContextMenu from './ContextMenu';

interface ContextMenuWrapProps {
  canDuplicate?: boolean;
  canSetTweenDrawerEventHover?: boolean;
  contextMenu?: ContextMenuState;
  activeArtboard?: string;
  artboards?: {
    allIds: string[];
    byId: {
      [id: string]: Btwx.Artboard;
    };
  };
  artboardParent?: string;
  selected?: string[];
  canAddTweenEvent?: boolean;
  tweenEventItems?: Btwx.TweenEvent[];
  currentX?: number;
  currentY?: number;
  clipboardType?: Btwx.ClipboardType;
  canMoveForward?: boolean;
  canMoveBackward?: boolean;
  canGroup?: boolean;
  canUngroup?: boolean;
  canMask?: boolean;
  canSelectAll?: boolean;
  useAsMaskChecked?: boolean;
  ignoreUnderlyingMaskChecked?: boolean;
  canIgnoreUnderlyingMask?: boolean;
  canReplaceImage?: boolean;
  closeContextMenu?(): ContextMenuTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
  addLayerTweenEvent?(payload: AddLayerTweenEventPayload): LayerTypes;
  removeArtboardPreset?(payload: RemoveArtboardPresetPayload): DocumentSettingsTypes;
  openArtboardPresetEditor?(payload: Btwx.ArtboardPreset): ArtboardPresetEditorTypes;
  removeLayers?(payload: RemoveLayersPayload): LayerTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
  selectAllLayers?(): LayerTypes;
  sendLayersBackward?(payload: SendLayersBackwardPayload): LayerTypes;
  bringLayersForward?(payload: BringLayersForwardPayload): LayerTypes;
  ungroupLayers?(payload: UngroupLayersPayload): LayerTypes;
  groupLayersThunk?(payload: GroupLayersPayload): Promise<any>;
  copyLayersThunk?(): Promise<any>;
  pasteLayersThunk?({overSelection, overPoint, overLayer}: { overSelection?: boolean; overPoint?: Btwx.Point; overLayer?: string }): Promise<any>;
  setTweenDrawerEventHoverThunk?(payload: SetTweenDrawerEventHoverPayload): TweenDrawerTypes;
  setTweenDrawerEventThunk?(payload: SetTweenDrawerEventPayload): void;
  removeLayerTweenEvent?(payload: RemoveLayerTweenEventPayload): LayerTypes;
  duplicateLayers?(payload: DuplicateLayersPayload): LayerTypes;
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  toggleSelectedMaskThunk?(): void;
  toggleSelectionIgnoreUnderlyingMask?(): void;
  replaceSelectedImagesThunk?(): void;
}

const ContextMenuWrap = (props: ContextMenuWrapProps): ReactElement => {
  const { canSelectAll, canReplaceImage, artboardParent, setLayerHover, duplicateLayers, canDuplicate, setTweenDrawerEventThunk, removeLayerTweenEvent, canSetTweenDrawerEventHover, setTweenDrawerEventHoverThunk, clipboardType, canMask, canGroup, canUngroup, ungroupLayers, groupLayersThunk, canMoveForward, canMoveBackward, contextMenu, closeContextMenu, currentX, currentY, openContextMenu, canAddTweenEvent, artboards, tweenEventItems, selected, addLayerTweenEvent, selectAllLayers, removeArtboardPreset, openArtboardPresetEditor, removeLayers, selectLayers, copyLayersThunk, pasteLayersThunk, sendLayersBackward, bringLayersForward, useAsMaskChecked, ignoreUnderlyingMaskChecked, toggleSelectedMaskThunk, toggleSelectionIgnoreUnderlyingMask, canIgnoreUnderlyingMask, replaceSelectedImagesThunk } = props;

  const getOptions = () => {
    switch(contextMenu.type) {
      case 'LayerEdit': {
        return [{
          type: 'MenuItem',
          text: 'Add Event...',
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
            selectLayers({layers: [contextMenu.id], newSelection: true});
          }
        },{
          type: 'MenuItem',
          text: 'Select All',
          disabled: !canSelectAll,
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
                pasteLayersThunk({overLayer: selected[0]} as any).then(() => {
                  closeContextMenu();
                });
              } else {
                pasteLayersThunk({overSelection: true} as any).then(() => {
                  closeContextMenu();
                });
              }
            } else {
              pasteLayersThunk({overLayer: contextMenu.id} as any).then(() => {
                closeContextMenu();
              });
            }
          }
        },{
          type: 'MenuItem',
          text: 'Duplicate',
          hidden: contextMenu.id && contextMenu.id === 'page',
          disabled: !canDuplicate,
          onClick: (): void => {
            closeContextMenu();
            if (selected.length > 0) {
              duplicateLayers({layers: selected});
            } else {
              duplicateLayers({layers: [contextMenu.id]});
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
              bringLayersForward({layers: selected});
            } else {
              bringLayersForward({layers: [contextMenu.id]});
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
              groupLayersThunk({layers: selected}).then(() => {
                closeContextMenu();
              });
            } else {
              groupLayersThunk({layers: [contextMenu.id]}).then(() => {
                closeContextMenu();
              });
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
          checked: useAsMaskChecked,
          onClick: (): void => {
            toggleSelectedMaskThunk();
            closeContextMenu();
          }
        },{
          type: 'MenuItem',
          text: 'Ignore Underlying Mask',
          hidden: contextMenu.id && contextMenu.id === 'page',
          disabled: !canIgnoreUnderlyingMask,
          checked: ignoreUnderlyingMaskChecked,
          onClick: (): void => {
            toggleSelectionIgnoreUnderlyingMask();
            closeContextMenu();
          }
        },{
          type: 'MenuDivider',
          hidden: !canReplaceImage
        },{
          type: 'MenuItem',
          text: 'Replace Image...',
          hidden: !canReplaceImage,
          onClick: (): void => {
            replaceSelectedImagesThunk();
            closeContextMenu();
          }
        }]
      }
      case 'TweenEvent': {
        return [{
          type: 'MenuHead',
          text: 'On Event:',
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
        }, ...DEFAULT_TWEEN_EVENTS.reduce((result, current) => {
          const isDisabled = tweenEventItems && tweenEventItems.some((tweenEvent) => tweenEvent.layer === contextMenu.id && tweenEvent.event === current.event);
          const eventItem = tweenEventItems && tweenEventItems.find((tweenEvent) => tweenEvent.layer === contextMenu.id && tweenEvent.event === current.event);
          result = [
            ...result,
            {
              type: 'MenuItem',
              text: current.titleCase,
              disabled: isDisabled,
              onMouseEnter(): void {
                if (eventItem && canSetTweenDrawerEventHover) {
                  setTweenDrawerEventHoverThunk({id: eventItem.id});
                }
              },
              onMouseLeave(): void {
                if (eventItem && canSetTweenDrawerEventHover) {
                  setTweenDrawerEventHoverThunk({id: null});
                }
              },
              onClick(): void {
                closeContextMenu();
                openContextMenu({
                  ...contextMenu,
                  x: currentX,
                  y: currentY,
                  type: 'TweenEventDestination',
                  data: {
                    tweenEvent: current.event
                  }
                });
              }
            }
          ]
          return result;
        }, [])];
      }
      case 'TweenEventDestination': {
        const tweenDestinations = artboards.allIds.reduce((result, current) => {
          const artboardItem = artboards.byId[current];
          const disabled = tweenEventItems && tweenEventItems.some((tweenEvent) => tweenEvent.layer === contextMenu.id && tweenEvent.event === contextMenu.data.tweenEvent && tweenEvent.destinationArtboard === artboardItem.id );
          if (artboardItem.id !== artboardParent && artboardItem.id !== contextMenu.id) {
            result = [
              ...result,
              {
                type: 'MenuItem',
                text: artboardItem.name,
                disabled: disabled,
                onMouseEnter(): void {
                  setLayerHover({id: artboardItem.id});
                },
                onMouseLeave(): void {
                  setLayerHover({id: null});
                },
                onClick: (): void => {
                  addLayerTweenEvent({
                    name: `Tween Event`,
                    artboard: artboardParent,
                    destinationArtboard: artboardItem.id,
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
          text: `On ${DEFAULT_TWEEN_EVENTS.find((event) => event.event === contextMenu.data.tweenEvent).titleCase}, Go To:`,
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
      case 'TweenDrawerEvent': {
        return [{
          type: 'MenuItem',
          text: 'Edit',
          onClick: (): void => {
            closeContextMenu();
            setTweenDrawerEventThunk({id: contextMenu.id});
          }
        },{
          type: 'MenuItem',
          text: 'Remove',
          onClick: (): void => {
            closeContextMenu();
            removeLayerTweenEvent({id: contextMenu.id});
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
        return 'Two or more artboards are required to create an event.';
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
  const { contextMenu, layer, tweenDrawer, viewSettings } = state;
  const activeArtboard = layer.present.activeArtboard;
  const artboards = {
    allIds: layer.present.allArtboardIds,
    byId: layer.present.allArtboardIds.reduce((result, current) => {
      result = {
        ...result,
        [current]: layer.present.byId[current]
      }
      return result;
    }, {})
  }
  const selected = layer.present.selected;
  const canSetTweenDrawerEventHover = viewSettings.tweenDrawer.isOpen && !tweenDrawer.event;
  const layerItem = Object.prototype.hasOwnProperty.call(layer.present.byId, contextMenu.id) && contextMenu.id !== 'page' ? layer.present.byId[contextMenu.id] : null;
  const tweenEventLayerScope = layerItem ? layerItem.scope : null;
  const hasArtboardParent = layerItem ? tweenEventLayerScope[1] && layer.present.byId[tweenEventLayerScope[1]].type === 'Artboard' : false;
  const isArtboard = layerItem ? layerItem.type === 'Artboard' : false;
  const artboardParent = isArtboard ? layerItem.id : hasArtboardParent ? tweenEventLayerScope[1] : null;
  const canAddTweenEvent = layerItem && (selected.length === 0 || (selected.length === 1 && selected[0] === contextMenu.id)) && (tweenEventLayerScope.some(id => layer.present.allArtboardIds.includes(id)) || layer.present.allArtboardIds.includes(contextMenu.id));
  const tweenEvents = layerItem && canAddTweenEvent ? layer.present.events.allIds.filter((id) => layer.present.events.byId[id].layer === contextMenu.id && layer.present.events.byId[id].artboard === artboardParent) : null;
  const tweenEventItems = tweenEvents ? tweenEvents.reduce((result, current) => {
    result = [...result, layer.present.events.byId[current]];
    return result;
   }, []) : null;
  const currentY = contextMenu.y && document.getElementById('context-menu') ? document.getElementById('context-menu').offsetTop : contextMenu.y;
  const currentX = contextMenu.x && document.getElementById('context-menu') ? document.getElementById('context-menu').offsetLeft : contextMenu.x;
  const canSelectAll = layer.present.allIds.length > 1;
  const canMoveBackward = canSendSelectedBackward(state);
  const canMoveForward = canBringSelectedForward(state);
  const canGroup = canGroupSelected(state);
  const canUngroup = canUngroupSelected(state);
  const canMask = canToggleSelectedUseAsMask(state);
  const useAsMaskChecked = selectedUseAsMaskEnabled(state);
  const canIgnoreUnderlyingMask = canToggleSelectedIgnoreUnderlyingMask(state);
  const ignoreUnderlyingMaskChecked = selectedIgnoreUnderlyingMaskEnabled(state);
  const canDuplicate = selected.length > 0 || layerItem !== null;
  const canReplaceImage = canReplaceSelectedImages(state);
  const clipboardType: Btwx.ClipboardType = ((): Btwx.ClipboardType => {
    try {
      const text = clipboard.readText();
      const parsedText: Btwx.ClipboardLayers = JSON.parse(text);
      return parsedText.type ? parsedText.type : null;
    } catch (error) {
      return null;
    }
  })();
  return {
    canSelectAll,
    canDuplicate,
    canSetTweenDrawerEventHover,
    contextMenu,
    canGroup,
    canMask,
    canUngroup,
    activeArtboard,
    artboardParent,
    artboards,
    selected,
    canAddTweenEvent,
    tweenEventItems,
    currentY,
    currentX,
    clipboardType,
    canMoveBackward,
    canMoveForward,
    useAsMaskChecked,
    ignoreUnderlyingMaskChecked,
    canIgnoreUnderlyingMask,
    canReplaceImage
  };
};

const mapDispatchToProps = {
  setLayerHover,
  duplicateLayers,
  setTweenDrawerEventThunk,
  removeLayerTweenEvent,
  setTweenDrawerEventHoverThunk,
  openContextMenu,
  closeContextMenu,
  addLayerTweenEvent,
  removeArtboardPreset,
  openArtboardPresetEditor,
  removeLayers,
  selectLayers,
  copyLayersThunk,
  pasteLayersThunk,
  sendLayersBackward,
  bringLayersForward,
  ungroupLayers,
  selectAllLayers,
  groupLayersThunk,
  toggleSelectedMaskThunk,
  toggleSelectionIgnoreUnderlyingMask,
  replaceSelectedImagesThunk
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContextMenuWrap);