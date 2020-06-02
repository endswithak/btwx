import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import { SetLayerOpacityPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerOpacity } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';

interface SidebarOpacityStylesProps {
  selected?: string[];
  opacityValue?: number;
  setLayerOpacity?(payload: SetLayerOpacityPayload): LayerTypes;
}

const SidebarOpacityStyles = (props: SidebarOpacityStylesProps): ReactElement => {
  const { selected, setLayerOpacity, opacityValue } = props;
  const [opacity, setOpacity] = useState<string | number>(opacityValue);

  useEffect(() => {
    setOpacity(opacityValue);
  }, [opacityValue, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setOpacity(target.value);
  };

  const handleSliderChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    handleChange(e);
    const paperLayer = getPaperLayer(selected[0]);
    let nextOpacity = evaluate(`${opacity}`);
    if (nextOpacity > 100) {
      nextOpacity = 100;
    }
    if (nextOpacity < 0) {
      nextOpacity = 0;
    }
    paperLayer.opacity = evaluate(`${nextOpacity} / 100`);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const paperLayer = getPaperLayer(selected[0]);
    let nextOpacity = evaluate(`${opacity}`);
    if (nextOpacity > 100) {
      nextOpacity = 100;
    }
    if (nextOpacity < 0) {
      nextOpacity = 0;
    }
    paperLayer.opacity = evaluate(`${nextOpacity} / 100`);
    setLayerOpacity({id: selected[0], opacity: evaluate(`${nextOpacity} / 100`)});
    setOpacity(nextOpacity);
  }

  return (
    <SidebarSection>
      <SidebarSectionRow alignItems={'center'}>
        <SidebarSectionColumn width={'66.66%'}>
          <SidebarSlider
            value={opacity}
            onChange={handleSliderChange}
            onMouseUp={handleSubmit} />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'33.33%'}>
          <SidebarInput
            value={opacity}
            onChange={handleChange}
            onSubmit={handleSubmit}
            blurOnSubmit
            disabled={selected.length > 1 || selected.length === 0}
            label={'%'} />
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </SidebarSection>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const opacityValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return 0;
      case 1:
        return layer.present.byId[layer.present.selected[0]].style.opacity * 100;
      default:
        return 'multi';
    }
  })();
  return { selected, opacityValue };
};

export default connect(
  mapStateToProps,
  { setLayerOpacity }
)(SidebarOpacityStyles);