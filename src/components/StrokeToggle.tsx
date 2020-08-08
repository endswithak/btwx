import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { EnableLayersStrokePayload, DisableLayersStrokePayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayersStroke, disableLayersStroke } from '../store/actions/layer';
import StyleToggle from './StyleToggle';

interface StrokeToggleProps {
  enabledValue?: boolean;
  selected: string[];
  enableLayersStroke?(payload: EnableLayersStrokePayload): LayerTypes;
  disableLayersStroke?(payload: DisableLayersStrokePayload): LayerTypes;
}

const StrokeToggle = (props: StrokeToggleProps): ReactElement => {
  const { enabledValue, selected, enableLayersStroke, disableLayersStroke } = props;
  const [enabled, setEnabled] = useState<boolean>(enabledValue);

  useEffect(() => {
    setEnabled(enabledValue);
  }, [enabledValue, selected]);

  const handleToggleClick = () => {
    if (enabled) {
      disableLayersStroke({layers: selected});
    } else {
      enableLayersStroke({layers: selected});
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
  const layerItems: (em.Shape | em.Text | em.Image)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const enabledValue = layerItems.every((layerItem) => layerItem.style.stroke.enabled);
  return { selected, enabledValue };
};

export default connect(
  mapStateToProps,
  { enableLayersStroke, disableLayersStroke }
)(StrokeToggle);