import { paperMain } from './index';
import { THEME_PRIMARY_COLOR } from '../constants';

class MeasureGuide {
  guide: 'top' | 'bottom' | 'left' | 'right';
  from: paper.Point;
  to: paper.Point;
  distance: number;
  paperLayer: paper.Group;
  constructor(from: paper.Point, to: paper.Point, guide: 'top' | 'bottom' | 'left' | 'right', removeOpts?: any) {
    this.from = from;
    this.to = to;
    this.guide = guide;
    const guideLine = new paperMain.Path.Line({
      from: this.from,
      to: this.to,
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      data: {
        id: 'measureFrameGuideElement',
        element: 'guide',
        guide: this.guide
      }
    });
    this.distance = Math.round(guideLine.length);
    const guideLineCap = new paperMain.Path.Line({
      from: this.guide === 'top' || this.guide === 'bottom' ? new paperMain.Point(this.to.x - ((1 / paperMain.view.zoom) * 4), this.to.y) : new paperMain.Point(this.to.x, this.to.y - ((1 / paperMain.view.zoom) * 4)),
      to: this.guide === 'top' || this.guide === 'bottom' ? new paperMain.Point(this.to.x + ((1 / paperMain.view.zoom) * 4), this.to.y) : new paperMain.Point(this.to.x, this.to.y + ((1 / paperMain.view.zoom) * 4)),
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      data: {
        id: 'measureFrameGuideElement',
        element: 'guideCap',
        guide: this.guide
      }
    });
    const guideText = new paperMain.PointText({
      fillColor: 'white',
      fontFamily: 'Space Mono',
      fontSize: 10 / paperMain.view.zoom,
      content: this.distance,
      justification: 'center',
      insert: false,
      data: {
        id: 'measureFrameGuideElement',
        element: 'text',
        guide: this.guide
      }
    });
    const guideTextBackground = new paperMain.Path.Rectangle({
      point: guideLine.bounds.center,
      size: [guideText.bounds.width + (10 / paperMain.view.zoom), guideText.bounds.height + (10 / paperMain.view.zoom)],
      fillColor: THEME_PRIMARY_COLOR,
      radius: (4 / paperMain.view.zoom),
      insert: false,
      data: {
        id: 'measureFrameGuideElement',
        element: 'textBackground',
        guide: this.guide
      }
    });
    guideTextBackground.position = guideLine.bounds.center;
    guideText.position = guideTextBackground.position;
    const guideGroup = new paperMain.Group({
      children: [guideLine, guideLineCap, guideTextBackground, guideText],
      data: {
        id: 'measureFrameGuide',
        guide: this.guide
      },
      insert: false
    });
    if (removeOpts) {
      guideGroup.removeOn({
        ...removeOpts
      });
    }
    this.paperLayer = guideGroup;
  }
}

export default MeasureGuide;