import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { ContextMenuState } from '../store/reducers/contextMenu';
import ContextMenu from './ContextMenu';
import { ContextMenuTypes, OpenContextMenuPayload } from '../store/actionTypes/contextMenu';
import { closeContextMenu, openContextMenu } from '../store/actions/contextMenu';
import { AddLayerTweenEventPayload, LayerTypes } from '../store/actionTypes/layer';
import { addLayerTweenEvent } from '../store/actions/layer';
import { RemoveArtboardPresetPayload, CanvasSettingsTypes } from '../store/actionTypes/canvasSettings';
import { removeArtboardPreset } from '../store/actions/canvasSettings';
import { ArtboardPresetEditorTypes } from '../store/actionTypes/artboardPresetEditor';
import { openArtboardPresetEditor } from '../store/actions/artboardPresetEditor';

interface ContextMenuWrapProps {
  contextMenu?: ContextMenuState;
  activeArtboard?: string;
  artboards?: em.Artboard[];
  closeContextMenu?(): ContextMenuTypes;
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
  addLayerTweenEvent?(payload: AddLayerTweenEventPayload): LayerTypes;
  removeArtboardPreset?(payload: RemoveArtboardPresetPayload): CanvasSettingsTypes;
  openArtboardPresetEditor?(payload: em.ArtboardPreset): ArtboardPresetEditorTypes;
}

const ContextMenuWrap = (props: ContextMenuWrapProps): ReactElement => {
  const { contextMenu, closeContextMenu, openContextMenu, artboards, activeArtboard, addLayerTweenEvent, removeArtboardPreset, openArtboardPresetEditor } = props;

  const getOptions = () => {
    switch(contextMenu.type) {
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
          if (current.id !== activeArtboard) {
            result = [
              ...result,
              {
                type: 'MenuItem',
                text: current.name,
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
        return 'Need more than one artboard to select tween destination.';
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
  return { contextMenu, activeArtboard, artboards };
};

export default connect(
  mapStateToProps,
  { openContextMenu, closeContextMenu, addLayerTweenEvent, removeArtboardPreset, openArtboardPresetEditor }
)(ContextMenuWrap);