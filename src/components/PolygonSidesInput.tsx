import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import { SetPolygonSidesPayload, LayerTypes } from '../store/actionTypes/layer';
import { setPolygonSides } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import SidebarSection from './SidebarSection';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';
import { paperMain } from '../canvas';
import { applyShapeMethods } from '../canvas/shapeUtils';

interface PolygonSidesInputProps {
  selected?: string[];
  sidesValue?: number;
  disabled?: boolean;
  layerItem?: em.Shape;
  setPolygonSides?(payload: SetPolygonSidesPayload): LayerTypes;
}

const PolygonSidesInput = (props: PolygonSidesInputProps): ReactElement => {
  const { selected, setPolygonSides, sidesValue, disabled, layerItem } = props;
  const [sides, setSides] = useState<string | number>(sidesValue);

  useEffect(() => {
    setSides(sidesValue);
  }, [sidesValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target as HTMLInputElement;
    setSides(target.value);
  };

  const handleSliderChange = (e: any): void => {
    handleChange(e);
    const paperLayer = getPaperLayer(selected[0]);
    const center = new paperMain.Point(layerItem.master.x, layerItem.master.y);
    const newShape = new paperMain.Path.RegularPolygon({
      center: center,
      radius: Math.max(layerItem.master.width, layerItem.master.height) / 2,
      sides: e.target.value
    });
    newShape.copyAttributes(paperLayer, true);
    newShape.bounds.width = layerItem.master.width * layerItem.transform.scale.x;
    newShape.bounds.height = layerItem.master.height * layerItem.transform.scale.y;
    newShape.rotation = layerItem.transform.rotation;
    newShape.position = paperLayer.position;
    paperLayer.replaceWith(newShape);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      let nextSides = evaluate(`${sides}`);
      if (nextSides !== sidesValue) {
        if (nextSides > 10) {
          nextSides = 10;
        }
        if (nextSides < 3) {
          nextSides = 3;
        }
        const paperLayer = getPaperLayer(selected[0]);
        setPolygonSides({id: selected[0], sides: nextSides});
        setSides(nextSides);
        applyShapeMethods(paperLayer);
      }
    } catch(error) {
      setSides(sidesValue);
    }
  }

  return (
    <SidebarSection>
      <SidebarSectionRow alignItems={'center'}>
        <SidebarSectionColumn width={'66.66%'}>
          <SidebarSlider
            value={sides as number}
            step={1}
            max={10}
            min={3}
            onChange={handleSliderChange}
            onMouseUp={handleSubmit}
            disabled={disabled}
            bottomSpace />
        </SidebarSectionColumn>
        <SidebarSectionColumn width={'33.33%'}>
          <SidebarInput
            value={sides}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitOnBlur
            disabled={disabled}
            label='#'
            bottomLabel='Sides' />
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </SidebarSection>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const sidesValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return (layer.present.byId[layer.present.selected[0]] as em.Polygon).sides;
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
  return { selected, sidesValue, disabled, layerItem };
};

export default connect(
  mapStateToProps,
  { setPolygonSides }
)(PolygonSidesInput);