import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { ContextMenuTypes } from '../store/actionTypes/contextMenu';
import { closeContextMenu } from '../store/actions/contextMenu';
import { AddLayerAnimationEventPayload, LayerTypes } from '../store/actionTypes/layer';
import { addLayerAnimationEvent } from '../store/actions/layer';
import ContextMenu from './ContextMenu';

interface ContextMenuProps {
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
  addLayerAnimationEvent?(payload: AddLayerAnimationEventPayload): LayerTypes;
}

const ArtboardSelectMenu = (props: ContextMenuProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { activeArtboard, artboards, contextMenu, closeContextMenu, addLayerAnimationEvent } = props;

  const animationSelectOptions = artboards.reduce((result, current) => {
    if (current.id !== activeArtboard) {
      result = [
        ...result,
        {
          text: current.name,
          onClick: () => {
            addLayerAnimationEvent({
              artboard: activeArtboard,
              destinationArtboard: current.id,
              event: contextMenu.data.animationEvent,
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
      options={animationSelectOptions}
      type='AnimationArtboardSelect' />
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
  { closeContextMenu, addLayerAnimationEvent }
)(ArtboardSelectMenu);