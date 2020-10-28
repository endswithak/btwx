import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { EnableLayersShadowPayload, DisableLayersShadowPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayersShadow, disableLayersShadow } from '../store/actions/layer';
import StyleToggle from './StyleToggle';

interface ShadowToggleProps {
  enabledValue?: boolean;
  selected: string[];
  enableLayersShadow?(payload: EnableLayersShadowPayload): LayerTypes;
  disableLayersShadow?(payload: DisableLayersShadowPayload): LayerTypes;
}

const ShadowToggle = (props: ShadowToggleProps): ReactElement => {
  const { enabledValue, selected, enableLayersShadow, disableLayersShadow } = props;
  const [enabled, setEnabled] = useState<boolean>(enabledValue);

  useEffect(() => {
    setEnabled(enabledValue);
  }, [enabledValue, selected]);

  const handleToggleClick = () => {
    if (enabled) {
      disableLayersShadow({layers: selected});
    } else {
      enableLayersShadow({layers: selected});
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
  const layerItems: (Btwx.Shape | Btwx.Text | Btwx.Image)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const enabledValue = layerItems.every((layerItem) => layerItem.style.shadow.enabled);
  return { selected, enabledValue };
};

export default connect(
  mapStateToProps,
  { enableLayersShadow, disableLayersShadow }
)(ShadowToggle);