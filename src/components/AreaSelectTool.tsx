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
import { ThemeContext } from './ThemeProvider';
import { getPaperLayer } from '../store/selectors/layer';

interface AreaSelectToolProps {
  isEnabled?: boolean;
  selecting?: boolean;
  scope?: string[];
  selected?: string[];
  setCanvasSelecting?(payload: SetCanvasSelectingPayload): CanvasSettingsTypes;
  areaSelectLayers?(payload: AreaSelectLayersPayload): LayerTypes;
}

const AreaSelectTool = (props: AreaSelectToolProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { isEnabled, selecting, setCanvasSelecting, areaSelectLayers, scope, selected } = props;
  const [tool, setTool] = useState<paper.Tool>(null);
  const [from, setFrom] = useState<paper.Point>(null);
  const [to, setTo] = useState<paper.Point>(null);
  const [areaSelectBounds, setAreaSelectBounds] = useState<paper.Rectangle>(null);
  const [originalSelection, setOriginalSelection] = useState<string[]>(null);
  const [toolEvent, setToolEvent] = useState<paper.ToolEvent>(null);

  const debounceSelection = useCallback(
    debounce((asBounds: paper.Rectangle, asEvent: paper.ToolEvent, asOriginalSelection: string[], asScope: string[]) => {
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
    }, 7),
    []
  );

  const resetState = (): void => {
    if (getPaperLayer('AreaSelectPreview')) {
      getPaperLayer('AreaSelectPreview').remove();
    }
    setFrom(null);
    setTo(null);
    setOriginalSelection(null);
  }

  const updateAreaSelectPreview = () => {
    if (getPaperLayer('AreaSelectPreview')) {
      getPaperLayer('AreaSelectPreview').remove();
    }
    const areaSelectPreview = new paperMain.Path.Rectangle({
      rectangle: areaSelectBounds,
      fillColor: theme.text.lightest,
      strokeWidth: 1 / paperMain.view.zoom,
      strokeColor: theme.text.lighter,
      opacity: theme.name === 'light' ? 0.20 : 0.5,
      data: { id: 'AreaSelectPreview' }
    });
    areaSelectPreview.removeOn({
      up: true
    });
  }

  const handleMouseDown = (e: paper.ToolEvent): void => {
    setFrom(e.point);
    setOriginalSelection(selected);
  }

  const handleMouseDrag = (e: paper.ToolEvent): void => {
    setTo(e.point);
    setToolEvent(e);
    if (!selecting) {
      setCanvasSelecting({selecting: true});
    }
  }

  const handleMouseUp = (e: paper.ToolEvent): void => {
    if (selecting) {
      setCanvasSelecting({selecting: false});
    }
    resetState();
  }

  useEffect(() => {
    if (tool) {
      tool.onMouseDown = handleMouseDown;
      tool.onMouseDrag = handleMouseDrag;
      tool.onMouseUp = handleMouseUp;
    }
  }, [selecting, isEnabled, selected]);

  useEffect(() => {
    if (to && tool && isEnabled && selecting) {
      setAreaSelectBounds(new paperMain.Rectangle({ from, to }));
    }
  }, [to]);

  useEffect(() => {
    if (tool && isEnabled && selecting) {
      updateAreaSelectPreview();
      debounceSelection(areaSelectBounds, toolEvent, originalSelection, scope);
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

  useEffect(() => {
    const areaSelectTool = new paperMain.Tool();
    areaSelectTool.minDistance = 1;
    areaSelectTool.onMouseDown = handleMouseDown;
    areaSelectTool.onMouseDrag = handleMouseDrag;
    areaSelectTool.onMouseUp = handleMouseUp;
    setTool(areaSelectTool);
    paperMain.tool = null;
  }, []);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  isEnabled: boolean;
  selecting: boolean;
  scope: string[];
  selected: string[];
} => {
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

export default connect(
  mapStateToProps,
  { setCanvasSelecting, areaSelectLayers }
)(AreaSelectTool);