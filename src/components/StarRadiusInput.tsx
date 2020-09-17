import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { SetStarsRadiusPayload, LayerTypes } from '../store/actionTypes/layer';
import { setStarsRadius } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';
import { paperMain } from '../canvas';

interface StarRadiusInputProps {
  selected?: string[];
  radiusValue?: number | 'multi';
  layerItems?: em.Star[];
  setStarsRadius?(payload: SetStarsRadiusPayload): LayerTypes;
}

const StarRadiusInput = (props: StarRadiusInputProps): ReactElement => {
  const { selected, setStarsRadius, layerItems, radiusValue } = props;
  const [radius, setRadius] = useState(radiusValue !== 'multi' ? Math.round(radiusValue * 100) : radiusValue);

  useEffect(() => {
    setRadius(radiusValue !== 'multi' ? Math.round(radiusValue * 100) : radiusValue);
  }, [radiusValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setRadius(target.value);
  };

  const handleSliderChange = (e: any): void => {
    handleChange(e);
    layerItems.forEach((layerItem) => {
      const paperLayerCompound = getPaperLayer(layerItem.id) as paper.CompoundPath;
      const paperLayer = paperLayerCompound.children[0] as paper.Path;
      const startPosition = paperLayer.position;
      paperLayer.rotation = -layerItem.transform.rotation;
      const maxDim = Math.max(paperLayer.bounds.width, paperLayer.bounds.height);
      const newShape = new paperMain.Path.Star({
        center: paperLayer.bounds.center,
        radius1: maxDim / 2,
        radius2: (maxDim / 2) * (e.target.value / 100),
        points: (layerItem as em.Star).points,
        insert: false
      });
      newShape.bounds.width = paperLayer.bounds.width;
      newShape.bounds.height = paperLayer.bounds.height;
      newShape.rotation = layerItem.transform.rotation;
      newShape.position = startPosition;
      paperLayer.pathData = newShape.pathData;
    });
  };

  const handleSubmit = (e: any): void => {
    try {
      let nextRadius = mexp.eval(`${radius}`) as any;
      if (nextRadius > 100) {
        nextRadius = 100;
      }
      if (nextRadius < 0) {
        nextRadius = 0;
      }
      if (nextRadius !== radiusValue) {
        setStarsRadius({layers: selected, radius: Math.round(nextRadius) / 100});
        setRadius(Math.round(nextRadius));
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
  layerItems: em.Star[];
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: em.Star[] = selected.reduce((result, current) => {
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
  { setStarsRadius }
)(StarRadiusInput);