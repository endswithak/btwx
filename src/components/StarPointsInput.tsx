import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import { SetStarPointsPayload, LayerTypes } from '../store/actionTypes/layer';
import { setStarPoints } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';
import { paperMain } from '../canvas';
import { applyShapeMethods } from '../canvas/shapeUtils';

interface StarPointsInputProps {
  selected?: string[];
  pointsValue?: number;
  disabled?: boolean;
  layerItem?: em.Shape;
  setStarPoints?(payload: SetStarPointsPayload): LayerTypes;
}

const StarPointsInput = (props: StarPointsInputProps): ReactElement => {
  const { selected, setStarPoints, layerItem, pointsValue, disabled } = props;
  const [points, setPoints] = useState(pointsValue);

  useEffect(() => {
    setPoints(pointsValue);
  }, [pointsValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setPoints(target.value);
  };

  const handleSliderChange = (e: any): void => {
    handleChange(e);
    const paperLayer = getPaperLayer(selected[0]);
    const maxDim = Math.max(layerItem.master.width, layerItem.master.height);
    const center = new paperMain.Point(layerItem.master.x, layerItem.master.y);
    const newShape = new paperMain.Path.Star({
      center: center,
      radius1: maxDim / 2,
      radius2: (maxDim / 2) * (layerItem as em.Star).radius,
      points: e.target.value
    });
    newShape.copyAttributes(paperLayer, true);
    newShape.bounds.width = layerItem.master.width * layerItem.transform.scale.x;
    newShape.bounds.height = layerItem.master.height * layerItem.transform.scale.y;
    newShape.rotation = layerItem.transform.rotation;
    newShape.position = paperLayer.position;
    paperLayer.replaceWith(newShape);
  };

  const handleSubmit = (e: any): void => {
    try {
      let nextPoints = evaluate(`${points}`);
      if (nextPoints !== pointsValue) {
        if (nextPoints > 50) {
          nextPoints = 50;
        }
        if (nextPoints < 3) {
          nextPoints = 3;
        }
        const paperLayer = getPaperLayer(selected[0]);
        setStarPoints({id: selected[0], points: nextPoints});
        setPoints(nextPoints);
        applyShapeMethods(paperLayer);
      }
    } catch(error) {
      setPoints(pointsValue);
    }
  }

  return (
    <SidebarSection>
      <SidebarSectionRow alignItems={'center'}>
        <SidebarSectionColumn width={'66.66%'}>
          <SidebarSlider
            value={points as number}
            step={1}
            max={50}
            min={3}
            onChange={handleSliderChange}
            onMouseUp={handleSubmit}
            disabled={disabled}
            bottomSpace />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'33.33%'}>
          <SidebarInput
            value={points}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitOnBlur
            disabled={disabled}
            label='#'
            bottomLabel='Points' />
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </SidebarSection>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const pointsValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return (layer.present.byId[layer.present.selected[0]] as em.Star).points;
      default:
        return 'multi';
    }
  })();
  const layerItem = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return null;
      case 1:
        return layer.present.byId[layer.present.selected[0]];
      default:
        return null;
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
  return { selected, pointsValue, disabled, layerItem };
};

export default connect(
  mapStateToProps,
  { setStarPoints }
)(StarPointsInput);