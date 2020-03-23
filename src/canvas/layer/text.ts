import paper, { Group, Layer, Shape, Rectangle, Point, Color, PointText } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getOverrideString, getTextJustification, getTextPoint } from './utils';

interface RenderText {
  layer: FileFormat.Text;
  container: paper.Group;
  overrides?: FileFormat.OverrideValue[];
}

const renderText = ({ layer, container, overrides }: RenderText): paper.Group => {
  const textArea = new Group({
    parent: container,
    bounds: new Rectangle({
      x: 0,
      y: 0,
      width: layer.frame.width,
      height: layer.frame.height
    })
  });
  const textAreaBg = new Shape.Rectangle({
    parent: textArea,
    rectangle: new Rectangle({
      x: 0,
      y: 0,
      width: layer.frame.width,
      height: layer.frame.height
    }),
    fillColor: 'red'
  });
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
    textBehaviour: layer.textBehaviour,
    justfication: textJustification,
    width: layer.frame.width,
    lineHeight: lineHeight,
    verticalAlignment: textStyles.verticalAlignment,
    height: layer.frame.height
  });
  const text = new PointText({
    point: textPoint,
    parent: textArea,
    content: textOverride ? textOverride.value : layer.attributedString.string,
    fillColor: Color.random(),
    justification: textJustification,
    fontSize: fontSize,
    leading: lineHeight
  });
  if (layer.textBehaviour === 2) {
    switch(textStyles.verticalAlignment) {
      case 0:
        text.pivot = new Point(0, 0);
        text.position.y = text.bounds.height / 2;
        break;
      case 1:
        text.position.y = 0;
        text.pivot = new Point(0, 0);
        text.position.y = textArea.bounds.height / 2;
        break;
      case 2:
        text.pivot = new Point(0, 0);
        text.position.y = textArea.bounds.height - (text.bounds.height / 2);
        break;
    }
  } else {
    text.pivot = new Point(0, textArea.bounds.center.y);
    text.position.y = textArea.bounds.height - text.bounds.height;
  }
  textArea.position.x += layer.frame.x;
  textArea.position.y += layer.frame.y;
  return textArea;
};

export default renderText;