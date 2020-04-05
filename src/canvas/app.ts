import paper, { Point, Size, tool, Shape, Rectangle, Path, Color, PointText } from 'paper';
import { getLayerByPath, getChildByName, setSelection, renderDrawingShape, renderDrawingTooltip } from './utils';

interface RenderApp {
  canvas: HTMLCanvasElement;
  dispatch: any;
}

const drawing: {
  active: boolean;
  shape: 'rectangle' | 'ellipse' | 'rounded' | 'polygon' | 'star'
  outline: paper.Path;
  tooltip: paper.PointText;
  from: paper.Point;
  to: paper.Point;
  shiftModifier: boolean;
} = {
  active: false,
  shape: null,
  outline: null,
  tooltip: null,
  from: null,
  to: null,
  shiftModifier: false
}

const renderApp = ({ canvas, dispatch }: RenderApp): void => {
  paper.setup(canvas);
  paper.view.on('wheel', (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const nextZoom = paper.view.zoom - e.deltaY * 0.01;
      paper.view.center.x = e.clientX;
      paper.view.center.y = e.clientY;
      if (e.deltaY < 0 && nextZoom < 30) {
        paper.view.zoom = nextZoom;
      } else if (e.deltaY > 0 && nextZoom > 0) {
        paper.view.zoom = nextZoom;
      } else if (e.deltaY > 0 && nextZoom < 0) {
        paper.view.zoom = 0.001;
      }
    } else {
      paper.view.translate(new Point(e.deltaX * -1, e.deltaY * -1));
    }
  });
  paper.view.on('selected-layer-update', (e: any) => {
    setSelection({
      artboard: e.artboard,
      path: e.path,
      dispatch: dispatch
    });
  });
  paper.view.on('mousedown', (event: paper.MouseEvent) => {
    if (drawing.active) {
      drawing.from = event.point;
    }
  });
  paper.view.on('keydown', (event: paper.KeyEvent) => {
    if (event.key === 'shift' && drawing.active) {
      drawing.shiftModifier = true;
      if (drawing.tooltip) {
        drawing.tooltip.remove();
      }
      if (drawing.outline) {
        drawing.outline.remove();
        drawing.tooltip = renderDrawingTooltip({
          to: drawing.to,
          from: drawing.from,
          shiftModifier: drawing.shiftModifier,
          zoom: paper.view.zoom
        });
        drawing.outline = renderDrawingShape({
          shape: drawing.shape,
          to: drawing.to,
          from: drawing.from,
          shiftModifier: drawing.shiftModifier,
          shapeOpts: {
            selected: true
          }
        });
      }
    }
  });
  paper.view.on('keyup', (event: paper.KeyEvent) => {
    if (drawing.shiftModifier && drawing.active) {
      drawing.shiftModifier = false;
      if (drawing.tooltip) {
        drawing.tooltip.remove();
      }
      if (drawing.outline) {
        drawing.outline.remove();
        drawing.tooltip = renderDrawingTooltip({
          to: drawing.to,
          from: drawing.from,
          shiftModifier: drawing.shiftModifier,
          zoom: paper.view.zoom
        });
        drawing.outline = renderDrawingShape({
          shape: drawing.shape,
          to: drawing.to,
          from: drawing.from,
          shiftModifier: drawing.shiftModifier,
          shapeOpts: {
            selected: true
          }
        });
      }
    }
  });
  paper.view.on('mousedrag', (event: paper.MouseEvent) => {
    if (drawing.active) {
      if (drawing.tooltip) {
        drawing.tooltip.remove();
      }
      if (drawing.outline) {
        drawing.outline.remove();
      }
      drawing.to = event.point;
      drawing.tooltip = renderDrawingTooltip({
        to: drawing.to,
        from: drawing.from,
        shiftModifier: drawing.shiftModifier,
        zoom: paper.view.zoom
      });
      drawing.outline = renderDrawingShape({
        shape: drawing.shape,
        to: drawing.to,
        from: drawing.from,
        shiftModifier: drawing.shiftModifier,
        shapeOpts: {
          selected: true
        }
      });
    }
  });
  paper.view.on('mouseup', (event: paper.MouseEvent) => {
    if (drawing.active) {
      if (drawing.tooltip) {
        drawing.tooltip.remove();
      }
      if (drawing.outline) {
        drawing.outline.remove();
      }
      renderDrawingShape({
        shape: drawing.shape,
        to: drawing.to,
        from: drawing.from,
        shiftModifier: drawing.shiftModifier,
        shapeOpts: {
          fillColor: Color.random()
        }
      });
      dispatch({
        type: 'set-drawing',
        drawing: false,
        shape: null
      });
    }
  });
  paper.view.on('drawing', (e) => {
    drawing.active = e.drawing;
    drawing.shape = e.drawingShape;
  });
};

export default renderApp;