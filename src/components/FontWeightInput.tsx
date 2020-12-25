import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { setLayersFontWeight } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices, getSelectedFontWeight, getSelectedById } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';

const FontWeightInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const fontWeightValue = useSelector((state: RootState) => getSelectedFontWeight(state));
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [fontWeight, setFontWeight] = useState(fontWeightValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setFontWeight(fontWeightValue);
  }, [fontWeightValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setFontWeight(target.value);
  };

  const handleSliderChange = (e: any): void => {
    handleChange(e);
    Object.keys(selectedById).forEach((key) => {
      const layerItem = selectedById[key];
      const paperLayer = getPaperLayer(layerItem.id, selectedProjectIndices[layerItem.id]);
      const textContent = paperLayer.getItem({data: {id: 'textContent'}}) as paper.PointText;
      textContent.fontWeight = e.target.value;
    });
  };

  const handleSubmit = (e: any): void => {
    try {
      let nextFontWeight = Math.ceil((mexp.eval(`${fontWeight}`) as any) / 100) * 100;
      if (nextFontWeight !== fontWeightValue) {
        if (nextFontWeight > 900) {
          nextFontWeight = 900;
        }
        if (nextFontWeight < 100) {
          nextFontWeight = 100;
        }
        dispatch(setLayersFontWeight({layers: selected, fontWeight: nextFontWeight}));
        setFontWeight(nextFontWeight as any);
      }
    } catch(error) {
      setFontWeight(fontWeightValue);
    }
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'66.66%'}>
        <SidebarSlider
          value={fontWeight !== 'multi' ? fontWeight : 0}
          step={100}
          max={900}
          min={100}
          onChange={handleSliderChange}
          onMouseUp={handleSubmit}
          bottomSpace />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={fontWeight}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitOnBlur
          bottomLabel='Weight' />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default FontWeightInput;