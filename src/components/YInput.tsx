import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerYPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerY } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface YInputProps {
  selected?: string[];
  yValue?: number | string;
  setLayerY?(payload: SetLayerYPayload): LayerTypes;
}

const YInput = (props: YInputProps): ReactElement => {
  const { selected, setLayerY, yValue } = props;
  const [y, setY] = useState<string | number>(props.yValue);

  useEffect(() => {
    setY(yValue);
  }, [yValue, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setY(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      const nextY = evaluate(`${y}`);
      if (nextY !== yValue) {
        const paperLayer = getPaperLayer(selected[0]);
        paperLayer.position.y = nextY;
        setLayerY({id: selected[0], y: nextY});
        setY(nextY);
      }
    } catch(error) {
      setY(yValue);
    }
  }

  return (
    <SidebarInput
      value={y}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label={'Y'}
      disabled={selected.length > 1 || selected.length === 0} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const yValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return Math.round(layer.present.byId[layer.present.selected[0]].frame.y);
      default:
        return 'multi';
    }
  })();
  return { selected, yValue };
};

export default connect(
  mapStateToProps,
  { setLayerY }
)(YInput);