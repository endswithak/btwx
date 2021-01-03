import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerCustomWiggleTweenWiggles } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const EaseEditorWiggleWigglesInput = (): ReactElement => {
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const wigglesValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].customWiggle.wiggles : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'customWiggle' : true);
  const [wiggles, setWiggles] = useState(wigglesValue);
  const dispatch = useDispatch();

  const handleWigglesChange = (e: any): void => {
    const target = e.target;
    setWiggles(target.value);
  };

  const handleWigglesSubmit = (e: any): void => {
    try {
      const wigglesRounded = Math.round(wiggles);
      if (wigglesRounded !== wigglesValue) {
        let newWiggles = wigglesRounded;
        if (wigglesRounded < 0) {
          newWiggles = 0;
        }
        dispatch(setLayerCustomWiggleTweenWiggles({id: id, wiggles: newWiggles}));
        setWiggles(newWiggles);
      } else {
        setWiggles(wigglesValue);
      }
    } catch(error) {
      setWiggles(wigglesValue);
    }
  }

  useEffect(() => {
    setWiggles(wigglesValue);
  }, [wigglesValue]);

  return (
    <SidebarInput
      value={wiggles}
      disabled={disabled}
      onChange={handleWigglesChange}
      onSubmit={handleWigglesSubmit}
      submitOnBlur
      bottomLabel='Wiggles' />
  );
}

export default EaseEditorWiggleWigglesInput;