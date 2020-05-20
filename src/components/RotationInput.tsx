import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerRotationPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerRotation } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface RotationInputProps {
  selected?: string[];
  rotationValue?: number | string;
  setLayerRotation?(payload: SetLayerRotationPayload): LayerTypes;
}

const RotationInput = (props: RotationInputProps): ReactElement => {
  const { selected, setLayerRotation, rotationValue } = props;
  const [rotation, setRotation] = useState<string | number>(rotationValue);

  useEffect(() => {
    setRotation(rotationValue);
  }, [rotationValue, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setRotation(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.rotation = -rotationValue;
    paperLayer.rotation = evaluate(`${rotation}`);
    setLayerRotation({id: selected[0], rotation: evaluate(`${rotation}`)});
    setRotation(evaluate(`${rotation}`));
  }

  return (
    <SidebarInput
      value={rotation}
      onChange={handleChange}
      onSubmit={handleSubmit}
      blurOnSubmit
      label={'°'}
      disabled={selected.length > 1 || selected.length === 0} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const rotationValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return Math.round(layer.present.byId[layer.present.selected[0]].style.rotation);
      default:
        return 'multi';
    }
  })();
  return { selected, rotationValue };
};

export default connect(
  mapStateToProps,
  { setLayerRotation }
)(RotationInput);