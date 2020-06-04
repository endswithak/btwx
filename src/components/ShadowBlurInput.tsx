import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerShadowBlurPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerShadowBlur } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface ShadowBlurInputProps {
  shadow?: em.Shadow;
  selected?: string[];
  disabled: boolean;
  setLayerShadowBlur?(payload: SetLayerShadowBlurPayload): LayerTypes;
}

const ShadowBlurInput = (props: ShadowBlurInputProps): ReactElement => {
  const { selected, shadow, disabled, setLayerShadowBlur } = props;
  const [shadowBlur, setShadowBlur] = useState<string | number>(props.shadow.blur);

  useEffect(() => {
    setShadowBlur(props.shadow.blur);
  }, [shadow, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setShadowBlur(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      const nextBlur = evaluate(`${shadowBlur}`);
      if (nextBlur !== shadow.blur) {
        const paperLayer = getPaperLayer(selected[0]);
        paperLayer.shadowBlur = nextBlur;
        setLayerShadowBlur({id: selected[0], shadowBlur: nextBlur});
        setShadowBlur(nextBlur);
      }
    } catch(error) {
      setShadowBlur(shadow.blur);
    }
  }

  return (
    <SidebarInput
      value={shadowBlur}
      onChange={handleChange}
      onSubmit={handleSubmit}
      blurOnSubmit
      bottomLabel={'Blur'}
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
  { setLayerShadowBlur }
)(ShadowBlurInput);