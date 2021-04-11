// import FileFormat from '@sketch-hq/sketch-file-format-ts';
// import { convertColor, convertGradientDestination, convertGradientOrigin, convertGradientType, convertGradientStops } from './general';
// import { DEFAULT_FILL_FILL_TYPE, DEFAULT_GRADIENT_STYLE, DEFAULT_FILL_STYLE } from '../../../constants';

// export const convertFillType = (sketchFillType: FileFormat.FillType): Btwx.FillType => {
//   switch(sketchFillType) {
//     case 0:
//       return 'color';
//     case 1:
//       return 'gradient';
//     // case 4:
//     //   return 'pattern';
//   }
// };

// export const convertFill = (layer: FileFormat.AnyLayer): Btwx.Fill => {
//   const fill = layer.style.fills.find(fill => fill.fillType === 0 || fill.fillType === 1);
//   if (!fill) {
//     if (layer._class === 'text') {
//       return {
//         enabled: true,
//         color: convertColor(layer.style.textStyle.encodedAttributes.MSAttributedStringColorAttribute),
//         fillType: DEFAULT_FILL_FILL_TYPE,
//         gradient: DEFAULT_GRADIENT_STYLE
//       }
//     } else {
//       return {
//         ...DEFAULT_FILL_STYLE,
//         enabled: false
//       };
//     }
//   } else {
//     return {
//       enabled: fill.isEnabled,
//       color: convertColor(fill.color),
//       fillType: convertFillType(fill.fillType),
//       gradient: {
//         activeStopIndex: 0,
//         gradientType: convertGradientType(fill.gradient.gradientType),
//         origin: convertGradientOrigin(fill.gradient.from),
//         destination: convertGradientDestination(fill.gradient.to),
//         stops: convertGradientStops(fill.gradient.stops)
//       }
//     }
//   }
// };