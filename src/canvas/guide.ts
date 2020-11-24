import { paperMain } from './index';
import { THEME_GUIDE_COLOR } from '../constants';

class Guide {
  from: paper.Point;
  to: paper.Point;
  paperLayer: paper.Path.Line;
  constructor({from, to, removeOpts, guideType}: {from: paper.Point; to: paper.Point; guideType: 'snap' | 'static'; removeOpts?: any}) {
    const guide = new paperMain.Path.Line({
      from: from,
      to: to,
      strokeColor: THEME_GUIDE_COLOR,
      strokeWidth: 1 / paperMain.projects[0].view.zoom,
      data: {
        id: `${guideType}Guide`,
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: `${guideType}Guide`
      },
      parent: (() => {
        switch(guideType) {
          case 'snap':
            return paperMain.projects[1].getItem({data: { id: 'snapGuides' }});
          case 'static':
            return paperMain.projects[1].getItem({data: { id: 'staticGuides' }});
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