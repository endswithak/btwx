import paper, { Layer, Color, Raster, Point, SymbolDefinition, Group, GradientStop } from 'paper';
import chroma from 'chroma-js';
import StyleNode from './styleNode';

interface FillNodeProps {
  parent: string;
  paperParent: number;
  layer: string;
  paperShape: number;
  fillType: em.FillType;
  color?: string;
  opacity?: number;
  gradient?: em.Gradient;
  pattern?: em.Pattern;
  blendMode?: em.BlendingMode;
}

class FillNode extends StyleNode {
  fillType: em.FillType;
  color: string;
  opacity: number;
  gradient: em.Gradient;
  blendMode: em.BlendingMode;
  constructor({fillType, color, opacity, gradient, parent, layer, paperShape, paperParent}: FillNodeProps) {
    super({styleType: 'Fill', parent, layer, paperShape, paperParent});
    this.fillType = fillType;
    this.color = color ? chroma(color).alpha(1).hex() : '#999999';
    this.opacity = opacity ? color ? chroma(color).alpha() : 1 : 1;
    this.gradient = gradient;
    this.children = null;
    switch(this.fillType) {
      case 'Color':
        this.createColorFill();
        break;
      // case 'Gradient':
      //   this.createGradientFill();
      //   break;
    }
  }
  createColorFill() {
    this.paperItem().fillColor = new Color(this.color);
  }
  // createGradientFill() {
  //   const from = this.gradient.from;
  //   const to = this.gradient.to;
  //   const gradientStops = this.gradient.stops.map((gradientStop) => {
  //     return new GradientStop(new Color(gradientStop.color), gradientStop.position);
  //   }) as paper.GradientStop[];
  //   this.paperItem.fillColor = {
  //     gradient: {
  //       stops: gradientStops,
  //       radial: this.gradient.gradientType === 'Radial'
  //     },
  //     origin: new Point(this.paperItem.bounds.width * from.x, this.paperItem.bounds.height * from.y),
  //     destination: new Point(this.paperItem.bounds.width * to.x, this.paperItem.bounds.height * to.y)
  //   };
  // }
  // changeFillColor(color: string) {
  //   if (chroma.valid(color)) {
  //     this.color = color;
  //     this.paperItem.fillColor = color;
  //   }
  // }
  // changeFillOpacity(opacity: number) {
  //   if (opacity > 1) {
  //     this.opacity = 1;
  //     this.paperItem.opacity = 1;
  //   } else if (opacity < 0) {
  //     this.opacity = 0;
  //     this.paperItem.opacity = 0;
  //   } else {
  //     this.opacity = opacity;
  //     this.paperItem.opacity = opacity;
  //   }
  // }
}

export default FillNode;