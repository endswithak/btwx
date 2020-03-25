import paper, { Layer, PointText, AreaText, Rectangle, Shape } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { textUtils } from './utils';

interface RenderText {
  layer: FileFormat.Text;
  container: paper.Group;
  overrides?: FileFormat.OverrideValue[];
}

const renderText = ({ layer, container, overrides }: RenderText): paper.Layer => {
  const textContainer = new Layer({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    parent: container
  });
  const override = textUtils.getOverrideString({
    textId: layer.do_objectID,
    overrides: overrides
  });
  const fontAttrs = textUtils.getFontAttributes({
    textStyle: layer.style.textStyle
  });
  const textAttrs = {
    point: textUtils.getTextPoint({
      justfication: fontAttrs.justification,
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
    justification: fontAttrs.justification,
    fontSize: fontAttrs.fontSize,
    leading: fontAttrs.leading
  }
  let text: paper.AreaText | paper.PointText;
  let textAreaMask: paper.Shape | null = null;
  switch(layer.textBehaviour) {
    case 0:
      text = new PointText(textAttrs);
      break;
    case 1:
      text = new AreaText({
        verticalAlignment: 0,
        maxHeight: layer.frame.height,
        maxWidth: layer.frame.width,
        ...textAttrs
      });
      break;
    case 2: {
      // mask
      textAreaMask = new Shape.Rectangle({
        rectangle: new Rectangle({
          x: 0,
          y: 0,
          width: layer.frame.width,
          height: layer.frame.height
        }),
        fillColor: '#ffffff',
        parent: textContainer,
        clipMask: true
      });
      text = new AreaText({
        verticalAlignment: layer.style.textStyle.verticalAlignment,
        maxHeight: layer.frame.height,
        maxWidth: layer.frame.width,
        ...textAttrs
      });
      break;
    }
  }
  textContainer.position.x += layer.frame.x;
  textContainer.position.y += layer.frame.y;
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
// 		this._setStyles(ctx, param, viewMatrix);
// 		var lines = this._lines,
// 				style = this._style,
// 				hasFill = style.hasFill(),
// 				hasStroke = style.hasStroke(),
// 				leading = style.getLeading(),
// 				shadowColor = ctx.shadowColor;
// 		ctx.font = style.getFontStyle();
// 		ctx.textAlign = style.getJustification();
// 		var measure = ctx.measureText('Abcdefghijklmnop');
// 		var diff = leading - (measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent);
// 		var textY = (diff / 2) + measure.actualBoundingBoxAscent;
// 		for (var i = 0, l = lines.length; i < l; i++) {
// 			ctx.shadowColor = shadowColor;
// 			var line = lines[i].trim();
// 			var metrics = ctx.measureText(line);
// 			if (hasFill) {
// 				ctx.fillText(line, 0, textY, metrics.width * this.fontStretch);
// 				ctx.shadowColor = 'rgba(0,0,0,0)';
// 			}
// 			if (hasStroke) {
// 				ctx.strokeText(line, 0, textY, metrics.width * this.fontStretch);
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
// 		this._setStyles(ctx, param, viewMatrix);
//     var lines = this._lines,
//         style = this._style,
//         hasFill = style.hasFill(),
//         hasStroke = style.hasStroke(),
//         leading = style.getLeading(),
//         shadowColor = ctx.shadowColor;
// 		ctx.font = style.getFontStyle();
// 		ctx.textAlign = style.getJustification();
// 		// calculate base y offset
// 		var measure = ctx.measureText('Abcdefghijklmnop');
// 		var diff = leading - (measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent);
// 		var textY = (diff / 2) + measure.actualBoundingBoxAscent;
//     // calculate wrapped lines
//     var wrappedLines = [];
//     for (var i = 0, l = lines.length; i < l; i++) {
//       var words = lines[i].split(' '),
//           line = '';
//       for(var n = 0; n < words.length; n++) {
//         var testLine = line + words[n] + ' ';
//         var metrics = ctx.measureText(testLine);
//         var testWidth = metrics.width;
//         if (testWidth > this.maxWidth + 12 && n > 0) {
//           wrappedLines.push(line.trim());
//           line = words[n] + ' ';
//         }
//         else {
//           line = testLine;
//         }
//       }
// 			wrappedLines.push(line.trim());
// 		}
// 		// calculate verticalAlignment offset
// 		var textHeight = wrappedLines.length * leading;
// 		var areaHeight = this.maxHeight;
// 		var getVerticalAlignmentLineOffset = () => {
// 			switch(this.verticalAlignment) {
// 				case 0:
// 					return 0;
// 				case 1:
// 					return (areaHeight - textHeight) / 2;
// 				case 2:
// 					return areaHeight - textHeight;
// 			}
// 		};
// 		var verticalAlignmentLineOffset = getVerticalAlignmentLineOffset();
// 		// draw final lines
//     for (var i = 0, l = wrappedLines.length; i < l; i++) {
// 			ctx.shadowColor = shadowColor;
// 			var line = wrappedLines[i];
// 			var metrics = ctx.measureText(line.trim());
// 			if (hasFill) {
// 				ctx.fillText(line, 0, textY + verticalAlignmentLineOffset, metrics.width * this.fontStretch);
// 				ctx.shadowColor = 'rgba(0,0,0,0)';
// 			}
// 			if (hasStroke) {
//         ctx.strokeText(line, 0, textY + verticalAlignmentLineOffset, metrics.width * this.fontStretch);
//       }
// 			ctx.translate(0, leading);
// 		}
// 	}
// });