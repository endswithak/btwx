import paper, { Layer, PointText, AreaText, Rectangle, Shape } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { textUtils, fillUtils, borderUtils, shadowUtils, contextUtils, frameUtils } from './utils';

interface RenderText {
  layer: FileFormat.Text;
  container: paper.Group;
  images: {
    [id: string]: string;
  };
  path: string;
  groupShadows?: FileFormat.Shadow[];
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

const renderText = ({ layer, container, images, path, groupShadows, overrides, symbolPath }: RenderText): paper.Layer => {
  const textContainer = new Layer({
    name: layer.do_objectID,
    data: {
      name: layer.name,
      path: path
    },
    locked: layer.isLocked,
    visible: layer.isVisible,
    parent: container,
    blendMode: contextUtils.getBlendMode({
      blendMode: layer.style.contextSettings.blendMode
    }),
    opacity: layer.style.contextSettings.opacity
  });
  const override = textUtils.getOverrideString({
    overrides: overrides,
    symbolPath: symbolPath
  });
  const fontAttrs = textUtils.getFontAttributes({
    textStyle: layer.style.textStyle
  });
  const textAttrs = {
    point: textUtils.getTextPoint({
      justfication: fontAttrs.alignment,
      width: layer.frame.width
    }),
    content: textUtils.getTextTransformString({
      str: override ? override.value as string : layer.attributedString.string,
      textTransform: fontAttrs.textTransform
    }),
    parent: textContainer,
    fillColor: fontAttrs.color,
    fontWeight: `${fontAttrs.fontStyle} ${fontAttrs.fontWeight}`,
    fontStretch: fontAttrs.fontStretch,
    fontFamily: fontAttrs.fontFamily,
    justification: fontAttrs.alignment,
    fontSize: fontAttrs.fontSize,
    leading: fontAttrs.lineHeight,
    letterSpacing: fontAttrs.letterSpacing
  }
  shadowUtils.renderTextShadows({
    layer: layer,
    shadows: groupShadows ? [...groupShadows, ...layer.style.shadows] : layer.style.shadows,
    textAttrs: textAttrs,
    container: textContainer
  });
  textUtils.drawText({
    layer: layer,
    textOptions: textAttrs,
    layerOptions: {
      parent: textContainer
    }
  });
  fillUtils.renderTextFills({
    layer: layer,
    fills: layer.style.fills,
    images: images,
    textAttrs: textAttrs,
    container: textContainer
  })
  borderUtils.renderTextBorders({
    layer: layer,
    borders: layer.style.borders,
    borderOptions: layer.style.borderOptions,
    textAttrs: textAttrs,
    container: textContainer
  });
  frameUtils.setFramePosition({
    container: textContainer,
    x: layer.frame.x,
    y: layer.frame.y
  });
  frameUtils.setFrameRotation({
    container: textContainer,
    rotation: layer.rotation
  });
  frameUtils.setFrameScale({
    container: textContainer,
    isFlippedVertical: layer.isFlippedVertical,
    isFlippedHorizontal: layer.isFlippedHorizontal
  });
  return textContainer;
};

export default renderText;

// var PointText = TextItem.extend({
// 	_class: 'PointText',

// 	initialize: function PointText() {
// 		TextItem.apply(this, arguments);
// 	},

// 	getPoint: function() {
// 		var point = this._matrix.getTranslation();
// 		return new LinkedPoint(point.x, point.y, this, 'setPoint');
// 	},

// 	setPoint: function() {
// 		var point = Point.read(arguments);
// 		this.translate(point.subtract(this._matrix.getTranslation()));
// 	},

// 	_draw: function(ctx, param, viewMatrix) {
// 		if (!this._content) {
// 			return;
// 		}
//    if (this.letterSpacing) {
//      this.project.view.element.style.letterSpacing = `${this.letterSpacing}px`;
//    } else {
//      this.project.view.element.style.letterSpacing = 'normal';
//    }
// 		this._setStyles(ctx, param, viewMatrix);
// 		var lines = this._lines,
// 				style = this._style,
// 				hasFill = style.hasFill(),
// 				hasStroke = style.hasStroke(),
// 				leading = style.getLeading(),
// 				shadowColor = ctx.shadowColor;
// 		ctx.font = style.getFontStyle();
// 		ctx.textAlign = style.getJustification();
// 		var baselineMeasure = ctx.measureText('Abcdefghijklmnop');
// 		var boundingHeight = baselineMeasure.actualBoundingBoxAscent + baselineMeasure.actualBoundingBoxDescent;
// 		var boundingWhitespace = leading - boundingHeight;
// 		var baseline = (boundingWhitespace / 2) + baselineMeasure.actualBoundingBoxAscent;
// 		for (var i = 0, l = lines.length; i < l; i++) {
// 			ctx.shadowColor = shadowColor;
// 			var line = lines[i].trim();
// 			var maxLineWidth = ctx.measureText(line).width * this.fontStretch;
// 			if (hasFill) {
// 				ctx.fillText(line, 0, baseline, maxLineWidth);
// 				ctx.shadowColor = 'rgba(0,0,0,0)';
// 			}
// 			if (hasStroke) {
// 				ctx.strokeText(line, 0, baseline, maxLineWidth);
// 			}
// 			ctx.translate(0, leading);
// 		}
// 	},

// 	_getBounds: function(matrix, options) {
// 		var style = this._style,
// 				lines = this._lines,
// 				numLines = lines.length,
// 				justification = style.getJustification(),
// 				leading = style.getLeading(),
// 				width = this.getView().getTextWidth(style.getFontStyle(), lines),
// 				x = 0;
// 		if (justification !== 'left') {
// 			x -= width / (justification === 'center' ? 2: 1);
// 		}
// 		var rect = new Rectangle(x, 0, width, numLines * leading);
// 		return matrix ? matrix._transformBounds(rect, rect) : rect;
// 	}
// });

// var AreaText = TextItem.extend({
// 	_class: 'AreaText',

// 	initialize: function AreaText() {
// 		TextItem.apply(this, arguments);
// 	},

// 	getPoint: function() {
// 		var point = this._matrix.getTranslation();
// 		return new LinkedPoint(point.x, point.y, this, 'setPoint');
// 	},

// 	setPoint: function() {
// 		var point = Point.read(arguments);
// 		this.translate(point.subtract(this._matrix.getTranslation()));
// 	},

// 	_draw: function(ctx, param, viewMatrix) {
// 		if (!this._content) {
//       return;
//     }
//    if (this.letterSpacing) {
//      this.project.view.element.style.letterSpacing = `${this.letterSpacing}px`;
//    } else {
//      this.project.view.element.style.letterSpacing = 'normal';
//    }
// 		this._setStyles(ctx, param, viewMatrix);
//     var lines = this._lines,
//         style = this._style,
//         hasFill = style.hasFill(),
//         hasStroke = style.hasStroke(),
//         leading = style.getLeading(),
//         shadowColor = ctx.shadowColor;
// 		ctx.font = style.getFontStyle();
// 		ctx.textAlign = style.getJustification();
//     // calculate wrapped lines
// 		var wrappedLines = [];
//     for (var i = 0, l = lines.length; i < l; i++) {
// 			var baseLine = lines[i],
// 					words = baseLine.split(' '),
// 					maxWidth = this.maxWidth,
// 					line = "";
// 			if (ctx.measureText(baseLine).width < maxWidth) {
// 				wrappedLines.push(baseLine);
// 			} else {
// 				while (words.length > 0) {
// 					var split = false;
// 					while (ctx.measureText(words[0]).width >= maxWidth) {
// 						var tmp = words[0];
// 						words[0] = tmp.slice(0, -1);
// 						if (!split) {
// 							split = true;
// 							words.splice(1, 0, tmp.slice(-1));
// 						} else {
// 							words[1] = tmp.slice(-1) + words[1];
// 						}
// 					}
// 					if (ctx.measureText(line + words[0]).width < maxWidth) {
// 						line += words.shift() + " ";
// 					} else {
// 						wrappedLines.push(line.trim());
// 						line = "";
// 					}
// 					if (words.length === 0) {
// 						wrappedLines.push(line.trim());
// 					}
// 				}
// 			}
// 		}
// 		// calculate baseline y position
// 		var baselineMeasure = ctx.measureText('Abcdefghijklmnop');
// 		var boundingHeight = baselineMeasure.actualBoundingBoxAscent + baselineMeasure.actualBoundingBoxDescent;
// 		var boundingWhitespace = leading - boundingHeight;
// 		var baseline = (boundingWhitespace / 2) + baselineMeasure.actualBoundingBoxAscent;
// 		// calculate verticalAlignment offset
// 		var textHeight = wrappedLines.length * leading;
// 		var areaHeight = this.maxHeight;
// 		var getVerticalAlignment = () => {
// 			switch(this.verticalAlignment) {
// 				case 0:
// 					return 0;
// 				case 1:
// 					return (areaHeight - textHeight) / 2;
// 				case 2:
// 					return areaHeight - textHeight;
// 			}
// 		};
// 		var verticalAlignment = getVerticalAlignment();
// 		// draw final lines
//     for (var i = 0, l = wrappedLines.length; i < l; i++) {
// 			ctx.shadowColor = shadowColor;
// 			var line = wrappedLines[i];
// 			var maxLineWidth = ctx.measureText(line.trim()).width * this.fontStretch ;
// 			var y = verticalAlignment + baseline;
// 			if (hasFill) {
// 				ctx.fillText(line, 0, y, maxLineWidth);
// 				ctx.shadowColor = 'rgba(0,0,0,0)';
// 			}
// 			if (hasStroke) {
//         ctx.strokeText(line, 0, y, maxLineWidth);
//       }
// 			ctx.translate(0, leading);
// 		}
// 	}
// });