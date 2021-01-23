import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { setLayersObliqueThunk } from '../store/actions/layer';
import { getSelectedOblique } from '../store/selectors/layer';
import SidebarInput from './SidebarInput';

const ObliqueInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const obliqueValue = useSelector((state: RootState) => getSelectedOblique(state));
  const [oblique, setOblique] = useState(obliqueValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setOblique(obliqueValue);
  }, [obliqueValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setOblique(target.value);
  };

  const handleSubmit = (e: any): void => {
    try {
      let nextOblique = mexp.eval(`${oblique}`) as any;
      if (nextOblique !== obliqueValue) {
        if (nextOblique > 14) {
          nextOblique = 14;
        }
        if (nextOblique < 0) {
          nextOblique = 0;
        }
        dispatch(setLayersObliqueThunk({layers: selected, oblique: nextOblique}));
        setOblique(nextOblique as any);
      }
    } catch(error) {
      setOblique(obliqueValue);
    }
  }

  return (
    <SidebarInput
      value={oblique}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label='°'
      bottomLabel='Oblique' />
  );
}

export default ObliqueInput;

/* eslint-disable @typescript-eslint/no-use-before-define */
// import React, { ReactElement, useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState } from '../store/reducers';
// import { setLayersObliqueThunk } from '../store/actions/layer';
// import { getSelectedOblique } from '../store/selectors/layer';
// import SidebarSectionRow from './SidebarSectionRow';
// import SidebarSectionColumn from './SidebarSectionColumn';
// import SidebarButtonGroup from './SidebarButtonGroup';
// import SidebarToggleButton from './SidebarToggleButton';
// import Icon from './Icon';

// const ObliqueInput = (): ReactElement => {
//   const selected = useSelector((state: RootState) => state.layer.present.selected);
//   const obliqueValue = useSelector((state: RootState) => getSelectedOblique(state));
//   const [oblique, setOblique] = useState(obliqueValue);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     setOblique(obliqueValue);
//   }, [obliqueValue, selected]);

//   const handleClick = (enabled: boolean): void => {
//     if (enabled && oblique !== 14) {
//       dispatch(setLayersObliqueThunk({layers: selected, oblique: 14}));
//       setOblique(enabled ? 14 : 0);
//     }
//     if (!enabled && oblique !== 0) {
//       dispatch(setLayersObliqueThunk({layers: selected, oblique: 0}));
//       setOblique(0);
//     }
//   };

//   return (
//     <SidebarButtonGroup bottomLabel='Oblique'>
//       <SidebarSectionRow>
//         <SidebarSectionColumn width='50%'>
//           <SidebarToggleButton
//             onClick={() => handleClick(false)}
//             active={oblique === 0}>
//             <Icon
//               name='oblique-disabled'
//               small />
//           </SidebarToggleButton>
//         </SidebarSectionColumn>
//         <SidebarSectionColumn width='50%'>
//           <SidebarToggleButton
//             onClick={() => handleClick(true)}
//             active={oblique === 14}>
//             <Icon
//               name='oblique-enabled'
//               small />
//           </SidebarToggleButton>
//         </SidebarSectionColumn>
//       </SidebarSectionRow>
//     </SidebarButtonGroup>
//   );
// }

// export default ObliqueInput;

// import React, { ReactElement, useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import mexp from 'math-expression-evaluator';
// import { paperMain } from '../canvas';
// import { RootState } from '../store/reducers';
// import { setLayersObliqueThunk } from '../store/actions/layer';
// import { getPaperLayer, getSelectedProjectIndices, getSelectedOblique, getSelectedById } from '../store/selectors/layer';
// import SidebarSectionRow from './SidebarSectionRow';
// import SidebarSectionColumn from './SidebarSectionColumn';
// import SidebarInput from './SidebarInput';
// import SidebarSlider from './SidebarSlider';
// import { getTextAbsPoint } from '../store/utils/paper';

// const ObliqueInput = (): ReactElement => {
//   const selected = useSelector((state: RootState) => state.layer.present.selected);
//   const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
//   const obliqueValue = useSelector((state: RootState) => getSelectedOblique(state));
//   const selectedById = useSelector((state: RootState) => getSelectedById(state));
//   const [oblique, setOblique] = useState(obliqueValue);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     setOblique(obliqueValue);
//   }, [obliqueValue, selected]);

//   const handleChange = (e: any): void => {
//     const target = e.target;
//     setOblique(target.value);
//   };

