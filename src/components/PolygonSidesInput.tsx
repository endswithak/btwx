import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { SetPolygonsSidesPayload, LayerTypes } from '../store/actionTypes/layer';
import { setPolygonsSides } from '../store/actions/layer';
import { getPaperLayer, getSelectedPaperScopes } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';

interface PolygonSidesInputProps {
  selected?: string[];
  sidesValue?: number | 'multi';
  layerItems?: Btwx.Polygon[];
  selectedPaperScopes?: {
    [id: string]: number;
  };
  setPolygonsSides?(payload: SetPolygonsSidesPayload): LayerTypes;
}

const PolygonSidesInput = (props: PolygonSidesInputProps): ReactElement => {
  const { selected, setPolygonsSides, sidesValue, layerItems, selectedPaperScopes } = props;
  const [sides, setSides] = useState(sidesValue !== 'multi' ? Math.round(sidesValue) : sidesValue);

  useEffect(() => {
    setSides(sidesValue !== 'multi' ? Math.round(sidesValue) : sidesValue);
  }, [sidesValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setSides(target.value);
  };

  const handleSliderChange = (e: any): void => {
    handleChange(e);
    layerItems.forEach((layerItem) => {
      const paperLayerCompound = getPaperLayer(layerItem.id, selectedPaperScopes[layerItem.id]) as paper.CompoundPath;
      const paperLayer = paperLayerCompound.children[0] as paper.Path;
      const startPosition = paperLayer.position;
      paperLayer.rotation = -layerItem.transform.rotation;
      const newShape = new uiPaperScope.Path.RegularPolygon({
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
      let nextSides = mexp.eval(`${sides}`) as any;
      if (nextSides !== sidesValue) {
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
      setSides(sidesValue !== 'multi' ? Math.round(sidesValue) : sidesValue);
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
  layerItems: Btwx.Polygon[];
  selectedPaperScopes: {
    [id: string]: number;
  };
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const selectedPaperScopes = getSelectedPaperScopes(state);
  const layerItems: Btwx.Polygon[] = selected.reduce((result, current) => {
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
  return { selected, sidesValue, layerItems, selectedPaperScopes };
};

export default connect(
  mapStateToProps,
  { setPolygonsSides }
)(PolygonSidesInput);