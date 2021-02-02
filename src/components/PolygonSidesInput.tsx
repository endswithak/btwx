import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { paperMain } from '../canvas';
import { RootState } from '../store/reducers';
import { setPolygonsSidesThunk } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices, getSelectedPolygonSides, getSelectedById } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import MathFormGroup from './MathFormGroup';
import Form from './Form';

const PolygonSidesInput = (): ReactElement => {
  const formControlRef = useRef(null);
  const formControlSliderRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const sidesValue = useSelector((state: RootState) => getSelectedPolygonSides(state));
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [sides, setSides] = useState(sidesValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setSides(sidesValue);
  }, [sidesValue, selected]);

  const handleSliderChange = (e: any): void => {
    setSides(e.target.value);
    Object.keys(selectedById).forEach((key) => {
      const layerItem = selectedById[key];
      const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
      const paperLayerCompound = getPaperLayer(layerItem.id, selectedProjectIndices[layerItem.id]) as paper.CompoundPath;
      const paperLayer = paperLayerCompound.children[0] as paper.Path;
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
      if (isMask) {
        const maskGroup = paperLayerCompound.parent;
        const mask = maskGroup.children[0] as paper.Path;
        mask.pathData = newShape.pathData;
      }
    });
  };

  const handleSliderSubmit = (e: any): void => {
    if (e.target.value !== sidesValue) {
      dispatch(setPolygonsSidesThunk({layers: selected, sides: e.target.value}));
    }
  }

  const handleControlSubmitSuccess = (nextSides: any): void => {
    dispatch(setPolygonsSidesThunk({layers: selected, sides: nextSides}));
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width={'66.66%'}>
        <Form inline>
          <Form.Group controlId='control-polygon-sides-slider'>
            <Form.Control
              ref={formControlSliderRef}
              as='input'
              value={sides !== 'multi' ? sides : 0}
              type='range'
              step={1}
              min={3}
              max={10}
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
          controlId='control-polygon-sides'
          value={sides}
          min={3}
          max={10}
          size='small'
          label='Sides'
          onSubmitSuccess={handleControlSubmitSuccess}
          submitOnBlur
          canvasAutoFocus />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default PolygonSidesInput;