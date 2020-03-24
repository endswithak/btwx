import paper, { Group, Layer, view, Shape, Rectangle, Point, Color, PointText } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getOverrideString, getTextJustification, getTextPoint, getTextTransformString, getTextPosition, getFontStyleWeight } from './utils';

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
  const textStyles = layer.style.textStyle;
  const paragraphStyles = textStyles.encodedAttributes.paragraphStyle;
  const postScript = textStyles.encodedAttributes.MSAttributedStringFontAttribute.attributes.name;
  const hyphenIndex = postScript.indexOf('-');
  const fontAttrs = hyphenIndex !== -1 ? postScript.substring(hyphenIndex + 1, postScript.length ).replace(/([A-Z])/g, ' $1').trim().toLowerCase().split(' ') : null;
  const fontFamily = hyphenIndex !== -1 ? postScript.substring(0, hyphenIndex).replace(/([A-Z])/g, ' $1').trim() : postScript.replace(/([A-Z])/g, ' $1').trim();
  const fontSize = textStyles.encodedAttributes.MSAttributedStringFontAttribute.attributes.size;
  const fontColor = textStyles.encodedAttributes.MSAttributedStringColorAttribute;
  const leading = paragraphStyles.minimumLineHeight ? paragraphStyles.minimumLineHeight : fontSize * 1.2;
  const textTransform = textStyles.encodedAttributes.MSAttributedStringTextTransformAttribute;
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
  const textContent = getTextTransformString({
    str: textOverride ? textOverride.value as string : layer.attributedString.string,
    textTransform: textTransform
  });
  const text = new PointText({
    point: textPoint,
    parent: textContainer,
    content: textContent,
    fillColor: fontColor,
    // strokeColor: Color.random(),
    // strokeWidth: 1,
    fontWeight: getFontStyleWeight({fontAttrs}),
    fontFamily: fontFamily,
    justification: textJustification,
    fontSize: fontSize,
    leading: leading
  });
  textContainer.position = getTextPosition({
    textBehaviour: layer.textBehaviour,
    verticalAlignment: textStyles.verticalAlignment,
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