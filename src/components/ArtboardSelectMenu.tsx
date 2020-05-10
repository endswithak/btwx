import paper from 'paper';
import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { ThemeContext } from './ThemeProvider';
import { RootState } from '../store/reducers';
import { ContextMenuTypes, OpenContextMenuPayload } from '../store/actionTypes/contextMenu';
import { closeContextMenu, openContextMenu } from '../store/actions/contextMenu';
import { AddLayerAnimationPayload, LayerTypes } from '../store/actionTypes/layer';
import { addLayerAnimation } from '../store/actions/layer';
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
  openContextMenu?(payload: OpenContextMenuPayload): ContextMenuTypes;
  closeContextMenu?(): ContextMenuTypes;
  addLayerAnimation?(payload: AddLayerAnimationPayload): LayerTypes;
}

const ArtboardSelectMenu = (props: ContextMenuProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { activeArtboard, artboards, contextMenu, openContextMenu, closeContextMenu, addLayerAnimation } = props;

  const animationSelectOptions = artboards.reduce((result, current) => {
    if (current.id !== activeArtboard) {
      result = [
        ...result,
        {
          text: current.name,
          onClick: () => {
            addLayerAnimation({
              artboard: activeArtboard,
              destination: current.id,
              event: contextMenu.data.animationEvent,
              layer: contextMenu.id
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
  { openContextMenu, closeContextMenu, addLayerAnimation }
)(ArtboardSelectMenu);