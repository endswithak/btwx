/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { connect } from 'react-redux';
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
import { getLeading } from './CanvasTextLayer';

interface TextToolStateProps {
  isEnabled?: boolean;
  scope?: string[];
  textSettings?: TextSettingsState;
  activeProjectIndex?: number;
  layerProjectIndices?: number[];
  activeArtboardItem?: Btwx.Artboard;
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
  const { isEnabled, tool, moveEvent, downEvent, activeProjectIndex, layerProjectIndices, openTextEditor, textSettings, scope, addTextThunk, toggleTextToolThunk, activeArtboardItem } = props;
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
    try {
      if (moveEvent && isEnabled) {
        const nextSnapBounds = new paperMain.Rectangle({
          from: new paperMain.Point(moveEvent.point.x - 0.5, moveEvent.point.y - 0.5),
          to: new paperMain.Point(moveEvent.point.x + 0.5, moveEvent.point.y + 0.5)
        });
        setSnapBounds(nextSnapBounds);
      }
    } catch(err) {
      console.error(`Text Tool Error -- On Mouse Move -- ${err}`);
      resetState();
    }
  }, [moveEvent])

  useEffect(() => {
    try {
      if (downEvent && isEnabled) {
        const paperLayer = new paperMain.PointText({
          point: toBounds ? toBounds.center : downEvent.point,
          content: DEFAULT_TEXT_VALUE,
          ...textSettings,
          leading: getLeading({
            leading: textSettings.leading,
            fontSize: textSettings.fontSize
          }),
          insert: false
        });
        const artboardPosition = new paperMain.Point(activeArtboardItem.frame.x, activeArtboardItem.frame.y);
        const point = paperLayer.point.subtract(artboardPosition).round();
        const position = paperLayer.position.subtract(artboardPosition).round();
        addTextThunk({
          layer: {
            text: DEFAULT_TEXT_VALUE,
            name: DEFAULT_TEXT_VALUE,
            parent: activeArtboardItem.id,
            artboard: activeArtboardItem.id,
            frame: {
              x: position.x,
              y: position.y,
              width: Math.round(paperLayer.bounds.width),
              height: Math.round(paperLayer.bounds.height),
              innerWidth: Math.round(paperLayer.bounds.width),
              innerHeight: Math.round(paperLayer.bounds.height)
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
              justification: textSettings.justification,
              letterSpacing: textSettings.letterSpacing,
              textTransform: textSettings.textTransform,
              textResize: 'autoWidth',
              verticalAlignment: 'top',
              fontStyle: textSettings.fontStyle
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
            projectIndex: activeArtboardItem.projectIndex,
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
    } catch(err) {
      console.error(`Text Tool Error -- On Mouse Down -- ${err}`);
      resetState();
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
  const activeArtboardItem = activeArtboard ? layer.present.byId[activeArtboard] as Btwx.Artboard : null;
  return {
    isEnabled,
    textSettings,
    scope,
    activeProjectIndex,
    layerProjectIndices,
    activeArtboardItem
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