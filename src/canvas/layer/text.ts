import paper, { Group, Layer, view, Shape, Rectangle, Point, Color, PointText } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getOverrideString, getTextJustification, getTextPoint } from './utils';

interface RenderText {
  layer: FileFormat.Text;
  container: paper.Group;
  overrides?: FileFormat.OverrideValue[];
}

const renderText = ({ layer, container, overrides }: RenderText): paper.PointText => {
  const textStyles = layer.style.textStyle;
  const paragraphStyles = textStyles.encodedAttributes.paragraphStyle;
  const fontSize = textStyles.encodedAttributes.MSAttributedStringFontAttribute.attributes.size;
  const lineHeight = paragraphStyles.minimumLineHeight ? paragraphStyles.minimumLineHeight : fontSize * 1.2;
  const textOverride = getOverrideString({
    textId: layer.do_objectID,
    overrides: overrides
  });
  const textJustification = getTextJustification({
    alignment: paragraphStyles.alignment
  });
  const textPoint = getTextPoint({
    justfication: textJustification,
    width: layer.frame.width
  });
  const text = new PointText({
    point: textPoint,
    parent: container,
    content: textOverride ? textOverride.value : layer.attributedString.string,
    fillColor: Color.random(),
    // strokeColor: Color.random(),
    // strokeWidth: 1,
    fontFamily: 'Helvetica',
    justification: textJustification,
    fontSize: fontSize,
    leading: lineHeight
  });
  text.position.x += layer.frame.x;
  text.position.y += layer.frame.y;
  if (layer.textBehaviour === 2) {
    switch(textStyles.verticalAlignment) {
      case 1:
        text.position.y += (layer.frame.height - text.bounds.height) / 2;
        break;
      case 2:
        text.position.y += layer.frame.height - text.bounds.height;
        break;
    }
  }
  return text;
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