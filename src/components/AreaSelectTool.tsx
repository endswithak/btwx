/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useContext, useEffect, ReactElement, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasSelecting } from '../store/actions/canvasSettings';
import { CanvasSettingsTypes, SetCanvasSelectingPayload } from '../store/actionTypes/canvasSettings';
import { areaSelectLayers } from '../store/actions/layer';
import { LayerTypes, AreaSelectLayersPayload } from '../store/actionTypes/layer';
import { getPaperLayer } from '../store/selectors/layer';
import PaperTool, { PaperToolProps } from './PaperTool';
import { ThemeContext } from './ThemeProvider';

interface AreaSelectToolStateProps {
  isEnabled?: boolean;
  selecting?: boolean;
  scope?: string[];
  selected?: string[];
}

interface AreaSelectToolDispatchProps {
  setCanvasSelecting?(payload: SetCanvasSelectingPayload): CanvasSettingsTypes;
  areaSelectLayers?(payload: AreaSelectLayersPayload): LayerTypes;
}

type AreaSelectToolProps = (
  AreaSelectToolStateProps &
  AreaSelectToolDispatchProps &
  PaperToolProps
);

const AreaSelectTool = (props: AreaSelectToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, selecting, setCanvasSelecting, areaSelectLayers, scope, selected, tool, downEvent, dragEvent, upEvent } = props;

  const updateAreaSelectPreview = (areaSelectBounds: paper.Rectangle): void => {
    if (getPaperLayer('AreaSelectPreview')) {
      getPaperLayer('AreaSelectPreview').remove();
    }
    if (areaSelectBounds) {
      const areaSelectPreview = new paperMain.Path.Rectangle({
        rectangle: areaSelectBounds,
        fillColor: theme.name === 'light' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.5)',
        strokeWidth: 1 / paperMain.view.zoom,
        strokeColor: theme.name === 'light' ? '#000' : '#fff',
        opacity: 0.2,
        data: { id: 'AreaSelectPreview' }
      });
      areaSelectPreview.removeOn({
        up: true
      });
    }
  }

  useEffect(() => {
    if (dragEvent && isEnabled) {
      updateAreaSelectPreview(null);
      setCanvasSelecting({selecting: true});
    }
  }, [downEvent]);

  useEffect(() => {
    if (dragEvent && isEnabled) {
      updateAreaSelectPreview(
        new paperMain.Rectangle({
          from: dragEvent.downPoint,
          to: dragEvent.point
        })
      );
    }
  }, [dragEvent]);

  useEffect(() => {
    if (upEvent && isEnabled) {
      const areaSelectBounds = new paperMain.Rectangle({
        from: upEvent.downPoint,
        to: upEvent.point
      });
      if (areaSelectBounds && (areaSelectBounds.width > 0 || areaSelectBounds.height > 0)) {
        const layers = paperMain.project.getItems({
          data: (data: any) => {
            const notPage = data.type === 'Layer' && data.layerType !== 'Page';
            const isScopeLayer = data.scope && scope.includes(data.scope[data.scope.length - 1]);
            const other = data.id && data.id !== scope[scope.length - 1];
            return notPage && isScopeLayer && other;
          },
          overlapping: areaSelectBounds
        }).reduce((result, current) => {
          return [...result, current.data.id];
        }, []);
        if (layers.length > 0) {
          areaSelectLayers({
            layers: layers,
            shiftModifier: upEvent.modifiers.shift
          });
        }
      }
      setCanvasSelecting({selecting: false});
      updateAreaSelectPreview(null);
    }
  }, [upEvent]);

  useEffect(() => {
    if (isEnabled) {
      if (tool) {
        tool.activate();
      }
    } else {
      if (tool && paperMain.tool && (paperMain.tool as any)._index === (tool as any)._index) {
        paperMain.tool = null;
        updateAreaSelectPreview(null);
      }
    }
  }, [isEnabled]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): AreaSelectToolStateProps => {
  const { canvasSettings, layer } = state;
  const selecting = canvasSettings.selecting;
  const isEnabled = canvasSettings.activeTool === 'AreaSelect';
  const scope = layer.present.scope;
  const selected = layer.present.selected;
  return {
    isEnabled,
    selecting,
    scope,
    selected
  };
};

const mapDispatchToProps = {
  setCanvasSelecting,
  areaSelectLayers
};

export default PaperTool(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AreaSelectTool),
  {
    mouseDown: true,
    mouseDrag: true,
    mouseUp: true
  }
);