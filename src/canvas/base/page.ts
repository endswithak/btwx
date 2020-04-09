import paper, { Layer, Group, Path } from 'paper';
import PaperLayer from './layer';
import PaperShape from './shape';
import PaperGroup from './group';

interface PaperPageProps {
  dispatch: any;
}

class PaperPage extends PaperGroup {
  constructor({dispatch}: PaperPageProps) {
    super({dispatch, parent: null});
    this.type = 'Page';
    this.name = 'Page';
  }
}

export default PaperPage;