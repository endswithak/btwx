import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { getSelectedRotation } from '../store/selectors/layer';
import { setLayersRotationThunk } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const RotationInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const disabled = useSelector((state: RootState) => state.layer.present.selected.some((id) => state.layer.present.byId[id].type === 'Artboard'));
  const rotationValue = useSelector((state: RootState) => getSelectedRotation(state));
  const [rotation, setRotation] = useState(rotationValue !== 'multi' ? Math.round(rotationValue) : rotationValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setRotation(rotationValue !== 'multi' ? Math.round(rotationValue) : rotationValue);
  }, [rotationValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setRotation(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      let nextRotation = mexp.eval(`${rotation}`) as any;
      if (nextRotation !== rotationValue) {
        if (nextRotation >= 360 || nextRotation <= -360) {
          nextRotation = 0;
        }
        dispatch(setLayersRotationThunk({layers: selected, rotation: Math.round(nextRotation)}));
        setRotation(Math.round(nextRotation));
      } else {
        setRotation(rotationValue !== 'multi' ? Math.round(rotationValue) : rotationValue);
      }
    } catch(error) {
      setRotation(rotationValue !== 'multi' ? Math.round(rotationValue) : rotationValue);
    }
  }

  return (
    <SidebarInput
      value={rotation}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      disabled={disabled}
      label={'°'} />
  );
}

export default RotationInput;