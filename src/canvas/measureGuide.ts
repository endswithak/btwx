import { uiPaperScope } from '../canvas';
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
    const measureGuideLine = new uiPaperScope.Path.Line({
      from: this.from,
      to: this.to,
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / uiPaperScope.view.zoom,
      insert: false,
      data: {
        id: 'measureGuideLine',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'measureFrame',
        guide: this.guide
      }
    });
    this.distance = Math.round(measureGuideLine.length);
    const measureGuideLineStartLeg = new uiPaperScope.Path.Line({
      from: this.guide === 'top' || this.guide === 'bottom' ? new uiPaperScope.Point(this.from.x - ((1 / uiPaperScope.view.zoom) * 4), this.from.y) : new uiPaperScope.Point(this.from.x, this.from.y - ((1 / uiPaperScope.view.zoom) * 4)),
      to: this.guide === 'top' || this.guide === 'bottom' ? new uiPaperScope.Point(this.from.x + ((1 / uiPaperScope.view.zoom) * 4), this.from.y) : new uiPaperScope.Point(this.from.x, this.from.y + ((1 / uiPaperScope.view.zoom) * 4)),
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / uiPaperScope.view.zoom,
      insert: false,
      data: {
        id: 'measureGuideStartLeg',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'measureFrame',
        guide: this.guide
      }
    });
    const measureGuideLineEndLeg = new uiPaperScope.Path.Line({
      from: this.guide === 'top' || this.guide === 'bottom' ? new uiPaperScope.Point(this.to.x - ((1 / uiPaperScope.view.zoom) * 4), this.to.y) : new uiPaperScope.Point(this.to.x, this.to.y - ((1 / uiPaperScope.view.zoom) * 4)),
      to: this.guide === 'top' || this.guide === 'bottom' ? new uiPaperScope.Point(this.to.x + ((1 / uiPaperScope.view.zoom) * 4), this.to.y) : new uiPaperScope.Point(this.to.x, this.to.y + ((1 / uiPaperScope.view.zoom) * 4)),
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / uiPaperScope.view.zoom,
      insert: false,
      data: {
        id: 'measureGuideEndLeg',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'measureFrame',
        guide: this.guide
      }
    });
    const measureGuideText = new uiPaperScope.PointText({
      fillColor: 'white',
      fontFamily: 'Space Mono',
      fontSize: 10 / uiPaperScope.view.zoom,
      content: this.distance,
      justification: 'center',
      insert: false,
      data: {
        id: 'measureGuideText',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'measureFrame',
        guide: this.guide
      }
    });
    const measureGuideTextBackground = new uiPaperScope.Path.Rectangle({
      point: measureGuideLine.bounds.center,
      size: [measureGuideText.bounds.width + (8 / uiPaperScope.view.zoom), measureGuideText.bounds.height + (8 / uiPaperScope.view.zoom)],
      fillColor: THEME_PRIMARY_COLOR,
      radius: (4 / uiPaperScope.view.zoom),
      insert: false,
      data: {
        id: 'measureGuideBackground',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'measureFrame',
        guide: this.guide
      }
    });
    measureGuideTextBackground.position = measureGuideLine.bounds.center;
    measureGuideText.position = measureGuideTextBackground.position;
    const measureGuide = new uiPaperScope.Group({
      children: [measureGuideLineStartLeg, measureGuideLine, measureGuideLineEndLeg, measureGuideTextBackground, measureGuideText],
      data: {
        id: 'measureGuide',
        type: 'UIElement',
        interactive: false,
        interactiveType: null,
        elementId: 'measureFrame',
        guide: this.guide
      },
      parent: uiPaperScope.project.getItem({data: {id: 'measureGuides'}})
    });
    if (removeOpts) {
      measureGuide.removeOn({
        ...removeOpts
      });
    }
    this.paperLayer = measureGuide;
  }
}

export default MeasureGuide;