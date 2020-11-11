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
  const { isEnabled, selecting, setCanvasSelecting, areaSelectLayers, scope, selected, tool, keyDownEvent, keyUpEvent, moveEvent, downEvent, dragEvent, upEvent } = props;
  const [areaSelectBounds, setAreaSelectBounds] = useState<paper.Rectangle>(null);
  const [originalSelection, setOriginalSelection] = useState<string[]>(null);

  const debounceSelection = useCallback(
    (asBounds: paper.Rectangle, asEvent: paper.ToolEvent, asOriginalSelection: string[], asScope: string[]) => {
      const nextSelectedLayers: string[] = [];
      const nextDeselectedLayers: string[] = [];
      if (asEvent.modifiers.shift) {
        paperMain.project.getItems({
          data: (data: any) => {
            const notPage = data.type === 'Layer' && data.layerType !== 'Page';
            const isScopeLayer = data.scope && asScope.includes(data.scope[data.scope.length - 1]);
            const other = data.id && data.id !== asScope[asScope.length - 1];
            const isNotSelected = !data.selected;
            const isPartOfOriginalSelection = data.id && asOriginalSelection.includes(data.id);
            return notPage && isScopeLayer && (isNotSelected || isPartOfOriginalSelection) && other;
          },
          bounds: (bounds: paper.Rectangle) => {
            return bounds.intersects(asBounds);
          }
        }).forEach((current) => {
          if (asOriginalSelection.includes(current.data.id)) {
            if (current.data.selected) {
              nextDeselectedLayers.push(current.data.id);
            }
          } else {
            nextSelectedLayers.push(current.data.id);
          }
        });
        paperMain.project.getItems({
          data: (data: any) => {
            const notPage = data.type === 'Layer' && data.layerType !== 'Page';
            const isScopeLayer = data.scope && asScope.includes(data.scope[data.scope.length - 1]);
            const other = data.id && data.id !== asScope[asScope.length - 1];
            const isSelected = data.selected;
            const isPartOfOriginalSelection = data.id && asOriginalSelection.includes(data.id);
            return notPage && isScopeLayer && (isSelected || isPartOfOriginalSelection) && other;
          },
          bounds: (bounds: paper.Rectangle) => {
            return !bounds.intersects(asBounds);
          }
        }).forEach((current) => {
          if (asOriginalSelection.includes(current.data.id)) {
            if (!current.data.selected) {
              nextSelectedLayers.push(current.data.id);
            }
          } else {
            nextDeselectedLayers.push(current.data.id);
          }
        });
      } else {
        paperMain.project.getItems({
          data: (data: any) => {
            const notPage = data.type === 'Layer' && data.layerType !== 'Page';
            const isScopeLayer = data.scope && scope.includes(data.scope[data.scope.length - 1]);
            const other = data.id && data.id !== scope[scope.length - 1];
            const isNotSelected = !data.selected;
            return notPage && isScopeLayer && isNotSelected && other;
          },
          bounds: (bounds: paper.Rectangle) => {
            return bounds.intersects(asBounds);
          }
        }).forEach((current) => {
          nextSelectedLayers.push(current.data.id);
        });
        paperMain.project.getItems({
          data: (data: any) => {
            const notPage = data.type === 'Layer' && data.layerType !== 'Page';
            const isScopeLayer = data.scope && asScope.includes(data.scope[data.scope.length - 1]);
            const other = data.id && data.id !== asScope[asScope.length - 1];
            const isSelected = data.selected;
            return notPage && isScopeLayer && isSelected && other;
          },
          bounds: (bounds: paper.Rectangle) => {
            return !bounds.intersects(asBounds);
          }
        }).forEach((current) => {
          nextDeselectedLayers.push(current.data.id);
        });
      }
      if (nextSelectedLayers.length > 0 || nextDeselectedLayers.length > 0) {
        areaSelectLayers({
          select: nextSelectedLayers,
          deselect: nextDeselectedLayers
        });
      }
    },
    []
  );

  const resetState = (): void => {
    if (getPaperLayer('AreaSelectPreview')) {
      getPaperLayer('AreaSelectPreview').remove();
    }
    setOriginalSelection(null);
    setAreaSelectBounds(null);
  }

  const updateAreaSelectPreview = () => {
    if (getPaperLayer('AreaSelectPreview')) {
      getPaperLayer('AreaSelectPreview').remove();
    }
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

  useEffect(() => {
    if (downEvent && isEnabled) {
      setOriginalSelection(selected);
    }
  }, [downEvent]);

  useEffect(() => {
    if (dragEvent && isEnabled) {
      setAreaSelectBounds(new paperMain.Rectangle({
        from: dragEvent.downPoint,
        to: dragEvent.point
      }));
      if (!selecting) {
        setCanvasSelecting({selecting: true});
      }
    }
  }, [dragEvent]);

  useEffect(() => {
    if (upEvent && isEnabled) {
      debounceSelection(areaSelectBounds, dragEvent, originalSelection, scope);
      if (selecting) {
        setCanvasSelecting({selecting: false});
      }
      resetState();
    }
  }, [upEvent]);

  useEffect(() => {
    if (areaSelectBounds && isEnabled) {
      updateAreaSelectPreview();
      // debounceSelection(areaSelectBounds, dragEvent, originalSelection, scope);
    }
  }, [areaSelectBounds]);

  useEffect(() => {
    if (isEnabled) {
      if (tool) {
        tool.activate();
      }
    } else {
      if (tool && paperMain.tool && (paperMain.tool as any)._index === (tool as any)._index) {
        paperMain.tool = null;
        resetState();
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
  )(AreaSelectTool)
);