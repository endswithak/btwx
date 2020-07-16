import paper from 'paper';
import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerStrokeWidthPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerStrokeWidth } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface StrokeWidthInputProps {
  stroke?: em.Stroke;
  selected?: string[];
  disabled?: boolean;
  setLayerStrokeWidth?(payload: SetLayerStrokeWidthPayload): LayerTypes;
}

const StrokeWidthInput = (props: StrokeWidthInputProps): ReactElement => {
  const { stroke, selected, disabled, setLayerStrokeWidth } = props;
  const [strokeWidth, setStrokeWidth] = useState<number | string>(stroke.width);

  useEffect(() => {
    setStrokeWidth(stroke.width);
  }, [stroke, selected]);

  const handleStrokeWidthChange = (e: any): void => {
    const target = e.target;
    setStrokeWidth(target.value);
  };

  const handleStrokeWidthSubmit = (e: any): void => {
    try {
      const nextStrokeWidth = evaluate(`${strokeWidth}`);
      if (nextStrokeWidth !== stroke.width && !isNaN(nextStrokeWidth)) {
        const paperLayer = getPaperLayer(selected[0]);
        paperLayer.strokeWidth = nextStrokeWidth;
        setLayerStrokeWidth({id: selected[0], strokeWidth: nextStrokeWidth});
        setStrokeWidth(nextStrokeWidth);
      } else {
        setStrokeWidth(stroke.width);
      }
    } catch(error) {
      setStrokeWidth(stroke.width);
    }
  };

  return (
    <SidebarInput
      value={strokeWidth}
      onChange={handleStrokeWidthChange}
      onSubmit={handleStrokeWidthSubmit}
      blurOnSubmit
      disabled={disabled}
      bottomLabel={'Width'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const stroke = layer.present.byId[layer.present.selected[0]].style.stroke;
  const disabled = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return true;
      case 1:
        return !layer.present.byId[layer.present.selected[0]].style.stroke.enabled;
      default:
        return true;
    }
  })();
  return { selected, stroke, disabled };
};

export default connect(
  mapStateToProps,
  { setLayerStrokeWidth }
)(StrokeWidthInput);