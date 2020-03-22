import paper, { Group, Layer, Rectangle, Point, Color, PointText } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';
import { getOverrideString } from './utils';

interface RenderText {
  layer: FileFormat.Text;
  container: paper.Group;
  overrides?: FileFormat.OverrideValue[];
}

const renderText = ({ layer, container, overrides }: RenderText): paper.Group => {
  const textOverride = getOverrideString({
    textId: layer.do_objectID,
    overrides: overrides
  });
  const textBounds = new Group({
    name: layer.do_objectID,
    data: { name: layer.name },
    locked: layer.isLocked,
    visible: layer.isVisible,
    parent: container,
    bounds: new Rectangle({
      x: 0,
      y: 0,
      width: layer.frame.width,
      height: layer.frame.height
    })
  });
  const text = new PointText({
    point: [0, 0],
    parent: textBounds,
    content: textOverride ? textOverride.value : layer.attributedString.string,
    fillColor: Color.random(),
    fontSize: layer.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.size
  });
  textBounds.position.x += layer.frame.x;
  textBounds.position.y += layer.frame.y;
  return textBounds;
};

export default renderText;