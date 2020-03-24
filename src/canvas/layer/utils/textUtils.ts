import paper from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface GetOverrideString {
  textId: string;
  overrides?: FileFormat.OverrideValue[];
}

export const getOverrideString = ({ textId, overrides }: GetOverrideString): FileFormat.OverrideValue => {
  const overrideString = overrides ? overrides.find((override) => {
    return override.overrideName.includes(`${textId}_stringValue`);
  }) : null;
  return overrideString;
};

interface GetTextJustification {
  alignment: number;
}

export const getTextJustification = ({ alignment }: GetTextJustification): string => {
  switch(alignment) {
    case 1:
      return 'right';
    case 2:
      return 'center';
    default:
      return 'left';
  }
};

interface GetVerticalAlignment {
  verticalAlignment: number;
}

export const getTextVerticalAlignment = ({ verticalAlignment }: GetVerticalAlignment): string => {
  switch(verticalAlignment) {
    case 0:
      return 'top';
    case 1:
      return 'center';
    case 2:
      return 'bottom';
  }
};

interface GetTextPointX {
  justfication: string;
  width: number;
}

export const getTextPointX = ({ justfication, width }: GetTextPointX): number => {
  switch(justfication) {
    case 'left':
      return 0;
    case 'center':
      return width / 2;
    case 'right':
      return width;
  }
};

interface GetTextPoint {
  justfication: string;
  width: number;
}

export const getTextPoint = ({ justfication, width }: GetTextPoint): number[] => {
  const x = getTextPointX({justfication, width});
  return [x, 0];
};

interface GetFontWeight {
  fontWeight: string;
}

export const getFontWeight = ({ fontWeight }: GetFontWeight): number => {
  switch(fontWeight) {
    case 'thin':
      return 100;
    case 'light':
      return 300;
    case 'regular':
      return 400;
    case 'medium':
      return 500;
    case 'bold':
      return 700;
    case 'black':
      return 900;
    default:
      return null;
  }
};

interface GetFontStyle {
  fontStyle: string;
}

export const getFontStyle = ({ fontStyle }: GetFontStyle): string => {
  switch(fontStyle) {
    case 'italic':
    case 'oblique':
      return fontStyle;
    default:
      return null;
  }
};

interface GetFontStyleWeight {
  fontAttrs: string[] | null;
}

export const getFontStyleWeight = ({ fontAttrs }: GetFontStyleWeight): string => {
  if (fontAttrs) {
    const weightIndex = fontAttrs.findIndex((attr) => {
      return getFontWeight({fontWeight: attr});
    });
    const styleIndex = fontAttrs.findIndex((attr) => {
      return getFontStyle({fontStyle: attr});
    });
    const weight = weightIndex !== -1 ? getFontWeight({fontWeight: fontAttrs[weightIndex]}) : 'normal';
    const style = styleIndex !== -1 ? getFontStyle({fontStyle: fontAttrs[styleIndex]}) : 'normal';
    return `${style} ${weight}`;
  } else {
    return '';
  }
};

interface GetFontAttributes {
  textStyle: FileFormat.TextStyle;
}

interface FontAttributes {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: FileFormat.Color;
  leading: number;
  textTransform: number;
  justification: string;
}

export const getFontAttributes = ({ textStyle }: GetFontAttributes): FontAttributes => {
  const { encodedAttributes } = textStyle;
  const paragraphStyles = encodedAttributes.paragraphStyle;
  const postScript = encodedAttributes.MSAttributedStringFontAttribute.attributes.name;
  const hyphenIndex = postScript.indexOf('-');
  const fontAttrs = hyphenIndex !== -1 ? postScript.substring(hyphenIndex + 1, postScript.length ).replace(/([A-Z])/g, ' $1').trim().toLowerCase().split(' ') : null;
  const fontFamily = hyphenIndex !== -1 ? postScript.substring(0, hyphenIndex).replace(/([A-Z])/g, ' $1').trim() : postScript.replace(/([A-Z])/g, ' $1').trim();
  const fontSize = encodedAttributes.MSAttributedStringFontAttribute.attributes.size;
  const fontWeight = getFontStyleWeight({fontAttrs});
  const color = encodedAttributes.MSAttributedStringColorAttribute;
  const leading = paragraphStyles.minimumLineHeight ? paragraphStyles.minimumLineHeight : fontSize * 1.2;
  const textTransform = encodedAttributes.MSAttributedStringTextTransformAttribute;
  const justification = getTextJustification({
    alignment: paragraphStyles.alignment
  });
  return {
    fontFamily,
    fontSize,
    fontWeight,
    color,
    leading,
    textTransform,
    justification
  }
};

interface GetTextTransformString {
  str: string;
  textTransform: number;
}

export const getTextTransformString = ({ str, textTransform }: GetTextTransformString): string => {
  switch(textTransform) {
    case 0:
      return str;
    case 1:
      return str.toUpperCase();
    case 2:
      return str.toLowerCase();
    default:
      return str;
  }
};

interface GetTextPosition {
  textBehaviour: number;
  verticalAlignment: number;
  frame: FileFormat.Rect;
  text: paper.PointText;
}

export const getTextPosition = ({ textBehaviour, verticalAlignment, frame, text }: GetTextPosition): paper.Point => {
  const x = text.position.x += frame.x;
  let y = text.position.y += frame.y;
  if (textBehaviour === 2) {
    switch(verticalAlignment) {
      case 1:
        y += (frame.height - text.bounds.height) / 2;
        break;
      case 2:
        y += frame.height - text.bounds.height;
        break;
    }
  }
  return new paper.Point(x, y);
};