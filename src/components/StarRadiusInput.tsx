import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { paperMain } from '../canvas';
import { RootState } from '../store/reducers';
import { setStarsRadiusThunk } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices, getSelectedStarRadius, getSelectedById } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import PercentageFormGroup from './PercentageFormGroup';
import Form from './Form';

const StarRadiusInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const formControlSliderRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const radiusValue = useSelector((state: RootState) => getSelectedStarRadius(state));
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [radius, setRadius] = useState(radiusValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setRadius(radiusValue);
  }, [radiusValue, selected]);

  const handleSliderChange = (e: any): void => {
    setRadius(e.target.value);
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
        radius2: (maxDim / 2) * e.target.value,
        points: (layerItem as Btwx.Star).points,
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
    if (e.target.value !== radiusValue) {
      dispatch(setStarsRadiusThunk({layers: selected, radius: e.target.value}));
    }
  }

  const handleControlSubmitSuccess = (nextRadius: any): void => {
    dispatch(setStarsRadiusThunk({layers: selected, radius: nextRadius}));
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'66.66%'}>
        <Form inline>
          <Form.Group controlId='control-star-radius-slider'>
            <Form.Control
              ref={formControlSliderRef}
              as='input'
              value={radius !== 'multi' ? radius : 0}
              type='range'
              step={0.01}
              min={0}
              max={1}
              size='small'
              onChange={handleSliderChange}
              onMouseUp={handleSliderSubmit}
              required />
          </Form.Group>
        </Form>
      </SidebarSectionColumn>
      <SidebarSectionColumn width={'33.33%'}>
        <PercentageFormGroup
          ref={formControlRef}
          controlId='control-star-radius'
          value={radius}
          size='small'
          label='Radius'
          onSubmitSuccess={handleControlSubmitSuccess}
          submitOnBlur
          canvasAutoFocus />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default StarRadiusInput;