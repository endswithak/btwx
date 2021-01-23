/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersFontWeightThunk } from '../store/actions/layer';
import { getSelectedFontWeight } from '../store/selectors/layer';
import SidebarSelect from './SidebarSelect';

const FontWeightInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const fontWeightValue = useSelector((state: RootState) => getSelectedFontWeight(state));
  const dispatch = useDispatch();

  const selectorOptions = [
    { value: 100, label: 100 },
    { value: 200, label: 200 },
    { value: 300, label: 300 },
    { value: 400, label: 400 },
    { value: 500, label: 500 },
    { value: 600, label: 600 },
    { value: 700, label: 700 },
    { value: 800, label: 800 },
    { value: 900, label: 900 }
  ];

  const [fontWeight, setFontWeight] = useState(fontWeightValue !== 'multi' ? selectorOptions.find((option) => option.value === fontWeightValue) : null);

  useEffect(() => {
    setFontWeight(fontWeightValue !== 'multi' ? selectorOptions.find((option) => option.value === fontWeightValue) : null);
  }, [fontWeightValue]);

  const handleSelectorChange = (selectedOption: { value: number; label: number }): void => {
    setFontWeight(selectedOption);
    dispatch(setLayersFontWeightThunk({layers: selected, fontWeight: selectedOption.value}));
  }

  return (
    <SidebarSelect
      value={fontWeight}
      onChange={handleSelectorChange}
      options={selectorOptions}
      placeholder='multi'
      bottomLabel='Weight' />
  );
}

export default FontWeightInput;

// /* eslint-disable @typescript-eslint/no-use-before-define */
// import React, { ReactElement, useEffect, useState, useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// // import * as fontFinder from 'font-finder';
// // import { WEB_SAFE_FONT_WEIGHTS } from '../constants';
// import { RootState } from '../store/reducers';
// import { setLayersFontWeightThunk } from '../store/actions/layer';
// import { getPaperLayer, getSelectedProjectIndices, getSelectedFontWeight, getSelectedById, getSelectedFontFamily } from '../store/selectors/layer';
// import SidebarSectionRow from './SidebarSectionRow';
// import SidebarSectionColumn from './SidebarSectionColumn';
// import SidebarSlider from './SidebarSlider';
// import SidebarSelect from './SidebarSelect';

// const FontWeightInput = (): ReactElement => {
//   const selected = useSelector((state: RootState) => state.layer.present.selected);
//   const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
//   const fontWeightValue = useSelector((state: RootState) => getSelectedFontWeight(state));
//   // const fontFamily = useSelector((state: RootState) => getSelectedFontFamily(state));
//   const selectedById = useSelector((state: RootState) => getSelectedById(state));
//   // const [fontWeightOptions, setFontWeightOptions] = useState(WEB_SAFE_FONT_WEIGHTS);
//   // const [selectorOptions, setSelectorOptions] = useState(WEB_SAFE_FONT_WEIGHTS.map((weight) => ({ value: weight, label: weight })));
//   const dispatch = useDispatch();

//   const selectorOptions = [
//     { value: 100, label: 100 },
//     { value: 200, label: 200 },
//     { value: 300, label: 300 },
//     { value: 400, label: 400 },
//     { value: 500, label: 500 },
//     { value: 600, label: 600 },
//     { value: 700, label: 700 },
//     { value: 800, label: 800 },
//     { value: 900, label: 900 }
//   ];

//   const [fontWeight, setFontWeight] = useState(fontWeightValue !== 'multi' ? selectorOptions.find((option) => option.value === fontWeightValue) : null);

//   // const getCloesetOption = (weight: number, options = fontWeightOptions): number => {
//   //   return options.reduce((result, current) => {
//   //     return (Math.abs(current - weight) < Math.abs(result - weight) ? current : result);
//   //   });
//   // }

//   // const setToDefault = (): void => {
//   //   setFontWeight(null);
//   //   setFontWeightOptions(WEB_SAFE_FONT_WEIGHTS);
//   //   setSelectorOptions(WEB_SAFE_FONT_WEIGHTS.map((weight) => ({ value: weight, label: weight })));
//   // }

