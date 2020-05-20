import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerHeightPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerHeight } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface HeightInputProps {
  selected?: string[];
  heightValue?: number | string;
  setLayerHeight?(payload: SetLayerHeightPayload): LayerTypes;
}

const HeightInput = (props: HeightInputProps): ReactElement => {
  const { selected, setLayerHeight, heightValue } = props;
  const [height, setHeight] = useState<string | number>(props.heightValue);

  useEffect(() => {
    setHeight(heightValue);
  }, [heightValue, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setHeight(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.bounds.height = evaluate(`${height}`);
    setLayerHeight({id: selected[0], height: evaluate(`${height}`)});
    setHeight(evaluate(`${height}`));
  }

  return (
    <SidebarInput
      value={height}
      onChange={handleChange}
      onSubmit={handleSubmit}
      blurOnSubmit
      label={'H'}
      disabled={selected.length > 1 || selected.length === 0} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const heightValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return Math.round(layer.present.byId[layer.present.selected[0]].frame.height);
      default:
        return 'multi';
    }
  })();
  return { selected, heightValue };
};

export default connect(
  mapStateToProps,
  { setLayerHeight }
)(HeightInput);