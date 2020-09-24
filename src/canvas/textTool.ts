import store from '../store';
import { openTextEditor } from '../store/actions/textEditor';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { addTextThunk } from '../store/actions/layer';
import { getPagePaperLayer } from '../store/selectors/layer';
import { paperMain } from './index';
import { DEFAULT_TEXT_VALUE, DEFAULT_STYLE, DEFAULT_TRANSFORM } from '../constants';

class TextTool {
  tool: paper.Tool;
  constructor() {
    this.tool = new paperMain.Tool();
    this.tool.activate();
    this.tool.onKeyDown = (e: paper.KeyEvent): void => this.onKeyDown(e);
    this.tool.onKeyUp = (e: paper.KeyEvent): void => this.onKeyUp(e);
    this.tool.onMouseUp = (e: paper.ToolEvent): void => this.onMouseUp(e);
  }
  disable() {
    store.dispatch(toggleTextToolThunk() as any);
  }
  onKeyDown(event: paper.KeyEvent): void {
    switch(event.key) {
      case 'escape': {
        this.disable();
        break;
      }
    }
  }
  onKeyUp(event: paper.KeyEvent): void {

  }
  onMouseUp(event: paper.ToolEvent): void {
    let state = store.getState();
    // create new text layer
    const paperLayer = new paperMain.PointText({
      point: event.point,
      content: DEFAULT_TEXT_VALUE,
      ...state.textSettings,
      insert: false
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
    store.dispatch(addTextThunk({
      layer: {
        text: DEFAULT_TEXT_VALUE,
        name: DEFAULT_TEXT_VALUE,
        parent: parent,
        frame: {
          x: paperLayer.position.x,
          y: paperLayer.position.y,
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
      }
    }) as any);
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
    this.disable();
  }
}

export default TextTool;