import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ContextMenuState } from '../store/reducers/contextMenu';
import ContextMenu from './ContextMenu';
import { ContextMenuTypes, OpenContextMenuPayload } from '../store/actionTypes/contextMenu';
import { closeContextMenu, openContextMenu } from '../store/actions/contextMenu';
import { AddLayerTweenEventPayload, LayerTypes, CopyLayersToClipboardPayload, PasteLayersFromClipboardPayload, RemoveLayersPayload, SelectLayerPayload } from '../store/actionTypes/layer';
import { addLayerTweenEvent, copyLayersToClipboard, pasteLayersFromClipboard, removeLayers, selectLayer } from '../store/actions/layer';
import { RemoveArtboardPresetPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { removeArtboardPreset } from '../store/actions/canvasSettings';
import { ArtboardPresetEditorTypes } from '../store/actionTypes/artboardPresetEditor';
import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { getLayerScope } from '../store/selectors/layer';

interface ContextMenuWrapProps {
  contextMenu?: ContextMenuState;
  activeArtboard?: string;
  artboards?: em.Artboard[];
  selected?: string[];
  clipboard?: string[];
  canAddTweenEvent?: boolean;
  tweenEventItems?: em.TweenEvent[];
  currentX?: number;
  currentY?: number;
  closeContextMenu?(): ContextMenuTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
  addLayerTweenEvent?(payload: AddLayerTweenEventPayload): LayerTypes;
  removeArtboardPreset?(payload: RemoveArtboardPresetPayload): CanvasSettingsTypes;
  openArtboardPresetEditor?(payload: em.ArtboardPreset): ArtboardPresetEditorTypes;
  copyLayersToClipboard?(payload: CopyLayersToClipboardPayload): LayerTypes;
  pasteLayersFromClipboard?(payload: PasteLayersFromClipboardPayload): LayerTypes;
  removeLayers?(payload: RemoveLayersPayload): LayerTypes;
  selectLayer?(payload: SelectLayerPayload): LayerTypes;
}

const ContextMenuWrap = (props: ContextMenuWrapProps): ReactElement => {
  const { contextMenu, closeContextMenu, currentX, currentY, openContextMenu, canAddTweenEvent, artboards, activeArtboard, tweenEventItems, selected, clipboard, addLayerTweenEvent, removeArtboardPreset, openArtboardPresetEditor, copyLayersToClipboard, pasteLayersFromClipboard, removeLayers, selectLayer } = props;

  const getOptions = () => {
    switch(contextMenu.type) {
      case 'LayerEdit': {
        return [{
          type: 'MenuItem',
          text: 'Add Tween Event',
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
          type: 'MenuItem',
          text: 'Select',
          onClick: (): void => {
            closeContextMenu();
            selectLayer({id: contextMenu.id, newSelection: true});
          }
        },{
          type: 'MenuItem',
          text: 'Copy',
          onClick: (): void => {
            closeContextMenu();
            if (selected.length > 0) {
              copyLayersToClipboard({layers: selected});
            } else {
              copyLayersToClipboard({layers: [contextMenu.id]});
            }
          }
        },{
          type: 'MenuItem',
          text: 'Paste',
          disabled: clipboard.length === 0,
          onClick: (): void => {
            closeContextMenu();
            pasteLayersFromClipboard({});
          }
        },{
          type: 'MenuItem',
          text: 'Paste Over Selection',
          disabled: clipboard.length === 0,
          onClick: (): void => {
            closeContextMenu();
            pasteLayersFromClipboard({overSelection: true});
          }
        },{
          type: 'MenuItem',
          text: 'Delete',
          onClick: (): void => {
            closeContextMenu();
            if (selected.length > 0) {
              removeLayers({layers: selected});
            } else {
              removeLayers({layers: [contextMenu.id]});
            }
          }
        }]
      }
      case 'TweenEvent': {
        return [{
          type: 'MenuHead',
          text: 'Add Tween Event'
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
          const disabled = tweenEventItems.some((tweenEvent) => tweenEvent.layer === contextMenu.id && tweenEvent.event === contextMenu.data.tweenEvent);
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
          text: 'Add Tween Destination'
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
        return 'Need two or more artboards to create tween event.';
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
      result = [
        ...result,
        {
          ...layer.present.byId[current]
        }
      ];
    }
    return result;
  }, []);
  const selected = layer.present.selected;
  const clipboard = layer.present.clipboard.allIds;
  const layerItem = contextMenu.id && layer.present.byId[contextMenu.id];
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
  return { contextMenu, activeArtboard, artboards, selected, clipboard, canAddTweenEvent, tweenEventItems, currentY, currentX };
};

export default connect(
  mapStateToProps,
  { openContextMenu, closeContextMenu, addLayerTweenEvent, removeArtboardPreset, openArtboardPresetEditor, copyLayersToClipboard, pasteLayersFromClipboard, removeLayers, selectLayer }
)(ContextMenuWrap);