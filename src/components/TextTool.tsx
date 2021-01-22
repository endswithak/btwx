/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import paper from 'paper';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasDrawing } from '../store/actions/canvasSettings';
import { addTextThunk } from '../store/actions/layer';
import { AddTextPayload } from '../store/actionTypes/layer';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { openTextEditor } from '../store/actions/textEditor';
import { OpenTextEditorPayload, TextEditorTypes } from '../store/actionTypes/textEditor';
import { TextSettingsState } from '../store/reducers/textSettings';
import { DEFAULT_TEXT_VALUE, DEFAULT_TRANSFORM, DEFAULT_STYLE } from '../constants';
import { getLayerProjectIndices } from '../store/selectors/layer';
import SnapTool from './SnapTool';
import PaperTool, { PaperToolProps } from './PaperTool';

interface TextToolStateProps {
  isEnabled?: boolean;
  scope?: string[];
  textSettings?: TextSettingsState;
  activeProjectIndex?: number;
  layerProjectIndices?: number[];
  activeArtboard?: string;
  activeArtboardProjectIndex?: number;
}

interface TextToolDispatchProps {
  addTextThunk?(payload: AddTextPayload): Promise<Btwx.Text>;
  openTextEditor?(payload: OpenTextEditorPayload): TextEditorTypes;
  toggleTextToolThunk?(): void;
}

type TextToolProps = (
  TextToolStateProps &
  TextToolDispatchProps &
  PaperToolProps
);

const TextTool = (props: TextToolProps): ReactElement => {
  const { isEnabled, tool, moveEvent, downEvent, activeProjectIndex, layerProjectIndices, openTextEditor, textSettings, scope, addTextThunk, toggleTextToolThunk, activeArtboard, activeArtboardProjectIndex } = props;
  const [snapBounds, setSnapBounds] = useState<paper.Rectangle>(null);
  const [toBounds, setToBounds] = useState<paper.Rectangle>(null);

  const resetState = () => {
    setToBounds(null);
    setSnapBounds(null);
  }

  const handleSnapToolUpdate = (snapToolBounds: paper.Rectangle, xSnapPoint: Btwx.SnapPoint, ySnapPoint: Btwx.SnapPoint): void => {
    setToBounds(snapToolBounds);
  }

  useEffect(() => {
    if (moveEvent && isEnabled) {
      const nextSnapBounds = new paperMain.Rectangle({
        from: new paperMain.Point(moveEvent.point.x - 0.5, moveEvent.point.y - 0.5),
        to: new paperMain.Point(moveEvent.point.x + 0.5, moveEvent.point.y + 0.5)
      });
      setSnapBounds(nextSnapBounds);
    }
  }, [moveEvent])

  useEffect(() => {
    if (downEvent && isEnabled) {
      const paperLayer = new paperMain.PointText({
        point: toBounds ? toBounds.center : downEvent.point,
        content: DEFAULT_TEXT_VALUE,
        ...textSettings,
        insert: false
      });
      const parentItem = layerProjectIndices.reduce((result, current, index) => {
        const project = paperMain.projects[current];
        if (project) {
          const hitTest = project.getItem({
            data: (data: any) => {
              return data.id === 'artboardBackground';
            },
            overlapping: paperLayer.bounds
          });
          return hitTest ? { id: hitTest.parent.data.id, projectIndex: index + 1, paperLayer: hitTest.parent } : result;
        } else {
          return result;
        }
      }, {
        id: activeArtboard,
        projectIndex: activeArtboardProjectIndex,
        paperLayer: paperMain.projects[activeArtboardProjectIndex].getItem({data: {id: activeArtboard}})
      });
      const point = paperLayer.point.subtract(parentItem.paperLayer.position).round();
      const position = paperLayer.position.subtract(parentItem.paperLayer.position).round();
      addTextThunk({
        layer: {
          text: DEFAULT_TEXT_VALUE,
          name: DEFAULT_TEXT_VALUE,
          parent: parentItem.id,
          frame: {
            x: position.x,
            y: position.y,
            width: paperLayer.bounds.width,
            height: paperLayer.bounds.height,
            innerWidth: paperLayer.bounds.width,
            innerHeight: paperLayer.bounds.height
          },
          transform: DEFAULT_TRANSFORM,
          style: {
            ...DEFAULT_STYLE,
            fill: {
              ...DEFAULT_STYLE.fill,
              color: textSettings.fillColor
            },
            stroke: {
              ...DEFAULT_STYLE.stroke,
              enabled: false
            }
          },
          textStyle: {
            fontSize: textSettings.fontSize,
            leading: textSettings.leading,
            fontWeight: textSettings.fontWeight,
            fontFamily: textSettings.fontFamily,
            oblique: 0,
            justification: textSettings.justification,
            letterSpacing: textSettings.letterSpacing
          },
          point: {
            x: point.x,
            y: point.y
          }
        }
      }).then((textLayer) => {
        toggleTextToolThunk();
        // get new layer bounds
        const topLeft = paperMain.view.projectToView(paperLayer.bounds.topLeft);
        const topCenter = paperMain.view.projectToView(paperLayer.bounds.topCenter);
        const topRight = paperMain.view.projectToView(paperLayer.bounds.topRight);
        // open text editor with new text layer props
        openTextEditor({
          layer: textLayer.id,
          projectIndex: parentItem.projectIndex,
          x: ((): number => {
            switch(textSettings.justification) {
              case 'left':
                return topLeft.x;
              case 'center':
                return topCenter.x;
              case 'right':
                return topRight.x;
            }
          })(),
          y: ((): number => {
            switch(textSettings.justification) {
              case 'left':
                return topLeft.y;
              case 'center':
                return topCenter.y;
              case 'right':
                return topRight.y;
            }
          })()
        });
        resetState();
      });
    }
  }, [downEvent]);

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
    isEnabled
    ? <SnapTool
        bounds={snapBounds}
        snapRule={'move'}
        hitTestZones={{center: true, middle: true}}
        onUpdate={handleSnapToolUpdate}
        toolEvent={moveEvent} />
    : null
  );
}

const mapStateToProps = (state: RootState): TextToolStateProps => {
  const { textTool, textSettings, layer } = state;
  const isEnabled = textTool.isEnabled;
  const scope = layer.present.scope;
  const activeProjectIndex = layer.present.activeProjectIndex;
  const layerProjectIndices = getLayerProjectIndices(state);
  const activeArtboard = layer.present.activeArtboard;
  const activeArtboardProjectIndex = activeArtboard ? (layer.present.byId[activeArtboard] as Btwx.Artboard).projectIndex : null;
  return {
    isEnabled,
    textSettings,
    scope,
    activeProjectIndex,
    layerProjectIndices,
    activeArtboard,
    activeArtboardProjectIndex
  };
};

const mapDispatchToProps = {
  addTextThunk,
  setCanvasDrawing,
  toggleTextToolThunk,
  openTextEditor
};

export default PaperTool(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TextTool),
  {
    mouseMove: true,
    mouseDown: true
  }
);