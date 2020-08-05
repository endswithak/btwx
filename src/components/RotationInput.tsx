import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersRotationPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersRotation } from '../store/actions/layer';

interface RotationInputProps {
  selected?: string[];
  rotationValue?: number | string;
  disabled?: boolean;
  setLayersRotation?(payload: SetLayersRotationPayload): LayerTypes;
}

const RotationInput = (props: RotationInputProps): ReactElement => {
  const { selected, setLayersRotation, rotationValue, disabled } = props;
  const [rotation, setRotation] = useState(rotationValue);

  useEffect(() => {
    setRotation(rotationValue);
  }, [rotationValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setRotation(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      let nextRotation = evaluate(`${rotation}`);
      if (nextRotation !== rotationValue && !isNaN(nextRotation)) {
        if (nextRotation >= 360 || nextRotation <= -360) {
          nextRotation = 0;
        }
        setLayersRotation({layers: selected, rotation: nextRotation});
        setRotation(nextRotation);
      } else {
        setRotation(rotationValue);
      }
    } catch(error) {
      setRotation(rotationValue);
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

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: em.Layer[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const rotationValues: number[] = layerItems.reduce((result, current) => {
    const rotation = current.transform.rotation
    return [...result, rotation];
  }, []);
  const rotationValue = (() => {
    if (rotationValues.every((value: number) => value === rotationValues[0])) {
      return rotationValues[0];
    } else {
      return 'multi';
    }
  })();
  const disabled = selected.some((id) => layer.present.byId[id].type === 'Artboard');
  return { selected, rotationValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersRotation }
)(RotationInput);