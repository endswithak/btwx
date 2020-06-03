import paper, { PointText, AreaText, Layer, Shape, Rectangle } from 'paper';
import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface GetOverrideString {
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

export const getOverrideString = ({ overrides, symbolPath }: GetOverrideString): FileFormat.OverrideValue => {
  const overrideString = overrides ? overrides.find((override) => {
    return `${symbolPath}_stringValue`.includes(override.overrideName);
  }) : null;
  return overrideString;
};

interface GetTextJustification {
  alignment: number;
}

export const getTextAlignment = ({ alignment }: GetTextJustification): string => {
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

interface GetFontStretch {
  fontStretch: string;
}

export const getFontStretch = ({ fontStretch }: GetFontStretch): number => {
  switch(fontStretch) {
    case 'condensed':
      return 0.75;
    case 'expanded':
      return 1.25;
    default:
      return null;
  }
};

interface FindFontStretch {
  fontAttrs: string[] | null;
}

export const findFontStretch = ({ fontAttrs }: FindFontStretch): number => {
  if (fontAttrs) {
    const stretchIndex = fontAttrs.findIndex((attr) => {
      return getFontStretch({fontStretch: attr});
    });
    return stretchIndex !== -1 ? getFontStretch({fontStretch: fontAttrs[stretchIndex]}) : 1;
  } else {
    return 1;
  }
};

interface FindFontWeight {
  fontAttrs: string[] | null;
}

export const findFontWeight = ({ fontAttrs }: FindFontWeight): string | number => {
  if (fontAttrs) {
    const fontWeightIndex = fontAttrs.findIndex((attr) => {
      return getFontWeight({fontWeight: attr});
    });
    return fontWeightIndex !== -1 ? getFontWeight({fontWeight: fontAttrs[fontWeightIndex]}) : 'normal';
  } else {
    return 'normal';
  }
};

interface FindFontStyle {
  fontAttrs: string[] | null;
}

export const findFontStyle = ({ fontAttrs }: FindFontStyle): string => {
  if (fontAttrs) {
    const fontStyleIndex = fontAttrs.findIndex((attr) => {
      return getFontStyle({fontStyle: attr});
    });
    return fontStyleIndex !== -1 ? getFontStyle({fontStyle: fontAttrs[fontStyleIndex]}) : 'normal';
  } else {
    return 'normal';
  }
};

interface GetFontAttributes {
  textStyle: FileFormat.TextStyle;
}

interface FontAttributes {
  fontFamily: string;
  fontSize: number;
  fontWeight: string | number;
  fontStyle: string;
  fontStretch: number;
  color: FileFormat.Color;
  lineHeight: number;
  textTransform: number;
  alignment: string;
  letterSpacing: number;
}

export const getFontAttributes = ({ textStyle }: GetFontAttributes): FontAttributes => {
  const { encodedAttributes } = textStyle;
  const paragraphStyles = encodedAttributes.paragraphStyle;
  const postScript = encodedAttributes.MSAttributedStringFontAttribute.attributes.name;
  const hyphenIndex = postScript.indexOf('-');
  const fontAttrs = hyphenIndex !== -1
                    ? postScript.substring(hyphenIndex + 1, postScript.length ).replace(/([A-Z])/g, ' $1').trim().toLowerCase().split(' ')
                    : null;
  const fontFamily = hyphenIndex !== -1
                     ? postScript.substring(0, hyphenIndex).replace(/([A-Z])/g, ' $1').trim()
                     : postScript.replace(/([A-Z])/g, ' $1').trim();
  const fontSize = encodedAttributes.MSAttributedStringFontAttribute.attributes.size;
  const fontWeight = findFontWeight({fontAttrs});
  const fontStyle = findFontStyle({fontAttrs});
  const fontStretch = findFontStretch({fontAttrs});
  const letterSpacing = textStyle.encodedAttributes.kerning;
  const color = encodedAttributes.MSAttributedStringColorAttribute;
  const lineHeight = paragraphStyles && paragraphStyles.minimumLineHeight
                     ? paragraphStyles.minimumLineHeight
                     : fontSize * 1.2;
  const textTransform = encodedAttributes.MSAttributedStringTextTransformAttribute;
  const alignment = paragraphStyles && paragraphStyles.alignment
                    ? getTextAlignment({
                        alignment: paragraphStyles.alignment
                      })
                    : 'left';
  return {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    fontStretch,
    color,
    lineHeight,
    textTransform,
    alignment,
    letterSpacing
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

interface DrawText {
  layer: FileFormat.Text;
  layerOptions: any;
  textOptions: any;
}

export const drawText = ({ layer, layerOptions, textOptions }: DrawText): paper.Layer => {
  const textContainer = new Layer({
    name: 'text',
    ...layerOptions
  });
  switch(layer.textBehaviour) {
    // auto width
    case 0:
      new PointText({
        parent: textContainer,
        ...textOptions,
      });
      break;
    // auto height
    case 1:
      new AreaText({
        verticalAlignment: 0,
        maxHeight: layer.frame.height,
        maxWidth: layer.frame.width,
        parent: textContainer,
        ...textOptions
      });
      break;
    // fixed size
    case 2: {
      new Shape.Rectangle({
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
      new AreaText({
        verticalAlignment: layer.style.textStyle.verticalAlignment,
        maxHeight: layer.frame.height,
        maxWidth: layer.frame.width,
        parent: textContainer,
        ...textOptions
      });
      break;
    }
  }
  return textContainer;
};