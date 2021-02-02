import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setStarsPointsThunk } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices, getSelectedStarPoints, getSelectedById } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import MathFormGroup from './MathFormGroup';
import Form from './Form';

const StarPointsInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const formControlSliderRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const pointsValue = useSelector((state: RootState) => getSelectedStarPoints(state));
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [points, setPoints] = useState(pointsValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setPoints(pointsValue);
  }, [pointsValue, selected]);

  const handleSliderChange = (e: any): void => {
    setPoints(e.target.value);
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

  const handleSliderSubmit = (e: any): void => {
    if (e.target.value !== pointsValue) {
      dispatch(setStarsPointsThunk({layers: selected, points: e.target.value}));
    }
  }

  const handleControlSubmitSuccess = (nextPoints: any): void => {
    dispatch(setStarsPointsThunk({layers: selected, points: nextPoints}));
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'66.66%'}>
        <Form inline>
          <Form.Group controlId='control-star-points-slider'>
            <Form.Control
              ref={formControlSliderRef}
              as='input'
              value={points !== 'multi' ? points : 0}
              type='range'
              step={1}
              min={3}
              max={50}
              size='small'
              onChange={handleSliderChange}
              onMouseUp={handleSliderSubmit}
              required />
          </Form.Group>
        </Form>
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <MathFormGroup
          ref={formControlRef}
          controlId='control-star-points'
          value={points}
          min={3}
          max={50}
          size='small'
          label='Points'
          onSubmitSuccess={handleControlSubmitSuccess}
          submitOnBlur
          canvasAutoFocus />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default StarPointsInput;