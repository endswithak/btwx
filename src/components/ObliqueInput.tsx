import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersObliqueThunk } from '../store/actions/layer';
import { getSelectedOblique } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarButtonGroup from './SidebarButtonGroup';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

const ObliqueInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const obliqueValue = useSelector((state: RootState) => getSelectedOblique(state));
  const [oblique, setOblique] = useState(obliqueValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setOblique(obliqueValue);
  }, [obliqueValue, selected]);

  const handleClick = (enabled: boolean): void => {
    if (enabled && oblique !== 14) {
      dispatch(setLayersObliqueThunk({layers: selected, oblique: 14}));
      setOblique(enabled ? 14 : 0);
    }
    if (!enabled && oblique !== 0) {
      dispatch(setLayersObliqueThunk({layers: selected, oblique: 0}));
      setOblique(0);
    }
  };

  return (
    <SidebarButtonGroup bottomLabel='Oblique'>
      <SidebarSectionRow>
        <SidebarSectionColumn width='50%'>
          <SidebarToggleButton
            onClick={() => handleClick(false)}
            active={oblique === 0}>
            <Icon
              name='oblique-disabled'
              small />
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn width='50%'>
          <SidebarToggleButton
            onClick={() => handleClick(true)}
            active={oblique === 14}>
            <Icon
              name='oblique-enabled'
              small />
          </SidebarToggleButton>
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </SidebarButtonGroup>
  );
}

export default ObliqueInput;

// import React, { ReactElement, useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import mexp from 'math-expression-evaluator';
// import { uiPaperScope } from '../canvas';
// import { RootState } from '../store/reducers';
// import { setLayersOblique } from '../store/actions/layer';
// import { getPaperLayer, getSelectedProjectIndices, getSelectedOblique, getSelectedById } from '../store/selectors/layer';
// import SidebarSectionRow from './SidebarSectionRow';
// import SidebarSectionColumn from './SidebarSectionColumn';
// import SidebarInput from './SidebarInput';
// import SidebarSlider from './SidebarSlider';

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
//       const textContent = paperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
//       const textLines = paperLayer.getItems({data: {id: 'textLine'}}) as paper.PointText[];
//       const startPosition = paperLayer.position;
//       paperLayer.rotation = -layerItem.transform.rotation;
//       const newPointText = new uiPaperScope.PointText({
//         content: textContent.content,
//         point: textContent.point,
//         style: textContent.style,
//         data: textContent.data,
//         visible: false,
//         position: startPosition,
//         parent: paperLayer
//       });
//       const maxCount = Math.max(newPointText._lines.length, textLines.length);
//       for(let i = 0; i < maxCount; i++) {
//         if (textLines[i]) {
//           textLines[i].remove();
//         }
//         if (textContent._lines[i]) {
//           const newLine = new uiPaperScope.PointText({
//             point: new uiPaperScope.Point(textContent.point.x, textContent.point.y + (i * textContent.leading)),
//             content: textContent._lines[i],
//             style: textContent.style,
//             parent: paperLayer,
//             data: { id: 'textLine', type: 'LayerChild', layerType: 'Text' }
//           });
//           newLine.skew(new uiPaperScope.Point(-e.target.value, 0));
//         }
//       }
//       // newPointText.skew(new uiPaperScope.Point(-e.target.value, 0));
//       // textLines.removeChildren();
//       // (newPointText as any)._lines.reduce((result: paper.PointText[], current: string, index: number) => {
//       //   const line = new uiPaperScope.PointText({
//       //     point: new uiPaperScope.Point(newPointText.point.x, newPointText.point.y + (index * newPointText.leading)),
//       //     content: current,
//       //     style: newPointText.style,
//       //     visible: true,
//       //     parent: textLines,
//       //     data: { id: 'textLine', type: 'LayerChild', layerType: 'Text' }
//       //   });
//       //   line.skew(new uiPaperScope.Point(-e.target.value, 0));
//       //   return [...result, line];
//       // }, []);
//       textContent.remove();
//       paperLayer.rotation = layerItem.transform.rotation;
//       paperLayer.position = startPosition;
//     });
//   };

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
//         dispatch(setLayersOblique({layers: selected, oblique: nextOblique}));
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
//           onMouseUp={handleSubmit}
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