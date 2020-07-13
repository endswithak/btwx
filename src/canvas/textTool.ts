import paper, { Color, Tool, Point, Path, Size, PointText } from 'paper';
import { v4 as uuidv4 } from 'uuid';
import store from '../store';
import { openTextEditor } from '../store/actions/textEditor';
import { addText } from '../store/actions/layer';
import { getNearestScopeAncestor, getPaperLayer, getPagePaperLayer } from '../store/selectors/layer';
import { paperMain } from './index';
import { applyTextMethods } from './textUtils';
import { DEFAULT_TEXT_VALUE, DEFAULT_STYLE } from '../constants';
import InsertTool from './insertTool';
//import textSettings from 'src/store/reducers/textSettings';

class TextTool {
  tool: paper.Tool;
  insertTool: InsertTool;
  constructor() {
    this.tool = new paperMain.Tool();
    this.tool.activate();
    this.tool.onKeyDown = (e: paper.KeyEvent): void => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent): void => this.onKeyUp(e);
    this.tool.onMouseDown = (e: paper.ToolEvent): void => this.onMouseDown(e);
    this.tool.onMouseDrag = (e: paper.ToolEvent): void => this.onMouseDrag(e);
    this.tool.onMouseUp = (e: paper.ToolEvent): void => this.onMouseUp(e);
    this.insertTool = new InsertTool();
  }
  onKeyDown(event: paper.KeyEvent): void {
    this.insertTool.onKeyDown(event);
  }
  onKeyUp(event: paper.KeyEvent): void {
    this.insertTool.onKeyUp(event);
  }
  onMouseDown(event: paper.ToolEvent): void {

  }
  onMouseDrag(event: paper.ToolEvent): void {

  }
  onMouseUp(event: paper.ToolEvent): void {
    this.insertTool.enabled = false;
    let state = store.getState();
    const id = uuidv4();
    // create new text layer
    const paperLayer = new paperMain.PointText({
      point: event.point,
      content: DEFAULT_TEXT_VALUE,
      data: {
        id: id,
        type: 'Text'
      },
      ...state.textSettings
    });
    const parent = (() => {
      const overlappedArtboard = getPagePaperLayer(state.layer.present).getItem({
        data: (data: any) => {
          return data.id === 'ArtboardBackground';
        },
        overlapping: paperLayer.bounds
      });
      return overlappedArtboard ? overlappedArtboard.parent.data.id : state.layer.present.page;
    })();
    applyTextMethods(paperLayer);
    store.dispatch(addText({
      id: id,
      type: 'Text',
      text: DEFAULT_TEXT_VALUE,
      parent: parent,
      frame: {
        x: paperLayer.position.x,
        y: paperLayer.position.y,
        width: paperLayer.bounds.width,
        height: paperLayer.bounds.height
      },
      selected: false,
      mask: false,
      masked: false,
      points: {
        closed: true,
      },
      children: null,
      tweenEvents: [],
      tweens: [],
      style: {
        ...DEFAULT_STYLE(),
        fill: {
          ...DEFAULT_STYLE().fill,
          color: state.textSettings.fillColor
        },
        stroke: {
          ...DEFAULT_STYLE().stroke,
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
    // get new state with text layer
    state = store.getState();
    // get new layer bounds
    const topLeft = paperMain.view.projectToView(paperLayer.bounds.topLeft);
    const topCenter = paperMain.view.projectToView(paperLayer.bounds.topCenter);
    const topRight = paperMain.view.projectToView(paperLayer.bounds.topRight);
    // open text editor with new text layer props
    store.dispatch(openTextEditor({
      layer: state.layer.present.allIds[state.layer.present.allIds.length - 1],
      x: (() => {
        switch(state.textSettings.justification) {
          case 'left':
            return topLeft.x;
          case 'center':
            return topCenter.x;
          case 'right':
            return topRight.x;
        }
      })(),
      y: (() => {
        switch(state.textSettings.justification) {
          case 'left':
            return topLeft.y;
          case 'center':
            return topCenter.y;
          case 'right':
            return topRight.y;
        }
      })()
    }));
  }
}

export default TextTool;