//   useEffect(() => {
//     // if (fontWeightValue === 'multi' || fontFamily === 'multi') {
//     //   setToDefault();
//     // } else {
//     //   let newFontWeightOptions: number[] = WEB_SAFE_FONT_WEIGHTS;
//     //   (async () => {
//     //     const variants = await fontFinder.listVariants(fontFamily);
//     //     if (variants && variants.length > 0) {
//     //       newFontWeightOptions = variants.reduce((result, current) => {
//     //         if (!result.includes(Math.ceil(current.weight / 100) * 100)) {
//     //           result = [...result, Math.ceil(current.weight / 100) * 100];
//     //         }
//     //         return result;
//     //       }, []).sort();
//     //     }
//     //     const newSelectionOptions = newFontWeightOptions.reduce((result, current) => {
//     //       return [...result, { value: current, label: current }];
//     //     }, []);
//     //     setFontWeightOptions(newFontWeightOptions);
//     //     setSelectorOptions(newSelectionOptions);
//     //     const optionAvailable = newSelectionOptions.find((option) => option.value === fontWeightValue);
//     //     if (optionAvailable) {
//     //       setFontWeight({value: fontWeightValue as number, label: fontWeightValue as number});
//     //     } else {
//     //       const closestOption = getCloesetOption(fontWeightValue as number, newFontWeightOptions);
//     //       setFontWeight({value: closestOption, label: closestOption});
//     //     }
//     //   })();
//     // }
//     setFontWeight(fontWeightValue !== 'multi' ? selectorOptions.find((option) => option.value === fontWeightValue) : null);
//   }, [fontWeightValue]);

//   const handleSelectorChange = (selectedOption: { value: number; label: number }): void => {
//     setFontWeight(selectedOption);
//     dispatch(setLayersFontWeightThunk({layers: selected, fontWeight: selectedOption.value}));
//   }

//   const handleSliderChange = (e: any): void => {
//     // let newWeight = parseInt(e.target.value);
//     // const optionAvailable = selectorOptions.find((option) => option.value === newWeight);
//     // if (optionAvailable) {
//     //   setFontWeight(optionAvailable);
//     // } else {
//     //   newWeight = getCloesetOption(newWeight);
//     //   setFontWeight({value: newWeight, label: newWeight});
//     // }
//     const newWeight = parseInt(e.target.value);
//     setFontWeight(selectorOptions.find((option) => option.value === newWeight));
//     Object.keys(selectedById).forEach((key) => {
//       const layerItem = selectedById[key];
//       const paperLayer = getPaperLayer(layerItem.id, selectedProjectIndices[layerItem.id]);
//       const textLinesGroup = paperLayer.getItem({data: {id: 'textLines'}});
//       const textBackground = paperLayer.getItem({data: {id: 'textBackground'}});
//       paperLayer.rotation = -layerItem.transform.rotation;
//       textLinesGroup.children.forEach((line: paper.PointText) => {
//         line.fontWeight = newWeight;
//       });
//       textBackground.bounds = textLinesGroup.bounds;
//       paperLayer.rotation = layerItem.transform.rotation;
//     });
//   };

//   const handleSliderSubmit = (e: any): void => {
//     // let newWeight = parseInt(e.target.value);
//     // const optionAvailable = selectorOptions.find((option) => option.value === newWeight);
//     // if (optionAvailable) {
//     //   setFontWeight(optionAvailable);
//     // } else {
//     //   newWeight = getCloesetOption(newWeight);
//     //   setFontWeight({value: newWeight, label: newWeight});
//     // }
//     const newWeight = parseInt(e.target.value);
//     setFontWeight(selectorOptions.find((option) => option.value === newWeight));
//     dispatch(setLayersFontWeightThunk({layers: selected, fontWeight: newWeight}));
//   }

//   return (
//     <SidebarSectionRow>
//       <SidebarSectionColumn width={'66.66%'}>
//         <SidebarSlider
//           value={fontWeight ? fontWeight.value : 0}
//           step={100}
//           max={900}
//           min={100}
//           onChange={handleSliderChange}
//           onMouseUp={handleSliderSubmit}
//           bottomSpace />
//       </SidebarSectionColumn>
//       <SidebarSectionColumn width={'33.33%'}>
//         <SidebarSelect
//           value={fontWeight}
//           onChange={handleSelectorChange}
//           options={selectorOptions}
//           placeholder='multi'
//           bottomLabel='Weight' />
//       </SidebarSectionColumn>
//     </SidebarSectionRow>
//   );
// }

// export default FontWeightInput;