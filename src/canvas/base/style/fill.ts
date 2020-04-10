import paper, { Layer, Color, Raster, Point, SymbolDefinition, Group, GradientStop } from 'paper';
import chroma from 'chroma-js';
import PaperLayer from '../layer';
import PaperFills from './fills';
import PaperShape from '../shape';

export class Fill {
  fillType?: em.FillType;
  color?: string;
  gradient?: em.Gradient;
  pattern?: em.Pattern;
  enabled?: boolean;
  constructor({fillType, color, gradient, pattern, enabled}: em.Fill) {
    this.enabled = enabled ? enabled : true;
    this.fillType = fillType ? fillType : 'Color';
    this.color = color ? color : '#999';
    this.gradient = {
      gradientType: 'Linear',
      from: {x: 0, y: 0},
      to: {x: 1, y: 1},
      stops: [{position: 0, color: '#000'}, {position: 1, color: '#fff'}],
      aspectRatio: 1,
      ...gradient
    }
    this.pattern = {
      patternType: 'Fill',
      image: '',
      tileScale: 1,
      ...pattern
    }
  }
}

interface PaperFillProps {
  fill: Fill;
  shape: paper.Path | paper.CompoundPath;
  parent: any;
}

class PaperFill extends PaperLayer {
  paperItemShape: paper.Path | paper.CompoundPath;
  fill: Fill;
  constructor({fill, shape, parent}: PaperFillProps) {
    super({parent});
    this.fill = fill;
    this.interactive = false;
    switch(fill.fillType) {
      case 'Color':
        this.colorFill(shape);
        break;
      case 'Gradient':
        this.gradientFill(shape);
        break;
      case 'Pattern':
        this.patternFill(shape);
        break;
    }
  }
  colorFill(shape: paper.Path | paper.CompoundPath) {
    this.paperItem = shape.clone() as paper.Path | paper.CompoundPath;
    this.paperItem.fillColor = new Color(this.fill.color);
    this.paperItem.data.layer = this;
  }
  // updateColor(color: string) {
  //   if (chroma.valid(color)) {
  //     this.fill.color = color;
  //     this.paperItemFill.fillColor = new Color(this.fill.color);
  //   } else {
  //     throw new Error(`Invalid Fill Color: ${color}`);
  //   }
  // }
  gradientFill(shape: paper.Path | paper.CompoundPath) {
    this.paperItem = this.paperItemShape.clone() as paper.Path | paper.CompoundPath;
    const from = this.fill.gradient.from;
    const to = this.fill.gradient.to;
    const gradientStops = this.fill.gradient.stops.map((gradientStop) => {
      return new GradientStop(new Color(gradientStop.color), gradientStop.position);
    }) as paper.GradientStop[];
    this.paperItem.fillColor = {
      gradient: {
        stops: gradientStops,
        radial: this.fill.gradient.gradientType === 'Radial'
      },
      origin: new Point(this.paperItem.bounds.width * from.x, this.paperItem.bounds.height * from.y),
      destination: new Point(this.paperItem.bounds.width * to.x, this.paperItem.bounds.height * to.y)
    };
    this.paperItem.data.layer = this;
  }
  patternFill(shape: paper.Path | paper.CompoundPath) {
    const patternGroup = new Group();
    const patternMask = this.paperItemShape.clone();
    patternMask.parent = patternGroup;
    patternMask.name = 'mask';
    patternMask.clipMask = true;
    const pattern = new Raster(this.fill.pattern.image);
    pattern.name = 'pattern';
    pattern.onLoad = (): void => {
      switch(this.fill.pattern.patternType) {
        case 'Tile': {
          const bitmapSymbol = new SymbolDefinition(pattern);
          const rows = Math.ceil(patternMask.bounds.height / pattern.height);
          const columns = Math.ceil(patternMask.bounds.width / pattern.width);
          for(let i = 0; i < rows; i++) {
            for(let j = 0; j < columns; j++) {
              const bitmapInstance = bitmapSymbol.place();
              bitmapInstance.parent = patternGroup;
              bitmapInstance.position.x = (patternMask.bounds.topLeft.x + pattern.width / 2) + (pattern.width * j);
              bitmapInstance.position.y = (patternMask.bounds.topLeft.y + pattern.height / 2) + (pattern.height * i);
            }
          }
          break;
        }
        case 'Fill': {
          const fillSize = this.getFillSize({
            imageWidth: pattern.width,
            imageHeight: pattern.height,
            shapeWidth: patternMask.bounds.width,
            shapeHeight: patternMask.bounds.height
          });
          pattern.parent = patternGroup;
          pattern.width = fillSize.width;
          pattern.height = fillSize.height;
          pattern.position = patternMask.bounds.center;
          break;
        }
        case 'Stretch':
          pattern.parent = patternGroup;
          pattern.width = patternMask.bounds.width;
          pattern.height = patternMask.bounds.height;
          pattern.position = patternMask.bounds.center;
          break;
        case 'Fit': {
          const fitSize = this.getFitSize({
            imageWidth: pattern.width,
            imageHeight: pattern.height,
            shapeWidth: patternMask.bounds.width,
            shapeHeight: patternMask.bounds.height
          });
          pattern.parent = patternGroup;
          pattern.width = fitSize.width;
          pattern.height = fitSize.height;
          pattern.position = patternMask.bounds.center;
          break;
        }
      }
      this.paperItem = patternGroup.rasterize();
      this.paperItem.data.layer = this;
    }
  }
  getFillSize({imageWidth, imageHeight, shapeWidth, shapeHeight}: {imageWidth: number; imageHeight: number; shapeWidth: number; shapeHeight: number}) {
    const maxWidth: number = Math.max(shapeWidth, imageWidth);
    const maxHeight: number = Math.max(shapeHeight, imageHeight);
    const maxRatio: number = maxWidth / maxHeight;
    const layerRatio: number = imageWidth / imageHeight;
    if (maxRatio > layerRatio) {
      // height is the constraining dimension
      return {
        width: shapeWidth,
        height: imageHeight * (shapeWidth / imageWidth)
      }
    } else {
      // width is the constraining dimension
      return {
        width: imageWidth * (shapeHeight / imageHeight),
        height: shapeHeight
      }
    }
  }
  getFitSize({imageWidth, imageHeight, shapeWidth, shapeHeight}: {imageWidth: number; imageHeight: number; shapeWidth: number; shapeHeight: number}) {
    const maxWidth: number = Math.max(shapeWidth, imageWidth);
    const maxHeight: number = Math.max(shapeHeight, imageHeight);
    const maxRatio: number = maxWidth / maxHeight;
    const layerRatio: number = imageWidth / imageHeight;
    if (maxRatio > layerRatio) {
      // height is the constraining dimension
      return {
        width: shapeHeight * layerRatio,
        height: shapeHeight
      }
    } else {
      // width is the constraining dimension
      return {
        width: shapeWidth,
        height: shapeWidth * layerRatio
      }
    }
  }
}

export default PaperFill;