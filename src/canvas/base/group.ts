import paper, { Layer, Group, Path } from 'paper';
import PaperLayer from './layer';
import PaperStyle from './style';
import PaperShape from './shape';
import PaperArtboard from './artboard';
import PaperFill from './style/fill';
import PaperFills from './style/fills';
import PaperPage from './page';
import TreeNode from './treeNode';

interface PaperGroupProps {
  layers?: TreeNode[];
  dispatch?: any;
  name?: string;
}

class PaperGroup extends TreeNode {
  constructor({dispatch, name, layers}: PaperGroupProps) {
    super({name, type: 'Group'});
    this.interactive = true;
    this.paperItem = new Group({
      data: {
        node: this
      }
    });
    if (layers && layers.length > 0) {
      layers.forEach((layer) => {
        this.addChild({
          node: layer
        });
      });
    }
  }
}

export default PaperGroup;