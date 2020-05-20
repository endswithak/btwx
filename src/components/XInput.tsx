import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerXPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerX } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface XInputProps {
  selected?: string[];
  xValue?: number | string;
  setLayerX?(payload: SetLayerXPayload): LayerTypes;
}

const XInput = (props: XInputProps): ReactElement => {
  const { selected, setLayerX, xValue } = props;
  const [x, setX] = useState<string | number>(props.xValue);

  useEffect(() => {
    setX(xValue);
  }, [xValue, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setX(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.position.x = evaluate(`${x}`);
    setLayerX({id: selected[0], x: evaluate(`${x}`)});
    setX(evaluate(`${x}`));
  }

  return (
    <SidebarInput
      value={x}
      onChange={handleChange}
      onSubmit={handleSubmit}
      blurOnSubmit
      label={'X'}
      disabled={selected.length > 1 || selected.length === 0} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const xValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return Math.round(layer.present.byId[layer.present.selected[0]].frame.x);
      default:
        return 'multi';
    }
  })();
  return { selected, xValue };
};

export default connect(
  mapStateToProps,
  { setLayerX }
)(XInput);