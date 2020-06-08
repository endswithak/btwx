import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerStrokeDashArrayPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerStrokeDashArray } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface StrokeGapInputProps {
  selected?: string[];
  dashArrayValue?: number[];
  disabled?: boolean;
  setLayerStrokeDashArray?(payload: SetLayerStrokeDashArrayPayload): LayerTypes;
}

const StrokeGapInput = (props: StrokeGapInputProps): ReactElement => {
  const { selected, setLayerStrokeDashArray, disabled, dashArrayValue } = props;
  const [gap, setGap] = useState<string | number>(dashArrayValue[1]);

  useEffect(() => {
    setGap(dashArrayValue[1]);
  }, [dashArrayValue, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setGap(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      const nextGap = evaluate(`${gap}`);
      if (nextGap !== dashArrayValue[1]) {
        const paperLayer = getPaperLayer(selected[0]);
        paperLayer.dashArray = [dashArrayValue[0], nextGap];
        setLayerStrokeDashArray({id: selected[0], strokeDashArray: [dashArrayValue[0], nextGap]});
        setGap(nextGap);
      }
    } catch(error) {
      setGap(dashArrayValue[1]);
    }
  }

  return (
    <SidebarInput
      value={gap}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      disabled={disabled}
      bottomLabel={'Gap'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
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
  const dashArrayValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return layer.present.byId[layer.present.selected[0]].style.strokeOptions.dashArray;
      default:
        return '';
    }
  })();
  return { selected, dashArrayValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayerStrokeDashArray }
)(StrokeGapInput);