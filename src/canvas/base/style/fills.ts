import paper, { Layer, Color, Raster, Point, SymbolDefinition, Group, GradientStop } from 'paper';
import PaperFill from './fill';
import PaperStyle from '../style';
import PaperGroup from '../group';
import TreeNode from '../treeNode';

interface PaperFillsProps {
  fills: em.Fill[];
  shape: paper.Path | paper.CompoundPath;
}

class PaperFills extends TreeNode {
  constructor({fills, shape}: PaperFillsProps) {
    super({name: 'Fills', type: 'Style'});
    this.paperItem = new Group({
      data: {
        node: this
      }
    });
    if (fills.length > 0) {
      fills.forEach((fill: em.Fill) => {
        this.addChild({
          node: new PaperFill({
            fill: fill,
            shape: shape
          })
        });
      });
    }
  }
}

export default PaperFills