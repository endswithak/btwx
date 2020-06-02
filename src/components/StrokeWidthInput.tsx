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
  stroke?: {
    enabled: boolean;
    color: string;
    width: number;
  };
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

  const handleStrokeWidthChange = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    setStrokeWidth(target.value);
  };

  const handleStrokeWidthSubmit = (e: React.SyntheticEvent<HTMLInputElement>): void => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.strokeWidth = evaluate(`${strokeWidth}`);
    setLayerStrokeWidth({id: selected[0], strokeWidth: evaluate(`${strokeWidth}`)});
    setStrokeWidth(evaluate(`${strokeWidth}`));
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