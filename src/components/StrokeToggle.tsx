import paper from 'paper';
import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { EnableLayerStrokePayload, DisableLayerStrokePayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerStroke, disableLayerStroke } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import StyleToggle from './StyleToggle';

interface StrokeToggleProps {
  stroke?: {
    enabled: boolean;
    color: string;
    width: number;
  };
  selected: string[];
  enableLayerStroke?(payload: EnableLayerStrokePayload): LayerTypes;
  disableLayerStroke?(payload: DisableLayerStrokePayload): LayerTypes;
}

const StrokeToggle = (props: StrokeToggleProps): ReactElement => {
  const { stroke, selected, enableLayerStroke, disableLayerStroke } = props;
  const [enabled, setEnabled] = useState<boolean>(stroke.enabled);

  useEffect(() => {
    setEnabled(stroke.enabled);
  }, [stroke, selected]);

  const handleToggleClick = () => {
    const paperLayer = getPaperLayer(selected[0]);
    if (enabled) {
      disableLayerStroke({id: selected[0]});
      paperLayer.strokeColor = null;
    } else {
      enableLayerStroke({id: selected[0]});
      paperLayer.strokeColor = new paper.Color(stroke.color);
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
  const stroke = layer.present.byId[layer.present.selected[0]].style.stroke;
  return { selected, stroke };
};

export default connect(
  mapStateToProps,
  { enableLayerStroke, disableLayerStroke }
)(StrokeToggle);