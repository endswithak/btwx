import { paperMain } from './index';
import { THEME_GUIDE_COLOR } from '../constants';

class Guide {
  from: paper.Point;
  to: paper.Point;
  paperLayer: paper.Path.Line;
  constructor(from: paper.Point, to: paper.Point, removeOpts?: any) {
    const guide = new paperMain.Path.Line({
      from: from,
      to: to,
      strokeColor: THEME_GUIDE_COLOR,
      strokeWidth: 1 / paperMain.view.zoom
    });
    if (removeOpts) {
      guide.removeOn({
        ...removeOpts
      });
    }
    this.paperLayer = guide;
  }
}

export default Guide;