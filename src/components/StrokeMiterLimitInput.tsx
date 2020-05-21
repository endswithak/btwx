import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerStrokeMiterLimitPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerStrokeMiterLimit } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface StrokeMiterLimitProps {
  selected?: string[];
  miterLimitValue?: number;
  disabled?: boolean;
  setLayerStrokeMiterLimit?(payload: SetLayerStrokeMiterLimitPayload): LayerTypes;
}

const StrokeMiterLimit = (props: StrokeMiterLimitProps): ReactElement => {
  const { selected, setLayerStrokeMiterLimit, miterLimitValue, disabled } = props;
  const [miterLimit, setMiterLimit] = useState<string | number>(miterLimitValue);

  useEffect(() => {
    setMiterLimit(miterLimitValue);
  }, [miterLimitValue, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setMiterLimit(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.miterLimit = evaluate(`${miterLimit}`);
    setLayerStrokeMiterLimit({id: selected[0], miterLimit: evaluate(`${miterLimit}`)});
    setMiterLimit(evaluate(`${miterLimit}`));
  }

  return (
    <SidebarInput
      value={miterLimit}
      onChange={handleChange}
      onSubmit={handleSubmit}
      blurOnSubmit
      disabled={disabled} />
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
        return !layer.present.byId[layer.present.selected[0]].points.closed && layer.present.byId[layer.present.selected[0]].style.strokeOptions.join !== 'miter';
      default:
        return true;
    }
  })();
  const miterLimitValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return layer.present.byId[layer.present.selected[0]].style.strokeOptions.miterLimit;
      default:
        return '';
    }
  })();
  return { selected, miterLimitValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayerStrokeMiterLimit }
)(StrokeMiterLimit);