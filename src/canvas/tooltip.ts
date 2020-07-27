import { paperMain } from './index';

class Tooltip {
  paperLayer: paper.Group;
  text: string;
  point: paper.Point;
  constructor(text: string, point: paper.Point, removeOpts?: any) {
    this.point = point;
    this.text = text;
    const tooltipText = new paperMain.PointText({
      fillColor: 'white',
      fontFamily: 'Space Mono',
      fontSize: 12 / paperMain.view.zoom,
      content: this.text
    });
    const tooltipBackground = new paperMain.Path.Rectangle({
      point: [this.point.x + (24 / paperMain.view.zoom), this.point.y + (24 / paperMain.view.zoom)],
      size: [tooltipText.bounds.width + (12 / paperMain.view.zoom), tooltipText.bounds.height + (12 / paperMain.view.zoom)],
      fillColor: new paperMain.Color(0,0,0,0.5),
      radius: (4 / paperMain.view.zoom),
    });
    tooltipText.position = tooltipBackground.position;
    const tooltipGroup = new paperMain.Group({
      children: [tooltipBackground, tooltipText]
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