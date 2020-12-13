import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { uiPaperScope } from '../canvas';
import { RootState } from '../store/reducers';
import { setStarsRadius } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices, getSelectedStarRadius, getSelectedById } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';

const StarRadiusInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedPaperScopes = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const radiusValue = useSelector((state: RootState) => getSelectedStarRadius(state));
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [radius, setRadius] = useState(radiusValue !== 'multi' ? Math.round(radiusValue * 100) : radiusValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setRadius(radiusValue !== 'multi' ? Math.round(radiusValue * 100) : radiusValue);
  }, [radiusValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setRadius(target.value);
  };

  const handleSliderChange = (e: any): void => {
    handleChange(e);
    Object.keys(selectedById).forEach((key) => {
      const layerItem = selectedById[key];
      const paperLayerCompound = getPaperLayer(layerItem.id, selectedPaperScopes[layerItem.id]) as paper.CompoundPath;
      const paperLayer = paperLayerCompound.children[0] as paper.Path;
      const startPosition = paperLayer.position;
      paperLayer.rotation = -layerItem.transform.rotation;
      const maxDim = Math.max(paperLayer.bounds.width, paperLayer.bounds.height);
      const newShape = new uiPaperScope.Path.Star({
        center: paperLayer.bounds.center,
        radius1: maxDim / 2,
        radius2: (maxDim / 2) * (e.target.value / 100),
        points: (layerItem as Btwx.Star).points,
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
        dispatch(setStarsRadius({layers: selected, radius: Math.round(nextRadius) / 100}));
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

export default StarRadiusInput;