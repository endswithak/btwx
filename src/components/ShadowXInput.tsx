import paper from 'paper';
import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerShadowXOffsetPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerShadowXOffset } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface ShadowXInputProps {
  shadow?: em.Shadow;
  selected?: string[];
  disabled: boolean;
  setLayerShadowXOffset?(payload: SetLayerShadowXOffsetPayload): LayerTypes;
}

const ShadowXInput = (props: ShadowXInputProps): ReactElement => {
  const { selected, shadow, disabled, setLayerShadowXOffset } = props;
  const [shadowXOffset, setShadowXOffset] = useState<string | number>(props.shadow.offset.x);

  useEffect(() => {
    setShadowXOffset(props.shadow.offset.x);
  }, [shadow, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setShadowXOffset(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      const newXOffset = evaluate(`${shadowXOffset}`);
      if (newXOffset !== shadow.offset.x) {
        const paperLayer = getPaperLayer(selected[0]);
        paperLayer.shadowOffset = new paper.Point(newXOffset, shadow.offset.y);
        setLayerShadowXOffset({id: selected[0], shadowXOffset: newXOffset});
        setShadowXOffset(newXOffset);
      }
    } catch(error) {
      setShadowXOffset(shadow.offset.x);
    }
  }

  return (
    <SidebarInput
      value={shadowXOffset}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      bottomLabel={'X'}
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
  { setLayerShadowXOffset }
)(ShadowXInput);