import { paperMain } from './index';
import { THEME_GUIDE_COLOR } from '../constants';
import { getPaperLayer } from '../store/utils/paper';

class Guide {
  from: paper.Point;
  to: paper.Point;
  paperLayer: paper.Path.Line;
  constructor({from, to, removeOpts, guideType}: {from: paper.Point; to: paper.Point; guideType: 'snap' | 'static'; removeOpts?: any}) {
    const guide = new paperMain.Path.Line({
      from: from,
      to: to,
      strokeColor: THEME_GUIDE_COLOR,
      strokeWidth: 1 / paperMain.view.zoom,
      data: {
        id: 'Guide',
        type: 'UIElement',
        interactive: false,
        interactiveType: null,
        elementId: 'Guide',
        guideType: guideType
      },
      parent: (() => {
        switch(guideType) {
          case 'snap':
            return getPaperLayer('SnapGuides');
          case 'static':
            return getPaperLayer('StaticGuides');
        }
      })()
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