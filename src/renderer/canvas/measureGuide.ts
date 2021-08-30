import { paperMain } from '../canvas';
import { THEME_PRIMARY_COLOR } from '../constants';
import { measureFrameId } from '../components/MeasureFrame';

class MeasureGuide {
  guide: 'top' | 'bottom' | 'left' | 'right';
  from: paper.Point;
  to: paper.Point;
  distance: number;
  paperLayer: paper.Group;
  constructor(from: paper.Point, to: paper.Point, guide: 'top' | 'bottom' | 'left' | 'right', removeOpts?: any) {
    if (paperMain.project.activeLayer.data.id !== 'ui') {
      paperMain.projects[0].activate();
    }
    this.from = from;
    this.to = to;
    this.guide = guide;
    const measureGuideLine = new paperMain.Path.Line({
      from: this.from,
      to: this.to,
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      data: {
        id: 'measureGuideLine',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      }
    });
    this.distance = Math.round(measureGuideLine.length);
    const measureGuideLineStartLeg = new paperMain.Path.Line({
      from: this.guide === 'top' || this.guide === 'bottom' ? new paperMain.Point(this.from.x - ((1 / paperMain.view.zoom) * 4), this.from.y) : new paperMain.Point(this.from.x, this.from.y - ((1 / paperMain.view.zoom) * 4)),
      to: this.guide === 'top' || this.guide === 'bottom' ? new paperMain.Point(this.from.x + ((1 / paperMain.view.zoom) * 4), this.from.y) : new paperMain.Point(this.from.x, this.from.y + ((1 / paperMain.view.zoom) * 4)),
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      data: {
        id: 'measureGuideStartLeg',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      }
    });
    const measureGuideLineEndLeg = new paperMain.Path.Line({
      from: this.guide === 'top' || this.guide === 'bottom' ? new paperMain.Point(this.to.x - ((1 / paperMain.view.zoom) * 4), this.to.y) : new paperMain.Point(this.to.x, this.to.y - ((1 / paperMain.view.zoom) * 4)),
      to: this.guide === 'top' || this.guide === 'bottom' ? new paperMain.Point(this.to.x + ((1 / paperMain.view.zoom) * 4), this.to.y) : new paperMain.Point(this.to.x, this.to.y + ((1 / paperMain.view.zoom) * 4)),
      strokeColor: THEME_PRIMARY_COLOR,
      strokeWidth: 1 / paperMain.view.zoom,
      insert: false,
      data: {
        id: 'measureGuideEndLeg',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      }
    });
    const measureGuideText = new paperMain.PointText({
      fillColor: 'white',
      fontFamily: 'Space Mono',
      fontSize: 10 / paperMain.view.zoom,
      content: this.distance,
      justification: 'center',
      insert: false,
      data: {
        id: 'measureGuideText',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      }
    });
    const measureGuideTextBackground = new paperMain.Path.Rectangle({
      point: measureGuideLine.bounds.center,
      size: [measureGuideText.bounds.width + (8 / paperMain.view.zoom), measureGuideText.bounds.height + (8 / paperMain.view.zoom)],
      fillColor: THEME_PRIMARY_COLOR,
      radius: (4 / paperMain.view.zoom),
      insert: false,
      data: {
        id: 'measureGuideBackground',
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      }
    });
    measureGuideTextBackground.position = measureGuideLine.bounds.center;
    measureGuideText.position = measureGuideTextBackground.position;
    const measureGuide = new paperMain.Group({
      children: [measureGuideLineStartLeg, measureGuideLine, measureGuideLineEndLeg, measureGuideTextBackground, measureGuideText],
      data: {
        id: 'measureGuide',
        type: 'UIElement',
        interactive: false,
        interactiveType: null,
        elementId: measureFrameId,
        guide: this.guide
      },
      parent: paperMain.project.getItem({data: {id: measureFrameId}})
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