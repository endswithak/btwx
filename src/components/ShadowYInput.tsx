import paper from 'paper';
import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerShadowYOffsetPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerShadowYOffset } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface ShadowYInputProps {
  shadow?: em.Shadow;
  selected?: string[];
  disabled: boolean;
  setLayerShadowYOffset?(payload: SetLayerShadowYOffsetPayload): LayerTypes;
}

const ShadowYInput = (props: ShadowYInputProps): ReactElement => {
  const { selected, shadow, disabled, setLayerShadowYOffset } = props;
  const [shadowYOffset, setShadowYOffset] = useState<string | number>(props.shadow.offset.y);

  useEffect(() => {
    setShadowYOffset(props.shadow.offset.y);
  }, [shadow, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setShadowYOffset(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.shadowOffset = new paper.Point(shadow.offset.x, evaluate(`${shadowYOffset}`));
    setLayerShadowYOffset({id: selected[0], shadowYOffset: evaluate(`${shadowYOffset}`)});
    setShadowYOffset(evaluate(`${shadowYOffset}`));
  }

  return (
    <SidebarInput
      value={shadowYOffset}
      onChange={handleChange}
      onSubmit={handleSubmit}
      blurOnSubmit
      bottomLabel={'Y'}
      disabled={disabled} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const shadow = layer.present.byId[layer.present.selected[0]].style.shadow;
  const disabled = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return true;
      case 1:
        return !layer.present.byId[layer.present.selected[0]].style.shadow.enabled;
      default:
        return true;
    }
  })();
  return { selected, shadow, disabled };
};

export default connect(
  mapStateToProps,
  { setLayerShadowYOffset }
)(ShadowYInput);