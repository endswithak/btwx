/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { paperMain } from '../canvas';
import { setStarsPointsThunk } from '../store/actions/layer';
import { getPaperLayer, getSelectedProjectIndices, getSelectedStarPoints, getSelectedById } from '../store/selectors/layer';
import { clearLayerTransforms, applyLayerTransforms } from '../store/utils/paper';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import MathFormGroup from './MathFormGroup';
import Form from './Form';

const StarPointsInput = (): ReactElement => {
  const minPoints = 3;
  const maxPoints = 50;
  // const isMac = remote.process.platform === 'darwin';
  const formControlRef = useRef(null);
  const formControlSliderRef = useRef(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const selectedProjectIndices = useSelector((state: RootState) => getSelectedProjectIndices(state));
  const pointsValue = useSelector((state: RootState) => getSelectedStarPoints(state));
  const selectedById = useSelector((state: RootState) => getSelectedById(state));
  const [points, setPoints] = useState(pointsValue);
  const dispatch = useDispatch();

  // const debouncePoints = useCallback(
  //   debounce((points: number) => {
  //     dispatch(setStarsPointsThunk({layers: selected, points: points}));
  //   }, 150),
  //   []
  // );

  useEffect(() => {
    setPoints(pointsValue);
  }, [pointsValue, selected]);

  const handleSliderChange = (newPoints: number): void => {
    setPoints(newPoints);
    Object.keys(selectedById).forEach((key) => {
      const layerItem = selectedById[key];
      const isMask = layerItem.type === 'Shape' && (layerItem as Btwx.Shape).mask;
      const paperLayerCompound = getPaperLayer(layerItem.id, selectedProjectIndices[layerItem.id]) as paper.CompoundPath;
      const paperLayer = paperLayerCompound.children[0] as paper.Path;
      const startPosition = paperLayer.position;
      clearLayerTransforms({
        layerType: 'Shape',
        paperLayer,
        transform: layerItem.transform
      });
      const maxDim = Math.max(paperLayer.bounds.width, paperLayer.bounds.height);
      const newShape = new paperMain.Path.Star({
        center: paperLayer.bounds.center,
        radius1: maxDim / 2,
        radius2: (maxDim / 2) * (layerItem as Btwx.Star).radius,
        points: newPoints,
        insert: false
      });
      newShape.bounds.width = paperLayer.bounds.width;
      newShape.bounds.height = paperLayer.bounds.height;
      applyLayerTransforms({
        paperLayer: newShape,
        transform: layerItem.transform
      });
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
      // buildPointsTouchBar(e.target.value);
    }
  }

  const handleControlSubmitSuccess = (nextPoints: any): void => {
    dispatch(setStarsPointsThunk({layers: selected, points: nextPoints}));
    // buildPointsTouchBar(nextPoints);
  }

  // const buildPointsTouchBar = (opt = points): void => {
  //   if (isMac) {
  //     const { TouchBarSlider } = remote.TouchBar;
  //     const pointsSlider = new TouchBarSlider({
  //       label: 'Points',
  //       value: opt !== 'multi' ? parseInt(opt) : 0,
  //       minValue: minPoints,
  //       maxValue: maxPoints,
  //       change: (newValue): void => {
  //         handleSliderChange(newValue);
  //         debouncePoints(newValue);
  //       }
  //     });
  //     const newTouchBar = new remote.TouchBar({
  //       items: [pointsSlider]
  //     });
  //     remote.getCurrentWindow().setTouchBar(newTouchBar);
  //   }
  // }

  // const handleSliderFocus = (): void => {
  //   buildPointsTouchBar();
  // }

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
              min={minPoints}
              max={maxPoints}
              size='small'
              onChange={(e: any) => handleSliderChange(e.target.value)}
              // onFocus={handleSliderFocus}
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
          min={minPoints}
          max={maxPoints}
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