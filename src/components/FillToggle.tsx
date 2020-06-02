import paper from 'paper';
import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import chroma from 'chroma-js';
import { RootState } from '../store/reducers';
import { EnableLayerFillPayload, DisableLayerFillPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerFill, disableLayerFill } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import StyleToggle from './StyleToggle';

interface FillToggleProps {
  fill?: em.Fill;
  selected: string[];
  enableLayerFill?(payload: EnableLayerFillPayload): LayerTypes;
  disableLayerFill?(payload: DisableLayerFillPayload): LayerTypes;
}

const FillToggle = (props: FillToggleProps): ReactElement => {
  const { fill, selected, enableLayerFill, disableLayerFill } = props;
  const [enabled, setEnabled] = useState<boolean>(fill.enabled);

  useEffect(() => {
    setEnabled(fill.enabled);
  }, [fill, selected]);

  const handleToggleClick = () => {
    const paperLayer = getPaperLayer(selected[0]);
    if (enabled) {
      disableLayerFill({id: selected[0]});
      paperLayer.fillColor = null;
    } else {
      enableLayerFill({id: selected[0]});
      paperLayer.fillColor = new paper.Color(fill.color);
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
  const fill = layer.present.byId[layer.present.selected[0]].style.fill;
  return { selected, fill };
};

export default connect(
  mapStateToProps,
  { enableLayerFill, disableLayerFill }
)(FillToggle);