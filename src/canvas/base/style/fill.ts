import paper, { Layer, Color, Raster, Point, SymbolDefinition, Group, GradientStop } from 'paper';
import chroma from 'chroma-js';

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
  layerProps: any;
}

class PaperFill {
  fill: Fill;
  shape: paper.Path | paper.CompoundPath;
  layer: paper.Layer;
  fillLayer: paper.Path | paper.CompoundPath | paper.Raster;
  constructor({fill, shape, layerProps}: PaperFillProps) {
    this.fill = fill;
    this.shape = shape;
    this.layer = new Layer({
      name: 'fill',
      visible: fill.enabled,
      ...layerProps
    });
    switch(fill.fillType) {
      case 'Color':
        this.colorFill();
        break;
      case 'Gradient':
        this.gradientFill();
        break;
      case 'Pattern':
        this.patternFill();
        break;
    }
  }
  colorFill() {
    this.fillLayer = this.shape.clone() as paper.Path | paper.CompoundPath;
    this.fillLayer.parent = this.layer;
    this.fillLayer.fillColor = new Color(this.fill.color);
  }
  updateColor(color: string) {
    if (chroma.valid(color)) {
      this.fill.color = color;
      this.fillLayer.fillColor = new Color(this.fill.color);
    } else {
      throw new Error(`Invalid Fill Color: ${color}`);
    }
  }
  gradientFill() {
    this.fillLayer = this.shape.clone() as paper.Path | paper.CompoundPath;
    this.fillLayer.parent = this.layer;
    const from = this.fill.gradient.from;
    const to = this.fill.gradient.to;
    const gradientStops = this.fill.gradient.stops.map((gradientStop) => {
      return new GradientStop(new Color(gradientStop.color), gradientStop.position);
    }) as paper.GradientStop[];
    this.fillLayer.fillColor = {
      gradient: {
        stops: gradientStops,
        radial: this.fill.gradient.gradientType === 'Radial'
      },
      origin: new Point(this.fillLayer.bounds.width * from.x, this.fillLayer.bounds.height * from.y),
      destination: new Point(this.fillLayer.bounds.width * to.x, this.fillLayer.bounds.height * to.y)
    };
  }
  patternFill() {
    const patternGroup = new Group();
    const patternMask = this.shape.clone();
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
      this.fillLayer = patternGroup.rasterize();
      this.fillLayer.parent = this.layer;
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