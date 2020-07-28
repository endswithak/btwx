import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import { SetRoundedRadiusPayload, LayerTypes } from '../store/actionTypes/layer';
import { setRoundedRadius } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';
import { paperMain } from '../canvas';
import { applyShapeMethods } from '../canvas/shapeUtils';

interface RoundedRadiusInputProps {
  selected?: string[];
  radiusValue?: number;
  disabled?: boolean;
  maxDim?: number;
  setRoundedRadius?(payload: SetRoundedRadiusPayload): LayerTypes;
}

const RoundedRadiusInput = (props: RoundedRadiusInputProps): ReactElement => {
  const { selected, setRoundedRadius, maxDim, radiusValue, disabled } = props;
  const [radius, setRadius] = useState<string | number>(Math.round((radiusValue / maxDim) * 100));

  useEffect(() => {
    setRadius(Math.round((radiusValue / maxDim) * 100));
  }, [radiusValue, selected, maxDim]);

  const handleChange = (e: any) => {
    const target = e.target as HTMLInputElement;
    setRadius(target.value);
  };

  const handleSliderChange = (e: any) => {
    handleChange(e);
    const paperLayer = getPaperLayer(selected[0]);
    const nextRadius = maxDim * (e.target.value / 100);
    const newShape = new paperMain.Path.Rectangle({
      from: paperLayer.bounds.topLeft,
      to: paperLayer.bounds.bottomRight,
      radius: nextRadius
    });
    newShape.copyAttributes(paperLayer, true);
    paperLayer.replaceWith(newShape);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      let nextRadius = evaluate(`${radius}`);
      if (nextRadius !== (radiusValue / maxDim) * 100) {
        if (nextRadius > 100) {
          nextRadius = 100;
        }
        if (nextRadius < 0) {
          nextRadius = 0;
        }
        setRoundedRadius({id: selected[0], radius: maxDim * (nextRadius / 100)});
        setRadius(nextRadius);
      }
    } catch(error) {
      setRadius(Math.round((radiusValue / maxDim) * 100));
    }
  }

  return (
    <SidebarSection>
      <SidebarSectionRow alignItems={'center'}>
        <SidebarSectionColumn width={'66.66%'}>
          <SidebarSlider
            value={radius}
            step={1}
            max={100}
            min={0}
            onChange={handleSliderChange}
            onMouseUp={handleSubmit}
            disabled={disabled}
            bottomSpace />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'33.33%'}>
          <SidebarInput
            value={radius}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitOnBlur
            disabled={disabled}
            label='%'
            bottomLabel='Radius' />
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </SidebarSection>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const radiusValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return layer.present.byId[layer.present.selected[0]].points.radius;
      default:
        return 'multi';
    }
  })();
  const disabled = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return true;
      case 1:
        return false;
      default:
        return true;
    }
  })();
  const maxDim = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return null;
      case 1: {
        const layerItem = layer.present.byId[layer.present.selected[0]];
        return Math.max(layerItem.frame.width, layerItem.frame.height) / 2;
      }
      default:
        return null;
    }
  })();
  return { selected, radiusValue, disabled, maxDim };
};

export default connect(
  mapStateToProps,
  { setRoundedRadius }
)(RoundedRadiusInput);