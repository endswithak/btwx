import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { SetStarsPointsPayload, LayerTypes } from '../store/actionTypes/layer';
import { setStarsPoints } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';
import { paperMain } from '../canvas';

interface StarPointsInputProps {
  selected?: string[];
  pointsValue?: number | 'multi';
  layerItems?: Btwx.Star[];
  setStarsPoints?(payload: SetStarsPointsPayload): LayerTypes;
}

const StarPointsInput = (props: StarPointsInputProps): ReactElement => {
  const { selected, setStarsPoints, layerItems, pointsValue } = props;
  const [points, setPoints] = useState(pointsValue !== 'multi' ? Math.round(pointsValue) : pointsValue);

  useEffect(() => {
    setPoints(pointsValue !== 'multi' ? Math.round(pointsValue) : pointsValue);
  }, [pointsValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setPoints(target.value);
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
        radius2: (maxDim / 2) * (layerItem as Btwx.Star).radius,
        points: e.target.value,
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
      let nextPoints = mexp.eval(`${points}`) as any;
      if (nextPoints !== pointsValue) {
        if (Math.round(nextPoints) > 50) {
          nextPoints = 50;
        }
        if (Math.round(nextPoints) < 3) {
          nextPoints = 3;
        }
        setStarsPoints({layers: selected, points: Math.round(nextPoints)});
        setPoints(Math.round(nextPoints));
      }
    } catch(error) {
      setPoints(pointsValue !== 'multi' ? Math.round(pointsValue) : pointsValue);
    }
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'66.66%'}>
        <SidebarSlider
          value={points !== 'multi' ? points : 0}
          step={1}
          max={50}
          min={3}
          onChange={handleSliderChange}
          onMouseUp={handleSubmit}
          bottomSpace />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={points}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitOnBlur
          label='#'
          bottomLabel='Points' />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  pointsValue: number | 'multi';
  layerItems: Btwx.Star[];
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: Btwx.Star[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const pointsValues: number[] = layerItems.reduce((result, current) => {
    return [...result, current.points];
  }, []);
  const pointsValue = (() => {
    if (pointsValues.every((value: number) => value === pointsValues[0])) {
      return pointsValues[0];
    } else {
      return 'multi';
    }
  })();
  return { selected, pointsValue, layerItems };
};

export default connect(
  mapStateToProps,
  { setStarsPoints }
)(StarPointsInput);