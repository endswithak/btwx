import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setStarsPointsThunk } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices, getSelectedStarPoints, getSelectedById } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarInput from './SidebarInput';
import SidebarSlider from './SidebarSlider';

const StarPointsInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const pointsValue = useSelector((state: RootState) => getSelectedStarPoints(state));
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [points, setPoints] = useState(pointsValue !== 'multi' ? Math.round(pointsValue) : pointsValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setPoints(pointsValue !== 'multi' ? Math.round(pointsValue) : pointsValue);
  }, [pointsValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setPoints(target.value);
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
      if (isMask) {
        const maskGroup = paperLayerCompound.parent;
        const mask = maskGroup.children[0] as paper.Path;
        mask.pathData = newShape.pathData;
      }
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
        dispatch(setStarsPointsThunk({layers: selected, points: Math.round(nextPoints)}));
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

export default StarPointsInput;