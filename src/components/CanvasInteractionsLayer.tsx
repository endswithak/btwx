// import { remote } from 'electron';
import React, { useRef, useContext, useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import { scrollToLayer } from '../utils';
import { RootState } from '../store/reducers';
import { importPaperProject, getDeepSelectItem, getNearestScopeAncestor } from '../store/selectors/layer';
import { paperMain } from '../canvas';
import { LayerTypes, SetLayerHoverPayload, DeepSelectLayerPayload, SelectLayersPayload, DeselectLayersPayload } from '../store/actionTypes/layer';
import { setLayerHover, deepSelectLayer, selectLayers, deselectLayers, deselectAllLayers } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';

interface CanvasInteractionsLayerProps {
  hitResult: {
    hitResult: paper.HitResult;
    empty: boolean;
    eventType: 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu';
    event: any;
  };
  layerItem?: em.Layer;
  nearestScopeAncestor?: em.Layer;
  deepSelectItem?: em.Layer;
  hover?: string;
  selected?: string[];
  setLayerHover?(payload: SetLayerHoverPayload): LayerTypes;
  selectLayers?(payload: SelectLayersPayload): LayerTypes;
  deepSelectLayer?(payload: DeepSelectLayerPayload): LayerTypes;
  deselectLayers?(payload: DeselectLayersPayload): LayerTypes;
  deselectAllLayers?(): LayerTypes;
}

const CanvasInteractionsLayer = (props: CanvasInteractionsLayerProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { hitResult, hover, selected, deselectLayers, deselectAllLayers, layerItem, nearestScopeAncestor, deepSelectItem, setLayerHover, selectLayers, deepSelectLayer } = props;

  const handleMouseMove = (): void => {
    if (hitResult.empty) {
      if (hover !== null) {
        setLayerHover({id: null});
      }
    } else {
      if (nearestScopeAncestor.type === 'Artboard') {
        if (hover !== deepSelectItem.id) {
          setLayerHover({id: deepSelectItem.id});
        }
      } else {
        if (hover !== nearestScopeAncestor.id) {
          setLayerHover({id: nearestScopeAncestor.id});
        }
      }
    }
  }

  const handleMouseDown = (): void => {
    if (hitResult.empty) {
      if (selected.length > 0 && !hitResult.event.shiftKey) {
        deselectAllLayers()
      }
    } else {
      if (hitResult.event.shiftKey) {
        if (!(nearestScopeAncestor.type === 'Artboard' && selected.length > 0)) {
          if (layerItem.selected) {
            deselectLayers({layers: [nearestScopeAncestor.id]});
          } else {
            selectLayers({layers: [nearestScopeAncestor.id]});
          }
        }
      } else {
        if (!layerItem.selected || (nearestScopeAncestor.type === 'Artboard' && nearestScopeAncestor.selected)) {
          let layerId: string;
          if (nearestScopeAncestor.type === 'Artboard') {
            layerId = deepSelectItem.id;
            deepSelectLayer({id: layerItem.id})
          } else {
            layerId = nearestScopeAncestor.id;
            selectLayers({layers: [nearestScopeAncestor.id], newSelection: true})
          }
          if (layerId) {
            scrollToLayer(layerId);
          }
        }
      }
    }
  }

  const handleMouseUp = (): void => {

  }

  const handleDoubleClick = (): void => {
    if (!hitResult.empty) {
      if (nearestScopeAncestor.id !== layerItem.id) {
        deepSelectLayer({id: layerItem.id});
        scrollToLayer(deepSelectItem.id);
      }
    }
  }

  const handleContextMenu = (): void => {

  }

  useEffect(() => {
    if (hitResult) {
      switch(hitResult.eventType) {
        case 'contextMenu':
          handleContextMenu();
          break;
        case 'doubleClick':
          handleDoubleClick();
          break;
        case 'mouseDown':
          handleMouseDown();
          break;
        case 'mouseMove':
          handleMouseMove();
          break;
        case 'mouseUp':
          handleMouseUp();
          break;
      }
    }
  }, [hitResult]);

  return (
    <div />
  );
}

const mapStateToProps = (state: RootState, ownProps: CanvasInteractionsLayerProps): {
  layerItem: em.Layer;
  nearestScopeAncestor: em.Layer;
  deepSelectItem: em.Layer;
  hover: string;
  selected: string[];
} => {
  const { layer } = state;
  const hitResult = ownProps.hitResult;
  const result = hitResult ? ownProps.hitResult.hitResult : null;
  const layerItem = hitResult && !hitResult.empty ? layer.present.byId[result.item.data.type === 'Layer' ? result.item.data.id : result.item.parent.data.id] : null;
  const nearestScopeAncestor = layerItem ? getNearestScopeAncestor(layer.present, layerItem.id) : null;
  const deepSelectItem = layerItem ? getDeepSelectItem(layer.present, layerItem.id) : null;
  const hover = layer.present.hover;
  const selected = layer.present.selected;
  return {
    layerItem,
    nearestScopeAncestor,
    deepSelectItem,
    hover,
    selected
  };
};

export default connect(
  mapStateToProps,
  { setLayerHover, selectLayers, deepSelectLayer, deselectLayers, deselectAllLayers }
)(CanvasInteractionsLayer);