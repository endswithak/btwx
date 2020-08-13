import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import { RootState } from '../store/reducers';
import { SetPolygonsSidesPayload, LayerTypes } from '../store/actionTypes/layer';
import { setPolygonsSides } from '../store/actions/layer';
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
  sidesValue?: number | 'multi';
  layerItems?: em.Polygon[];
  setPolygonsSides?(payload: SetPolygonsSidesPayload): LayerTypes;
}

const PolygonSidesInput = (props: PolygonSidesInputProps): ReactElement => {
  const { selected, setPolygonsSides, sidesValue, layerItems } = props;
  const [sides, setSides] = useState(sidesValue);

  useEffect(() => {
    setSides(sidesValue);
  }, [sidesValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setSides(target.value);
  };

  const handleSliderChange = (e: any): void => {
    handleChange(e);
    layerItems.forEach((layerItem) => {
      const paperLayer = getPaperLayer(layerItem.id) as paper.Path;
      const startPosition = paperLayer.position;
      paperLayer.rotation = -layerItem.transform.rotation;
      const newShape = new paperMain.Path.RegularPolygon({
        center: paperLayer.bounds.center,
        radius: Math.max(paperLayer.bounds.width, paperLayer.bounds.height) / 2,
        sides: e.target.value,
        insert: false
      });
      newShape.bounds.width = paperLayer.bounds.width;
      newShape.bounds.height = paperLayer.bounds.height;
      newShape.rotation = layerItem.transform.rotation;
      newShape.position = startPosition;
      paperLayer.pathData = newShape.pathData;
    });
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      let nextSides = evaluate(`${sides}`);
      if (Math.round(nextSides) !== sidesValue) {
        if (Math.round(nextSides) > 10) {
          nextSides = 10;
        }
        if (Math.round(nextSides) < 3) {
          nextSides = 3;
        }
        setPolygonsSides({layers: selected, sides: Math.round(nextSides)});
        setSides(Math.round(nextSides));
      }
    } catch(error) {
      setSides(sidesValue);
    }
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'66.66%'}>
        <SidebarSlider
          value={sides !== 'multi' ? sides : 0}
          step={1}
          max={10}
          min={3}
          onChange={handleSliderChange}
          onMouseUp={handleSubmit}
          bottomSpace />
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <SidebarInput
          value={sides}
          onChange={handleChange}
          onSubmit={handleSubmit}
          submitOnBlur
          label='#'
          bottomLabel='Sides' />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

const mapStateToProps = (state: RootState): {
  selected: string[];
  sidesValue: number | 'multi';
  layerItems: em.Polygon[];
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: em.Polygon[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const sidesValues: number[] = layerItems.reduce((result, current) => {
    return [...result, current.sides];
  }, []);
  const sidesValue = (() => {
    if (sidesValues.every((value: number) => value === sidesValues[0])) {
      return sidesValues[0];
    } else {
      return 'multi';
    }
  })();
  return { selected, sidesValue, layerItems };
};

export default connect(
  mapStateToProps,
  { setPolygonsSides }
)(PolygonSidesInput);