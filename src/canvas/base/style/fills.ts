import paper, { Layer, Color, Raster, Point, SymbolDefinition, Group, GradientStop } from 'paper';
import PaperFill from './fill';
import PaperStyle from '../style';
import PaperGroup from '../group';

interface PaperFillsProps {
  fills: em.Fill[];
  shape: paper.Path | paper.CompoundPath;
  parent: any;
}

class PaperFills extends PaperGroup {
  constructor({fills, shape, parent}: PaperFillsProps) {
    super({parent});
    this.interactive = false;
    this.paperItem.data.interactive = this.interactive;
    this.name = 'Fills';
    if (fills.length > 0) {
      fills.forEach((fill: em.Fill) => {
        this.addLayer({
          layer: new PaperFill({
            fill: fill,
            shape: shape,
            parent: this
          })
        });
      });
    }
  }
}

export default PaperFills