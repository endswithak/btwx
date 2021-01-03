import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerRoughTweenPoints } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const EaseEditorRoughPointsInput = (): ReactElement => {
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const pointsValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough.points : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'rough' : true);
  const [points, setPoints] = useState(pointsValue);
  const dispatch = useDispatch();

  const handlePointsChange = (e: any): void => {
    const target = e.target;
    setPoints(target.value);
  };

  const handlePointsSubmit = (e: any): void => {
    try {
      const pointsRounded = Math.round(points);
      if (pointsRounded !== pointsValue) {
        let newPoints = pointsRounded;
        if (pointsRounded < 0) {
          newPoints = 0;
        }
        dispatch(setLayerRoughTweenPoints({id: id, points: newPoints}));
        setPoints(newPoints);
      } else {
        setPoints(pointsValue);
      }
    } catch(error) {
      setPoints(pointsValue);
    }
  }

  useEffect(() => {
    setPoints(pointsValue);
  }, [pointsValue]);

  return (
    <SidebarInput
      value={points}
      disabled={disabled}
      onChange={handlePointsChange}
      onSubmit={handlePointsSubmit}
      submitOnBlur
      bottomLabel='Points' />
  );
}

export default EaseEditorRoughPointsInput;