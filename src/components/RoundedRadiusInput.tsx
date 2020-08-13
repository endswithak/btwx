import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import { SetRoundedRadiiPayload, LayerTypes } from '../store/actionTypes/layer';
import { setRoundedRadii } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';
import { paperMain } from '../canvas';

interface RoundedRadiusInputProps {
  selected?: string[];
  radiusValue?: number | 'multi';
  layerItems?: em.Rounded[];
  setRoundedRadii?(payload: SetRoundedRadiiPayload): LayerTypes;
}

const RoundedRadiusInput = (props: RoundedRadiusInputProps): ReactElement => {
  const { selected, setRoundedRadii, radiusValue, layerItems } = props;
  const [radius, setRadius] = useState(radiusValue !== 'multi' ? Math.round(radiusValue * 100) : radiusValue);

  useEffect(() => {
    setRadius(radiusValue !== 'multi' ? Math.round(radiusValue * 100) : radiusValue);
  }, [radiusValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setRadius(target.value);
  };

  const handleSliderChange = (e: any) => {
    handleChange(e);
    layerItems.forEach((layerItem) => {
      const paperLayer = getPaperLayer(layerItem.id) as paper.Path;
      const nextRadius = e.target.value / 100;
      paperLayer.rotation = -layerItem.transform.rotation;
      const maxDim = Math.max(paperLayer.bounds.width, paperLayer.bounds.height);
      const newShape = new paperMain.Path.Rectangle({
        from: paperLayer.bounds.topLeft,
        to: paperLayer.bounds.bottomRight,
        radius: (maxDim / 2) * nextRadius,
        insert: false
      });
      paperLayer.pathData = newShape.pathData;
      paperLayer.rotation = layerItem.transform.rotation;
    });
  };

  const handleSubmit = (e: any): void => {
    try {
      let nextRadius = evaluate(`${radius}`);
      if (nextRadius !== radiusValue) {
        if (nextRadius > 100) {
          nextRadius = 100;
        }
        if (nextRadius < 0) {
          nextRadius = 0;
        }
        setRoundedRadii({layers: selected, radius: nextRadius / 100});
        setRadius(nextRadius);
      }
    } catch(error) {
      setRadius(radiusValue !== 'multi' ? Math.round(radiusValue * 100) : radiusValue);
    }
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'66.66%'}>
        <SidebarSlider
          value={radius !== 'multi' ? radius : 0}
          step={1}
          max={100}
          min={0}
          onChange={handleSliderChange}
          onMouseUp={handleSubmit}
          bottomSpace />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={radius}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitOnBlur
          label='%'
          bottomLabel='Radius' />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  radiusValue: number | 'multi';
  layerItems: em.Rounded[];
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: em.Rounded[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const radiusValues: number[] = layerItems.reduce((result, current) => {
    return [...result, current.radius];
  }, []);
  const radiusValue = (() => {
    if (radiusValues.every((value: number) => value === radiusValues[0])) {
      return radiusValues[0];
    } else {
      return 'multi';
    }
  })();
  return { selected, radiusValue, layerItems };
};

export default connect(
  mapStateToProps,
  { setRoundedRadii }
)(RoundedRadiusInput);