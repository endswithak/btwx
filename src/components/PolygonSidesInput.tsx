import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { setPolygonsSidesThunk } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices, getSelectedPolygonSides, getSelectedById } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';

const PolygonSidesInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const sidesValue = useSelector((state: RootState) => getSelectedPolygonSides(state));
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [sides, setSides] = useState(sidesValue !== 'multi' ? Math.round(sidesValue) : sidesValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setSides(sidesValue !== 'multi' ? Math.round(sidesValue) : sidesValue);
  }, [sidesValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setSides(target.value);
  };

  const handleSliderChange = (e: any): void => {
    handleChange(e);
    Object.keys(selectedById).forEach((key) => {
      const layerItem = selectedById[key];
      const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
      const paperLayerCompound = getPaperLayer(layerItem.id, selectedProjectIndices[layerItem.id]) as paper.CompoundPath;
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
      if (isMask) {
        const maskGroup = paperLayerCompound.parent;
        const mask = maskGroup.children[0] as paper.Path;
        mask.pathData = newShape.pathData;
      }
    });
  };

  const handleSubmit = (e: any): void => {
    try {
      let nextSides = mexp.eval(`${sides}`) as any;
      if (nextSides !== sidesValue) {
        if (Math.round(nextSides) > 10) {
          nextSides = 10;
        }
        if (Math.round(nextSides) < 3) {
          nextSides = 3;
        }
        dispatch(setPolygonsSidesThunk({layers: selected, sides: Math.round(nextSides)}));
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

export default PolygonSidesInput;