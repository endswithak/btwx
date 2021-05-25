/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setCanvasReady, setCanvasFocusing, setCanvasMeasuring, setCanvasMousePosition } from '../store/actions/canvasSettings';
import { getAllProjectIndices } from '../store/selectors/layer';
import CanvasLayerEvents from './CanvasLayerEvents';
import CanvasUIEvents from './CanvasUIEvents';
import CanvasToast from './CanvasToast';
import ZoomTool from './ZoomTool';
import TranslateTool from './TranslateTool';
import DragTool from './DragTool';
import ResizeTool from './ResizeTool';
import ShapeTool from './ShapeTool';
import ArtboardTool from './ArtboardTool';
import AreaSelectTool from './AreaSelectTool';
import LineTool from './LineTool';
import TextTool from './TextTool';
import GradientTool from './GradientTool';
import CanvasUI from './CanvasUI';
import CanvasProjects from './CanvasProjects';
import LoadingIndicator from './LoadingIndicator';
import insertCursor from '../../assets/cursor/insert.svg';
import insertRectangleCursor from '../../assets/cursor/insert-rectangle.svg';
import insertRoundedCursor from '../../assets/cursor/insert-rounded.svg';
import insertEllipseCursor from '../../assets/cursor/insert-ellipse.svg';
import insertPolygonCursor from '../../assets/cursor/insert-polygon.svg';
import insertStarCursor from '../../assets/cursor/insert-star.svg';
import insertLineCursor from '../../assets/cursor/insert-line.svg';

interface CanvasHitResult {
  layerHitResult: {
    hitResult: paper.HitResult;
    projectIndex: number
  };
  uiHitResult: paper.HitResult;
};

type CanvasEventType = 'mouseMove' | 'mouseDown' | 'mouseUp' | 'doubleClick' | 'contextMenu';

