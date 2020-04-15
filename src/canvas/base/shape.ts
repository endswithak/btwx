import { v4 as uuidv4 } from 'uuid';
import paper, { Layer, Group, Rectangle } from 'paper';
import PaperStyle from './style';
import TreeNode from './treeNode';

interface PaperShapeProps {
  shape: paper.Path | paper.CompoundPath;
  dispatch?: any;
  name?: string;
  style?: {
    fills?: em.Fill[];
  };
}

class PaperShape extends TreeNode {
  shape: paper.Path | paper.CompoundPath;
  style: PaperStyle;
  constructor({shape, style, name}: PaperShapeProps) {
    super({name, type: 'Shape'});
    this.canHaveChildren = false;
    this.interactive = true;
    this.shape = shape;
    const poop = this.shape.clone();
    poop.fitBounds(new Rectangle({
      point: [0,0],
      size: [16,16]
    }));
    const shapeSvg = poop.exportSVG({asString: true}) as string;
    const svgPathIndex = shapeSvg.indexOf('d="');
    const splitSvgPath = shapeSvg.substring(svgPathIndex + 3, shapeSvg.length - 1);
    const svgPathEndIndex = splitSvgPath.indexOf('"');
    const finalPath = splitSvgPath.substring(0, svgPathEndIndex);
    this.preview = finalPath;
    this.paperItem = new Layer({
      data: {
        node: this
      }
    });
    this.style = this.addChild({
      node: new PaperStyle({
        style: {
          fills: style.fills ? style.fills : [],
        },
        shape: this.shape
      })
    });
  }
}

export default PaperShape;