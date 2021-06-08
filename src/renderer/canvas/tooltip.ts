import { paperMain } from '../canvas';

class Tooltip {
  paperLayer: paper.Group;
  text: string;
  point: paper.Point;
  constructor(text: string, point: paper.Point, removeOpts?: any) {
    if (paperMain.project.activeLayer.data.id !== 'ui') {
      paperMain.projects[0].activate();
    }
    this.point = point;
    this.text = text;
    const parent = paperMain.project.getItem({data: { id: 'tooltips' }});
    const tooltipText = new paperMain.PointText({
      fillColor: 'white',
      fontFamily: 'Space Mono',
      fontSize: 12 / paperMain.view.zoom,
      content: this.text,
      data: {
        type: 'UIElementChild',
        interactive: false,
        interactiveType: null,
        elementId: 'tooltip'
      }
    });
    const tooltipBackground = new paperMain.Path.Rectangle({
      point: [this.point.x + (24 / paperMain.view.zoom), this.point.y + (24 / paperMain.view.zoom)],
      size: [tooltipText.bounds.width + (12 / paperMain.view.zoom), tooltipText.bounds.height + (12 / paperMain.view.zoom)],
      fillColor: new paperMain.Color(0,0,0,0.5),
      radius: (4 / paperMain.view.zoom),
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