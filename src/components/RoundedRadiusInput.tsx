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
  layerItem?: em.Layer;
  setRoundedRadius?(payload: SetRoundedRadiusPayload): LayerTypes;
}

const RoundedRadiusInput = (props: RoundedRadiusInputProps): ReactElement => {
  const { selected, setRoundedRadius, radiusValue, disabled, layerItem } = props;
  const [radius, setRadius] = useState(Math.round(radiusValue * 100));

  useEffect(() => {
    setRadius(Math.round(radiusValue * 100));
  }, [radiusValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setRadius(target.value);
  };

  const handleSliderChange = (e: any) => {
    handleChange(e);
    const paperLayer = getPaperLayer(selected[0]);
    const nextRadius = e.target.value / 100;
    const maxDim = Math.max(layerItem.master.width, layerItem.master.height);
    const newShape = new paperMain.Path.Rectangle({
      from: new paperMain.Point(layerItem.master.x - (layerItem.master.width / 2), layerItem.master.y - (layerItem.master.height / 2)),
      to: new paperMain.Point(layerItem.master.x + (layerItem.master.width / 2), layerItem.master.y + (layerItem.master.height / 2)),
      radius: (maxDim / 2) * nextRadius
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
      let nextRadius = evaluate(`${radius}`);
      if (nextRadius !== radiusValue) {
        if (nextRadius > 100) {
          nextRadius = 100;
        }
        if (nextRadius < 0) {
          nextRadius = 0;
        }
        const paperLayer = getPaperLayer(selected[0]);
        setRoundedRadius({id: selected[0], radius: nextRadius / 100});
        setRadius(nextRadius);
        applyShapeMethods(paperLayer);
      }
    } catch(error) {
      setRadius(Math.round(radiusValue * 100));
    }
  }

  return (
    <SidebarSectionRow>
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
        return (layer.present.byId[layer.present.selected[0]] as em.Rounded).radius;
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
  const layerItem = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return null;
      case 1: {
        return layer.present.byId[layer.present.selected[0]];
      }
      default:
        return null;
    }
  })();
  return { selected, radiusValue, disabled, layerItem };
};

export default connect(
  mapStateToProps,
  { setRoundedRadius }
)(RoundedRadiusInput);