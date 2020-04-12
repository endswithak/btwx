import paper, { Layer, Group, Path } from 'paper';
import PaperLayer from './layer';
import TreeNode from './treeNode';

interface PaperPageProps {
  dispatch?: any;
  name?: string;
}

class PaperPage extends TreeNode {
  constructor({dispatch}: PaperPageProps) {
    super({name, type: 'Page'});
    this.interactive = true;
    this.paperItem = new Group({
      data: {
        node: this
      }
    });
  }
}

export default PaperPage;