const Canvas = (): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const ready = useSelector((state: RootState) => state.canvasSettings.ready);
  const isDevelopment = useSelector((state: RootState) => state.session.env === 'development');
  const focusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const measuring = useSelector((state: RootState) => state.canvasSettings.measuring);
  const waiting = useSelector((state: RootState) => state.canvasSettings.waiting);
  const activeTool = useSelector((state: RootState) => state.canvasSettings.activeTool);
  const shapeToolType = useSelector((state: RootState) => state.shapeTool.shapeType);
  const allProjectIndices = useSelector((state: RootState) => getAllProjectIndices(state));
  const cursor = useSelector((state: RootState) => state.canvasSettings.cursor);
  const canvasTheme = useSelector((state: RootState) => state.preferences.canvasTheme);
  const [layerEvent, setLayerEvent] = useState(null);
  const [uiEvent, setUIEvent] = useState(null);
  const [translateEvent, setTranslateEvent] = useState(null);
  const [zoomEvent, setZoomEvent] = useState(null);
  const dispatch = useDispatch();

  const validLayerHitResult = (hitResult: paper.HitResult): boolean => {
    return (
      hitResult &&
      hitResult.item &&
      hitResult.item.data &&
      hitResult.item.data.type &&
      (
        hitResult.item.data.type === 'Layer' ||
        hitResult.item.data.type === 'LayerChild' ||
        hitResult.item.data.type === 'LayerContainer'
      )
    );
  };

  const validUIHitResult = (hitResult: paper.HitResult): boolean => {
    return (
      hitResult &&
      hitResult.item &&
      hitResult.item.data &&
      hitResult.item.data.type &&
      (
        hitResult.item.data.type === 'UIElement' ||
        hitResult.item.data.type === 'UIElementChild' ||
        hitResult.item.data.type === 'UIElementContainer'
      )
    );
  };

  const handleHitResult = (e: any, eventType: CanvasEventType): void => {
    const { layerHitResult, uiHitResult } = allProjectIndices.reduce((result: CanvasHitResult, current, index) => {
      const project = paperMain.projects[current];
      if (project) {
        const hitResult = project.hitTest(project.view.getEventPoint(e));
        if (hitResult) {
          if (current === 0) {
            result.uiHitResult = hitResult;
          } else {
            result.layerHitResult = {
              hitResult,
              projectIndex: index
            };
          }
        }
      }
      return result;
    },{
      layerHitResult: {
        hitResult: null,
        projectIndex: null
      },
      uiHitResult: null
    });
    if (validUIHitResult(uiHitResult)) {
      setUIEvent({
        hitResult: uiHitResult,
        eventType: eventType,
        event: e.nativeEvent,
        empty: false
      });
    } else {
      if (validLayerHitResult(layerHitResult.hitResult)) {
        setLayerEvent({
          hitResult: (() => {
            switch(layerHitResult.hitResult.item.data.type) {
              case 'LayerContainer':
              case 'LayerChild':
                return layerHitResult.hitResult.item.data.layerId;
              case 'Layer':
                return layerHitResult.hitResult.item.data.id;
            }
          })(),
          projectIndex: layerHitResult.projectIndex,
          eventType: eventType,
          event: e.nativeEvent,
          empty: false
        });
      } else {
        setUIEvent({
          hitResult: null,
          eventType: eventType,
          event: e.nativeEvent,
          empty: true
        });
        setLayerEvent({
          hitResult: null,
          projectIndex: null,
          eventType: eventType,
          event: e.nativeEvent,
          empty: true
        });
      }
    }
  }

  const handleMouseMove = (e: any): void => {
    if (e.buttons === 0) {
      const canvasEventPoint = paperMain.view.getEventPoint(e);
      handleHitResult(e, 'mouseMove');
      dispatch(setCanvasMousePosition({
        mouse: {
          x: e.clientX,
          y: e.clientY,
          paperX: canvasEventPoint.x,
          paperY: canvasEventPoint.y
        }
      }));
    }
  }

  const handleMouseDown = (e: any): void => {
    if (!focusing) {
      dispatch(setCanvasFocusing({
        focusing: true
      }));
    }
    if (measuring) {
      dispatch(setCanvasMeasuring({
        measuring: false
      }));
    }
    if ((document.activeElement && (document.activeElement.nodeName === 'INPUT' || document.activeElement.nodeName === 'TEXTAREA'))) {
      (document.activeElement as HTMLInputElement).blur();
    }
    handleHitResult(e, 'mouseDown');
  }

  const handleDoubleClick = (e: any): void => {
    handleHitResult(e, 'doubleClick');
  }

  const handleContextMenu = (e: any): void => {
    handleHitResult(e, 'contextMenu');
  }

  const handleWheel = (e: any): void => {
    if (e.ctrlKey) {
      setZoomEvent(e.nativeEvent);
    } else {
      setTranslateEvent(e.nativeEvent);
    }
  }

  const handleResize = (): void => {
    allProjectIndices.forEach((current, index) => {
      const project = paperMain.projects[current];
      project.view.viewSize = new paperMain.Size(ref.current.clientWidth, ref.current.clientHeight);
    });
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return (): void => {
      window.removeEventListener('resize', handleResize);
    }
  }, [allProjectIndices]);

  useEffect(() => {
    dispatch(setCanvasReady());
  }, []);

  return (
    <div
      ref={ref}
      id='canvas-container'
      className={`c-canvas c-canvas--${canvasTheme}`}
      onMouseMove={ready ? handleMouseMove : null}
      onMouseDown={ready ? handleMouseDown : null}
      onDoubleClick={ready ? handleDoubleClick : null}
      onContextMenu={ready ? handleContextMenu : null}
      onWheel={ready ? handleWheel : null}
      style={{
        cursor: cursor[0] === 'crosshair'
        ? (() => {
            switch(activeTool) {
              case 'Shape':
                switch(shapeToolType) {
                  case 'Rectangle':
                    return `url(${insertRectangleCursor}) 17 17, auto`;
                  case 'Ellipse':
                    return `url(${insertEllipseCursor}) 17 17, auto`;
                  case 'Polygon':
                    return `url(${insertPolygonCursor}) 17 17, auto`;
                  case 'Rounded':
                    return `url(${insertRoundedCursor}) 17 17, auto`;
                  case 'Star':
                    return `url(${insertStarCursor}) 17 17, auto`;
                  case 'Line':
                    return `url(${insertLineCursor}) 17 17, auto`;
                  default:
                    return `url(${insertCursor}) 17 17, auto`;
                }
              default:
                return `url(${insertCursor}) 17 17, auto`;
            }
          })()
        : cursor[0]
      }}>
      <CanvasUI />
      <CanvasProjects />
      {
        ready
        ? <>
            {/* canvas interactions */}
            <CanvasUIEvents
              uiEvent={uiEvent} />
            <CanvasLayerEvents
              layerEvent={layerEvent} />
            {/* always activated tools */}
            <ZoomTool
              zoomEvent={zoomEvent} />
            <TranslateTool
              translateEvent={translateEvent} />
            {/* user activated tools */}
            <ArtboardTool />
            <ShapeTool />
            <TextTool />
            {/* hover activated tools */}
            <DragTool />
            <AreaSelectTool />
            <ResizeTool />
            <LineTool />
            {/* misc tools */}
            <GradientTool />
            {/* debug tools */}
            {
              isDevelopment
              ? <CanvasToast />
              : null
            }
          </>
        : null
      }
      {
        waiting
        ? <div className='c-canvas__loading-indicaor'>
            <LoadingIndicator />
          </div>
        : null
      }
    </div>
  );
}

export default Canvas;