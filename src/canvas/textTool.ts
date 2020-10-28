import store from '../store';
import { openTextEditor } from '../store/actions/textEditor';
import { addTextThunk } from '../store/actions/layer';
import { getPagePaperLayer } from '../store/selectors/layer';
import SnapTool from './snapTool';
import { paperMain } from './index';
import { DEFAULT_TEXT_VALUE, DEFAULT_STYLE, DEFAULT_TRANSFORM } from '../constants';
import { RootState } from '../store/reducers';

class TextTool {
  state: RootState;
  tool: paper.Tool;
  snapTool: SnapTool;
  toBounds: paper.Rectangle;
  constructor() {
    this.snapTool = new SnapTool();
    this.toBounds = null;
  }
  onKeyDown(event: paper.KeyEvent): void {

  }
  onKeyUp(event: paper.KeyEvent): void {

  }
  onMouseMove(event: paper.ToolEvent): void {
    this.toBounds = new paperMain.Rectangle({
      point: event.point,
      size: new paperMain.Size(1, 1)
    });
    this.snapTool.snapPoints = this.state.layer.present.inView.snapPoints;
    this.snapTool.snapBounds = this.toBounds;
    this.snapTool.updateXSnap({
      event: event,
      snapTo: {
        left: true,
        right: false,
        center: false
      },
      handleSnapped: (snapPoint) => {
        switch(snapPoint.boundsSide) {
          case 'left':
            this.toBounds.center.x = snapPoint.point + (this.toBounds.width / 2);
            break;
          case 'center':
            this.toBounds.center.x = snapPoint.point;
            break;
          case 'right':
            this.toBounds.center.x = snapPoint.point - (this.toBounds.width / 2);
            break;
        }
      },
      handleSnap: (closestXSnap) => {
        switch(closestXSnap.bounds.side) {
          case 'left':
            this.toBounds.center.x = closestXSnap.snapPoint.point + (this.toBounds.width / 2);
            break;
          case 'center':
            this.toBounds.center.x = closestXSnap.snapPoint.point;
            break;
          case 'right':
            this.toBounds.center.x = closestXSnap.snapPoint.point - (this.toBounds.width / 2);
            break;
        }
      }
    });
    this.snapTool.updateYSnap({
      event: event,
      snapTo: {
        top: true,
        bottom: false,
        center: false
      },
      handleSnapped: (snapPoint) => {
        switch(snapPoint.boundsSide) {
          case 'top':
            this.toBounds.center.y = snapPoint.point + (this.toBounds.height / 2);
            break;
          case 'center':
            this.toBounds.center.y = snapPoint.point;
            break;
          case 'bottom':
            this.toBounds.center.y = snapPoint.point - (this.toBounds.height / 2);
            break;
        }
      },
      handleSnap: (closestYSnap) => {
        switch(closestYSnap.bounds.side) {
          case 'top':
            this.toBounds.center.y = closestYSnap.snapPoint.point + (this.toBounds.height / 2);
            break;
          case 'center':
            this.toBounds.center.y = closestYSnap.snapPoint.point;
            break;
          case 'bottom':
            this.toBounds.center.y = closestYSnap.snapPoint.point - (this.toBounds.height / 2);
            break;
        }
      }
    });
    this.snapTool.updateGuides();
  }
  onMouseDown(event: paper.ToolEvent): void {
    // create new text layer
    const paperLayer = new paperMain.PointText({
      point: new paperMain.Point(this.snapTool.snap.x ? this.snapTool.snap.x.point : event.point.x, this.snapTool.snap.y ? this.snapTool.snap.y.point : event.point.y),
      content: DEFAULT_TEXT_VALUE,
      ...this.state.textSettings,
      insert: false
    });
    const parent = (() => {
      const overlappedArtboard = getPagePaperLayer(this.state.layer.present).getItem({
        data: (data: any) => {
          return data.id === 'ArtboardBackground';
        },
        overlapping: paperLayer.bounds
      });
      return overlappedArtboard ? overlappedArtboard.parent.data.id : this.state.layer.present.page;
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
            color: this.state.textSettings.fillColor
          },
          stroke: {
            ...DEFAULT_STYLE.stroke,
            enabled: false
          }
        },
        textStyle: {
          fontSize: this.state.textSettings.fontSize,
          leading: this.state.textSettings.leading,
          fontWeight: this.state.textSettings.fontWeight,
          fontFamily: this.state.textSettings.fontFamily,
          justification: this.state.textSettings.justification
        }
      }
    }) as any).then((textLayer: Btwx.Text) => {
      // get new layer bounds
      const topLeft = paperMain.view.projectToView(paperLayer.bounds.topLeft);
      const topCenter = paperMain.view.projectToView(paperLayer.bounds.topCenter);
      const topRight = paperMain.view.projectToView(paperLayer.bounds.topRight);
      // open text editor with new text layer props
      store.dispatch(openTextEditor({
        layer: textLayer.id,
        x: (() => {
          switch(this.state.textSettings.justification) {
            case 'left':
              return topLeft.x;
            case 'center':
              return topCenter.x;
            case 'right':
              return topRight.x;
          }
        })(),
        y: (() => {
          switch(this.state.textSettings.justification) {
            case 'left':
              return topLeft.y;
            case 'center':
              return topCenter.y;
            case 'right':
              return topRight.y;
          }
        })()
      }));
    });
    // store.dispatch(toggleTextToolThunk() as any);
  }
}

export default TextTool;