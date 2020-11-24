import { paperMain } from './index';

class Tooltip {
  paperLayer: paper.Group;
  text: string;
  point: paper.Point;
  constructor(text: string, point: paper.Point, removeOpts?: any) {
    this.point = point;
    this.text = text;
    const parent = paperMain.projects[1].getItem({data: { id: 'tooltips' }});
    const tooltipText = new paperMain.PointText({
      fillColor: 'white',
      fontFamily: 'Space Mono',
      fontSize: 12 / paperMain.projects[0].view.zoom,
      content: this.text,
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'tooltip'
      }
    });
    const tooltipBackground = new paperMain.Path.Rectangle({
      point: [this.point.x + (24 / paperMain.projects[0].view.zoom), this.point.y + (24 / paperMain.projects[0].view.zoom)],
      size: [tooltipText.bounds.width + (12 / paperMain.projects[0].view.zoom), tooltipText.bounds.height + (12 / paperMain.projects[0].view.zoom)],
      fillColor: new paperMain.Color(0,0,0,0.5),
      radius: (4 / paperMain.projects[0].view.zoom),
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'tooltip'
      }
    });
    tooltipText.position = tooltipBackground.position;
    const tooltipGroup = new paperMain.Group({
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