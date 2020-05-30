import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import store from '../store';
import { enableSelectionTool, enableRectangleDrawTool, enableEllipseDrawTool, enableRoundedDrawTool, enableDragTool } from '../store/actions/tool';
import { openTextEditor } from '../store/actions/textEditor';
import { addText } from '../store/actions/layer';
import { getNearestScopeAncestor, getPaperLayer } from '../store/selectors/layer';
import { paperMain } from './index';
import { applyTextMethods } from './textUtils';
import { DEFAULT_TEXT_VALUE, DEFAULT_STYLE } from '../constants';
import textSettings from 'src/store/reducers/textSettings';

class TextTool {
  tool: paper.Tool;
  constructor() {
    this.tool = new paperMain.Tool();
    this.tool.activate();
    this.tool.onKeyDown = (e: paper.KeyEvent): void => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent): void => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent): void => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent): void => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent): void => this.onMouseUp(e);
  }
  onKeyDown(event: paper.KeyEvent): void {

  }
  onKeyUp(event: paper.KeyEvent): void {

  }
  onMouseDown(event: paper.ToolEvent): void {

  }
  onMouseDrag(event: paper.ToolEvent): void {

  }
  onMouseUp(event: paper.ToolEvent): void {
    let state = store.getState();
    const newPaperLayer = new paperMain.PointText({
      point: event.point,
      content: DEFAULT_TEXT_VALUE,
      ...state.textSettings
    });
    applyTextMethods(newPaperLayer);
    const overlappedLayers = getPaperLayer(state.layer.present.page).getItems({
      data: (data: any) => {
        if (data.id === 'ArtboardBackground') {
          return true;
        } else {
          const topParent = getNearestScopeAncestor(state.layer.present, data.id);
          return topParent.id === data.id;
        }
      },
      overlapping: newPaperLayer.bounds
    });
    const artboardOverlapped = () => {
      if (overlappedLayers.length > 0 && overlappedLayers.some((item) => item.data.id === 'ArtboardBackground')) {
        const firstArtboard = overlappedLayers.find((item) => item.data.id === 'ArtboardBackground');
        return firstArtboard.parent.data.id;
      } else {
        return false;
      }
    }
    store.dispatch(addText({
      text: newPaperLayer.content,
      parent: state.layer.present.scope.length > 0 ? state.layer.present.scope[state.layer.present.scope.length - 1] : artboardOverlapped() ? artboardOverlapped() : state.layer.present.page,
      frame: {
        x: newPaperLayer.position.x,
        y: newPaperLayer.position.y,
        width: newPaperLayer.bounds.width,
        height: newPaperLayer.bounds.height
      },
      paperLayer: newPaperLayer,
      style: {
        ...DEFAULT_STYLE,
        fill: {
          ...DEFAULT_STYLE.fill,
          color: state.textSettings.fillColor
        },
        stroke: {
          ...DEFAULT_STYLE.stroke,
          enabled: false
        }
      },
      textStyle: {
        fontSize: state.textSettings.fontSize,
        leading: state.textSettings.leading,
        fontWeight: state.textSettings.fontWeight,
        fontFamily: state.textSettings.fontFamily,
        justification: state.textSettings.justification
      }
    }));
    state = store.getState();
    store.dispatch(openTextEditor({
      layer: state.layer.present.allIds[state.layer.present.allIds.length - 1],
      x: newPaperLayer.viewMatrix.tx,
      y: newPaperLayer.viewMatrix.ty
    }));
  }
}

export default TextTool;