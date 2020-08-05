import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import { SetLayersOpacityPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersOpacity } from '../store/actions/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';
import BlendModeSelector from './BlendModeSelector';

interface OpacityInputProps {
  selected?: string[];
  opacityValue?: number;
  setLayersOpacity?(payload: SetLayersOpacityPayload): LayerTypes;
}

const OpacityInput = (props: OpacityInputProps): ReactElement => {
  const { selected, setLayersOpacity, opacityValue } = props;
  const [opacity, setOpacity] = useState(opacityValue);

  useEffect(() => {
    setOpacity(opacityValue);
  }, [opacityValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setOpacity(target.value);
  };

  // const handleSliderChange = (e: any) => {
  //   handleChange(e);
  //   const paperLayer = getPaperLayer(selected[0]);
  //   let nextOpacity = evaluate(`${opacity}`);
  //   if (nextOpacity > 100) {
  //     nextOpacity = 100;
  //   }
  //   if (nextOpacity < 0) {
  //     nextOpacity = 0;
  //   }
  //   paperLayer.opacity = evaluate(`${nextOpacity} / 100`);
  // };

  const handleSubmit = (e: any) => {
    try {
      let nextOpacity = evaluate(`${opacity}`);
      if (nextOpacity !== opacityValue) {
        if (nextOpacity > 100) {
          nextOpacity = 100;
        }
        if (nextOpacity < 0) {
          nextOpacity = 0;
        }
        setLayersOpacity({layers: selected, opacity: evaluate(`${nextOpacity} / 100`)});
        setOpacity(nextOpacity);
      }
    } catch(error) {
      setOpacity(opacityValue);
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

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const opacityValue = (() => {
    switch(layer.present.selected.length) {
      case 1:
        return layer.present.byId[layer.present.selected[0]].style.opacity * 100;
      default: {
        if (selected.every((id: string) => layer.present.byId[id].style.opacity === layer.present.byId[layer.present.selected[0]].style.opacity)) {
          return layer.present.byId[layer.present.selected[0]].style.opacity * 100;
        } else {
          return 'multi';
        }
      }
    }
  })();
  return { selected, opacityValue };
};

export default connect(
  mapStateToProps,
  { setLayersOpacity }
)(OpacityInput);