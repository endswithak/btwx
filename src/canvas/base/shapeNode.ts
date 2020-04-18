import paper from 'paper';
import LayerNode from './layerNode';
import FillNode from './fillNode';
import StyleGroupNode from './styleGroupNode';

interface ShapeNodeProps {
  shapeType: 'Rectangle' | 'Rounded' | 'Ellipse' | 'Polygon' | 'Star' | 'Custom';
  paperPath: paper.Path | paper.CompoundPath;
  fills?: em.Fill[];
  name?: string;
}

class ShapeNode extends LayerNode {
  fills: StyleGroupNode;
  shapeType: 'Rectangle' | 'Rounded' | 'Ellipse' | 'Polygon' | 'Star' | 'Custom';
  paperPath: paper.Path | paper.CompoundPath;
  shapeIcon: string;
  constructor({paperPath, shapeType, name, fills}: ShapeNodeProps) {
    super({name: name ? name : shapeType, layerType: 'Shape'});
    this.canHaveLayers = false;
    this.shapeType = shapeType;
    this.paperPath = paperPath;
    this.shapeIcon = this.createShapeIcon();
    this.fills = this.createFills(fills);
  }
  createFills(fills: em.Fill[]) {
    const shapeFills = this.addChild({
      node: new StyleGroupNode({styleGroupType: 'Fills'})
    }) as StyleGroupNode;
    if (fills && fills.length > 0) {
      fills.forEach((fill: em.Fill) => {
        shapeFills.addChild({
          node: new FillNode({
            fillType: fill.fillType,
            color: fill.color,
            gradient: fill.gradient,
            pattern: fill.pattern,
            paperPath: this.paperPath
          })
        })
      });
    } else {
      shapeFills.addChild({
        node: new FillNode({
          fillType: 'Color',
          paperPath: this.paperPath
        })
      });
      shapeFills.addChild({
        node: new FillNode({
          fillType: 'Color',
          color: 'red',
          paperPath: this.paperPath
        })
      });
    }
    return shapeFills;
  }
  createShapeIcon() {
    const shapeClone = this.paperPath.clone();
    shapeClone.fitBounds(new paper.Rectangle({
      point: [0,0],
      size: [16,16]
    }));
    const shapeSvg = shapeClone.exportSVG({asString: true}) as string;
    const svgPathSearch = 'd="';
    const svgPathIndex = shapeSvg.indexOf(svgPathSearch);
    const splitSvgPath = shapeSvg.substring(svgPathIndex + svgPathSearch.length, shapeSvg.length - 1);
    const svgPathEndIndex = splitSvgPath.indexOf('"');
    return splitSvgPath.substring(0, svgPathEndIndex);
  }
}

export default ShapeNode;