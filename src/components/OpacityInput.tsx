import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { getSelectedOpacity } from '../store/selectors/layer';
import { setLayersOpacity } from '../store/actions/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';
import BlendModeSelector from './BlendModeSelector';

const OpacityInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const opacityValue = useSelector((state: RootState) => getSelectedOpacity(state));
  const [opacity, setOpacity] = useState(opacityValue !== 'multi' ? Math.round(opacityValue * 100) : opacityValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setOpacity(opacityValue !== 'multi' ? Math.round(opacityValue * 100) : opacityValue);
  }, [opacityValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setOpacity(target.value);
  };

  // const handleSliderChange = (e: any) => {
  //   handleChange(e);
  //   const paperLayer = getPaperLayer(selected[0]);
  //   let nextOpacity = mexp.eval(`${opacity}`);
  //   if (nextOpacity > 100) {
  //     nextOpacity = 100;
  //   }
  //   if (nextOpacity < 0) {
  //     nextOpacity = 0;
  //   }
  //   paperLayer.opacity = mexp.eval(`${nextOpacity} / 100`);
  // };

  const handleSubmit = (e: any) => {
    try {
      let nextOpacity = mexp.eval(`${opacity}`) as any;
      if (nextOpacity !== opacityValue) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        dispatch(setLayersOpacity({layers: selected, opacity: Math.round(nextOpacity) / 100}));
        setOpacity(Math.round(nextOpacity));
      }
    } catch(error) {
      setOpacity(opacityValue !== 'multi' ? Math.round(opacityValue * 100) : opacityValue);
    }
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'66.66%'}>
        {/* <SidebarSlider
          value={disabled ? 0 : opacity}
          onChange={handleSliderChange}
          onMouseUp={handleSubmit}
          disabled={disabled} /> */}
        <BlendModeSelector />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={opacity}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitOnBlur
          label={'%'}
          bottomLabel='Opacity' />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default OpacityInput;