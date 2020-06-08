import { paperMain } from './index';
import { THEME_PRIMARY_COLOR } from '../constants';

class MeasureGuide {
  distance: string;
  from: paper.Point;
  to: paper.Point;
  paperLayer: paper.Group;
  constructor(distance: string, from: paper.Point, to: paper.Point, removeOpts?: any) {
    this.distance = distance;
    this.from = from;
    this.to = to;
    const guide = new paperMain.Path.Line({
      from: this.from,
      to: this.to,
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom
    });
    const guideText = new paperMain.PointText({
      fillColor: 'white',
      fontFamily: 'Space Mono',
      fontSize: 12 / paperMain.view.zoom,
      content: this.distance,
      justification: 'center'
    });
    const guideTextBackground = new paperMain.Path.Rectangle({
      point: guide.position,
      size: [guideText.bounds.width + 8, guideText.bounds.height + 8],
      fillColor: THEME_PRIMARY_COLOR
    });
    guideText.position = guideTextBackground.position;
    const guideGroup = new paperMain.Group({
      children: [guide, guideTextBackground, guideText]
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