import paper from 'paper';
import { uiPaperScope } from '../canvas';
import { THEME_GUIDE_COLOR } from '../constants';

class Guide {
  from: paper.Point;
  to: paper.Point;
  paperLayer: paper.Path.Line;
  constructor({from, to, removeOpts, guideType}: {from: paper.Point; to: paper.Point; guideType: 'snap' | 'static'; removeOpts?: any}) {
    if (uiPaperScope.project.activeLayer.data.id !== 'ui') {
      uiPaperScope.projects[0].activate();
    }
    const guide = new uiPaperScope.Path.Line({
      from: from,
      to: to,
      strokeColor: THEME_GUIDE_COLOR,
      strokeWidth: 1 / uiPaperScope.view.zoom,
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
            return uiPaperScope.project.getItem({data: { id: 'snapGuides' }});
          case 'static':
            return uiPaperScope.project.getItem({data: { id: 'staticGuides' }});
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