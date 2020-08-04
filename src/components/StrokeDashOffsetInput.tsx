import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerStrokeDashOffsetPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerStrokeDashOffset } from '../store/actions/layer';

interface StrokeDashOffsetInputProps {
  dashOffsetValue?: number;
  selected?: string[];
  disabled?: boolean;
  setLayerStrokeDashOffset?(payload: SetLayerStrokeDashOffsetPayload): LayerTypes;
}

const StrokeDashOffsetInput = (props: StrokeDashOffsetInputProps): ReactElement => {
  const { selected, disabled, dashOffsetValue, setLayerStrokeDashOffset } = props;
  const [dashOffset, setDashOffset] = useState<number | string>(dashOffsetValue);

  useEffect(() => {
    setDashOffset(dashOffsetValue);
  }, [dashOffsetValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setDashOffset(target.value);
  };

  const handleSubmit = (e: any): void => {
    try {
      const nextDashOffset = evaluate(`${dashOffset}`);
      if (nextDashOffset !== dashOffsetValue && !isNaN(nextDashOffset)) {
        setLayerStrokeDashOffset({id: selected[0], strokeDashOffset: nextDashOffset});
        setDashOffset(nextDashOffset);
      } else {
        setDashOffset(dashOffsetValue);
      }
    } catch(error) {
      setDashOffset(dashOffsetValue);
    }
  };

  return (
    <SidebarInput
      value={dashOffset}
      onChange={handleChange}
      onSubmit={handleSubmit}
      blurOnSubmit
      disabled={disabled}
      bottomLabel={'Dash Offset'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const dashOffsetValue = layer.present.byId[layer.present.selected[0]].style.strokeOptions.dashOffset;
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
  return { selected, dashOffsetValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayerStrokeDashOffset }
)(StrokeDashOffsetInput);