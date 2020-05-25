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
      point: [this.point.x + (30 / paperMain.view.zoom), this.point.y + (30 / paperMain.view.zoom)],
      size: [tooltipText.bounds.width + 8, tooltipText.bounds.height + 8],
      fillColor: new paperMain.Color(0,0,0,0.75)
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