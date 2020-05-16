import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { ContextMenuTypes } from '../store/actionTypes/contextMenu';
import { closeContextMenu } from '../store/actions/contextMenu';
import { AddLayerTweenEventPayload, LayerTypes } from '../store/actionTypes/layer';
import { addLayerTweenEvent } from '../store/actions/layer';
import ContextMenu from './ContextMenu';

interface TweenEventDestinationSelectProps {
  activeArtboard: string;
  artboards: em.Artboard[];
  contextMenu?: {
    type: em.ContextMenu;
    id: string;
    isOpen: boolean;
    x: number;
    y: number;
    data: any;
  };
  closeContextMenu?(): ContextMenuTypes;
  addLayerTweenEvent?(payload: AddLayerTweenEventPayload): LayerTypes;
}

const TweenEventDestinationSelect = (props: TweenEventDestinationSelectProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { activeArtboard, artboards, contextMenu, closeContextMenu, addLayerTweenEvent } = props;

  const tweenDestinationSelectOptions = artboards.reduce((result, current) => {
    if (current.id !== activeArtboard) {
      result = [
        ...result,
        {
          text: current.name,
          onClick: () => {
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

  return (
    <ContextMenu
      options={tweenDestinationSelectOptions}
      type='TweenEventDestination' />
  );
}

const mapStateToProps = (state: RootState) => {
  const { contextMenu, layer } = state;
  const activeArtboard = layer.present.activeArtboard;
  const artboards = layer.present.artboards.reduce((result, current) => {
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
  { closeContextMenu, addLayerTweenEvent }
)(TweenEventDestinationSelect);