//   const handleSliderChange = (e: any): void => {
//     handleChange(e);
//     Object.keys(selectedById).forEach((key) => {
//       const layerItem = selectedById[key] as Btwx.Text;
//       const paperLayer = getPaperLayer(layerItem.id, selectedProjectIndices[layerItem.id]);
//       const textLinesGroup = paperLayer.getItem({data: {id: 'textLines'}});
//       const textLinesGroupClone = paperLayer.getItem({data: {id: 'textLinesClone'}});
//       const textBackground = paperLayer.getItem({data: {id: 'textBackground'}});
//       if (textLinesGroupClone) {
//         textLinesGroupClone.remove();
//       }
//       const groupDuplicate = textLinesGroup.clone();
//       groupDuplicate.data.id = 'textLinesClone';
//       textLinesGroup.visible = false;
//       groupDuplicate.visible = true;
//       paperLayer.pivot = textBackground.bounds.center;
//       paperLayer.rotation = -layerItem.transform.rotation;
//       groupDuplicate.children.forEach((line: paper.PointText, index) => {
//         line.leading = line.fontSize;
//         if (layerItem.textStyle.oblique !== 0) {
//           line.skew(new paperMain.Point(layerItem.textStyle.oblique, 0));
//         }
//         line.skew(new paperMain.Point(-e.target.value, 0));
//         line.leading = layerItem.textStyle.leading;
//       });
//       textBackground.bounds = groupDuplicate.bounds;
//       paperLayer.rotation = layerItem.transform.rotation;
//       paperLayer.pivot = null;
//     });
//   };

//   const handleSliderSubmit = (e: any): void => {
//     Object.keys(selectedById).forEach((key) => {
//       const layerItem = selectedById[key] as Btwx.Text;
//       const paperLayer = getPaperLayer(layerItem.id, selectedProjectIndices[layerItem.id]);
//       const textLinesGroup = paperLayer.getItem({data: {id: 'textLines'}});
//       const textLinesGroupClone = paperLayer.getItem({data: {id: 'textLinesClone'}});
//       // const textBackground = paperLayer.getItem({data: {id: 'textBackground'}});
//       if (textLinesGroupClone) {
//         textLinesGroupClone.remove();
//       }
//       textLinesGroup.visible = true;
//       // paperLayer.rotation = -layerItem.transform.rotation;
//       // textBackground.bounds = textLinesGroup.bounds;
//       // paperLayer.rotation = layerItem.transform.rotation;
//       // textLinesGroup.children.forEach((line: paper.PointText) => {
//       //   line.leading = layerItem.textStyle.fontSize;
//       //   if (layerItem.textStyle.oblique !== 0) {
//       //     line.skew(new paperMain.Point(layerItem.textStyle.oblique, 0));
//       //   }
//       //   line.skew(new paperMain.Point(-e.target.value, 0));
//       //   line.leading = layerItem.textStyle.leading;
//       // });
//       // textBackground.bounds = textLinesGroup.bounds;
//       // paperLayer.rotation = layerItem.transform.rotation;
//     });
//     handleSubmit(e);
//   }

//   const handleSubmit = (e: any): void => {
//     try {
//       let nextOblique = mexp.eval(`${oblique}`) as any;
//       if (nextOblique !== obliqueValue) {
//         if (nextOblique > 14) {
//           nextOblique = 14;
//         }
//         if (nextOblique < 0) {
//           nextOblique = 0;
//         }
//         dispatch(setLayersObliqueThunk({layers: selected, oblique: nextOblique}));
//         setOblique(nextOblique as any);
//       }
//     } catch(error) {
//       setOblique(obliqueValue);
//     }
//   }

//   return (
//     <SidebarSectionRow>
//       <SidebarSectionColumn width={'66.66%'}>
//         <SidebarSlider
//           value={oblique !== 'multi' ? oblique : 0}
//           step={1}
//           max={14}
//           min={0}
//           onChange={handleSliderChange}
//           onMouseUp={handleSliderSubmit}
//           bottomSpace />
//       </SidebarSectionColumn>
//       <SidebarSectionColumn width={'33.33%'}>
//         <SidebarInput
//           value={oblique}
//           onChange={handleChange}
//           onSubmit={handleSubmit}
//           submitOnBlur
//           label='°'
//           bottomLabel='Oblique' />
//       </SidebarSectionColumn>
//     </SidebarSectionRow>
//   );
// }

// export default ObliqueInput;