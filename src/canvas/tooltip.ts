import { uiPaperScope } from '../canvas';

class Tooltip {
  paperLayer: paper.Group;
  text: string;
  point: paper.Point;
  constructor(text: string, point: paper.Point, removeOpts?: any) {
    this.point = point;
    this.text = text;
    const parent = uiPaperScope.project.getItem({data: { id: 'tooltips' }});
    const tooltipText = new uiPaperScope.PointText({
      fillColor: 'white',
      fontFamily: 'Space Mono',
      fontSize: 12 / uiPaperScope.view.zoom,
      content: this.text,
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'tooltip'
      }
    });
    const tooltipBackground = new uiPaperScope.Path.Rectangle({
      point: [this.point.x + (24 / uiPaperScope.view.zoom), this.point.y + (24 / uiPaperScope.view.zoom)],
      size: [tooltipText.bounds.width + (12 / uiPaperScope.view.zoom), tooltipText.bounds.height + (12 / uiPaperScope.view.zoom)],
      fillColor: new uiPaperScope.Color(0,0,0,0.5),
      radius: (4 / uiPaperScope.view.zoom),
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'tooltip'
      }
    });
    tooltipText.position = tooltipBackground.position;
    const tooltipGroup = new uiPaperScope.Group({
      children: [tooltipBackground, tooltipText],
      data: {
        id: 'tooltip',
        type: 'UIElement',
        interactive: false,
        interactiveType: null,
        elementId: 'tooltip'
      },
      parent: parent
    });
    if (removeOpts) {
      tooltipGroup.removeOn({
        ...removeOpts
      });
    }
    this.paperLayer = tooltipGroup;
  }
}

export default Tooltip;