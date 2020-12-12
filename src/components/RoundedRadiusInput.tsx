import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { SetRoundedRadiiPayload, LayerTypes } from '../store/actionTypes/layer';
import { setRoundedRadii } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';
import { uiPaperScope } from '../canvas';

interface RoundedRadiusInputProps {
  selected?: string[];
  radiusValue?: number | 'multi';
  layerItems?: Btwx.Rounded[];
  selectedPaperScopes?: {
    [id: string]: number;
  };
  setRoundedRadii?(payload: SetRoundedRadiiPayload): LayerTypes;
}

const RoundedRadiusInput = (props: RoundedRadiusInputProps): ReactElement => {
  const { selected, setRoundedRadii, radiusValue, layerItems, selectedPaperScopes } = props;
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
      const paperLayerCompound = getPaperLayer(layerItem.id, selectedPaperScopes[layerItem.id]) as paper.CompoundPath;
      const paperLayer = paperLayerCompound.children[0] as paper.Path;
      const nextRadius = e.target.value / 100;
      paperLayer.rotation = -layerItem.transform.rotation;
      const maxDim = Math.max(paperLayer.bounds.width, paperLayer.bounds.height);
      const newShape = new uiPaperScope.Path.Rectangle({
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
      let nextRadius = mexp.eval(`${radius}`) as any;
      if (nextRadius > 100) {
        nextRadius = 100;
      }
      if (nextRadius < 0) {
        nextRadius = 0;
      }
      if (nextRadius !== radiusValue) {
        setRoundedRadii({layers: selected, radius: Math.round(nextRadius) / 100});
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
  layerItems: Btwx.Rounded[];
  selectedPaperScopes: {
    [id: string]: number;
  };
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const selectedPaperScopes = getSelectedProjectIndices(state);
  const layerItems: Btwx.Rounded[] = selected.reduce((result, current) => {
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
  return { selected, radiusValue, layerItems, selectedPaperScopes };
};

export default connect(
  mapStateToProps,
  { setRoundedRadii }
)(RoundedRadiusInput);