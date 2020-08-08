import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { EnableLayersFillPayload, DisableLayersFillPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayersFill, disableLayersFill } from '../store/actions/layer';
import StyleToggle from './StyleToggle';

interface FillToggleProps {
  enabledValue?: boolean;
  selected: string[];
  enableLayersFill?(payload: EnableLayersFillPayload): LayerTypes;
  disableLayersFill?(payload: DisableLayersFillPayload): LayerTypes;
}

const FillToggle = (props: FillToggleProps): ReactElement => {
  const { enabledValue, selected, enableLayersFill, disableLayersFill } = props;
  const [enabled, setEnabled] = useState<boolean>(enabledValue);

  useEffect(() => {
    setEnabled(enabledValue);
  }, [enabledValue, selected]);

  const handleToggleClick = () => {
    if (enabled) {
      disableLayersFill({layers: selected});
    } else {
      enableLayersFill({layers: selected});
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
  const layerItems: (em.Shape | em.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const enabledValue = layerItems.every((layerItem) => layerItem.style.fill.enabled);
  return { selected, enabledValue };
};

export default connect(
  mapStateToProps,
  { enableLayersFill, disableLayersFill }
)(FillToggle);