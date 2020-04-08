import paper, { Layer, Color, Raster, Point, SymbolDefinition, Group, GradientStop } from 'paper';
import PaperFill from './fill';

interface PaperFillsProps {
  fills: em.Fill[];
  shape: paper.Path | paper.CompoundPath;
  layerOpts: any;
}

class PaperFills {
  layer: paper.Group;
  shape: paper.Path | paper.CompoundPath;
  fills: PaperFill[];
  constructor({fills, shape, layerOpts}: PaperFillsProps) {
    this.shape = shape;
    this.layer = new Group({
      name: 'fills',
      ...layerOpts
    });
    // fills.forEach((fill: em.Fill) => {
    //   const paperFill = new PaperFill({
    //     fill: fill,
    //     shape: shape,
    //     layerProps: {
    //       parent: this.layer
    //     }
    //   });
    //   this.fills.push(paperFill);
    // });
  }
}

export default PaperFills