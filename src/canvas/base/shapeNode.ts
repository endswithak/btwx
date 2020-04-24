import paper from 'paper';
import LayerNode from './layerNode';
import FillNode from './fillNode';
import StyleGroupNode from './styleGroupNode';

interface ShapeNodeProps {
  parent: string;
  paperParent: number;
  shapeType: 'Rectangle' | 'Rounded' | 'Ellipse' | 'Polygon' | 'Star' | 'Custom';
  paperShape: paper.Path | paper.CompoundPath;
  name?: string;
}

class ShapeNode extends LayerNode {
  shapeType: 'Rectangle' | 'Rounded' | 'Ellipse' | 'Polygon' | 'Star' | 'Custom';
  paperShape: number;
  constructor({shapeType, name, parent, paperShape, paperParent}: ShapeNodeProps) {
    super({name: name ? name : shapeType, layerType: 'Shape', parent, paperParent});
    this.shapeType = shapeType;
    this.children = null;
    paperShape.data = {
      id: `[shape]${this.id}`,
      layerId: this.id
    }
    paperShape.parent = this.paperItem();
    this.paperShape = paperShape.id;
  }
}

export default ShapeNode;