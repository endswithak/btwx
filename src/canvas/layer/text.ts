import paper, { Layer, PointText } from 'paper';
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
  const text = new PointText({
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
    fontWeight: fontAttrs.fontWeight,
    fontFamily: fontAttrs.fontFamily,
    justification: fontAttrs.justification,
    fontSize: fontAttrs.fontSize,
    leading: fontAttrs.leading
  });
  textContainer.position = textUtils.getTextPosition({
    textBehaviour: layer.textBehaviour,
    verticalAlignment: layer.style.textStyle.verticalAlignment,
    frame: layer.frame,
    text: text
  });
  return textContainer;
};

export default renderText;

// updated paper PointText snippet ref

// _draw: function(ctx, param, viewMatrix) {
//   if (!this._content)
//     return;
//   this._setStyles(ctx, param, viewMatrix);
//   var lines = this._lines,
//     style = this._style,
//     hasFill = style.hasFill(),
//     hasStroke = style.hasStroke(),
//     leading = style.getLeading(),
//     shadowColor = ctx.shadowColor;
//   ctx.font = style.getFontStyle();
//   ctx.textAlign = style.getJustification();

// New

//   var measure = ctx.measureText('Abcdefghijklmnop');
//   var diff = leading - (measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent);
//   var textY = (diff / 2) + measure.actualBoundingBoxAscent;

// end new

//   for (var i = 0, l = lines.length; i < l; i++) {
//     ctx.shadowColor = shadowColor;
//     var line = lines[i];
//     if (hasFill) {
//       ctx.fillText(line, 0, textY);
//       ctx.shadowColor = 'rgba(0,0,0,0)';
//     }
//     if (hasStroke)
//       ctx.strokeText(line, 0, textY);
//     ctx.translate(0, leading);
//   }
// },

// _getBounds: function(matrix, options) {
//   var style = this._style,
//     lines = this._lines,
//     numLines = lines.length,
//     justification = style.getJustification(),
//     leading = style.getLeading(),
//     width = this.getView().getTextWidth(style.getFontStyle(), lines),
//     x = 0;
//   if (justification !== 'left')
//     x -= width / (justification === 'center' ? 2: 1);
//   var rect = new Rectangle(x,

// New

//         0,

// end new

//         width, numLines * leading);
//   return matrix ? matrix._transformBounds(rect, rect) : rect;
// }