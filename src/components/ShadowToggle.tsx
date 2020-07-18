import paper from 'paper';
import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { EnableLayerShadowPayload, DisableLayerShadowPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerShadow, disableLayerShadow } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import StyleToggle from './StyleToggle';

interface ShadowToggleProps {
  shadow?: em.Shadow;
  selected: string[];
  enableLayerShadow?(payload: EnableLayerShadowPayload): LayerTypes;
  disableLayerShadow?(payload: DisableLayerShadowPayload): LayerTypes;
}

const ShadowToggle = (props: ShadowToggleProps): ReactElement => {
  const { shadow, selected, enableLayerShadow, disableLayerShadow } = props;
  const [enabled, setEnabled] = useState<boolean>(shadow.enabled);

  useEffect(() => {
    setEnabled(shadow.enabled);
  }, [shadow, selected]);

  const handleToggleClick = () => {
    if (enabled) {
      disableLayerShadow({id: selected[0]});
    } else {
      enableLayerShadow({id: selected[0]});
    }
  };

  return (
    <StyleToggle
      styleEnabled={enabled}
      setStyleEnabled={handleToggleClick} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const shadow = layer.present.byId[layer.present.selected[0]].style.shadow;
  return { selected, shadow };
};

export default connect(
  mapStateToProps,
  { enableLayerShadow, disableLayerShadow }
)(ShadowToggle);