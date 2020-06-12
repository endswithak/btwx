import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerWidthPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerWidth } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface WidthInputProps {
  selected?: string[];
  widthValue?: number | string;
  setLayerWidth?(payload: SetLayerWidthPayload): LayerTypes;
}

const WidthInput = (props: WidthInputProps): ReactElement => {
  const { selected, setLayerWidth, widthValue } = props;
  const [width, setWidth] = useState<string | number>(widthValue);

  useEffect(() => {
    setWidth(widthValue);
  }, [widthValue, selected]);

  const handleChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    setWidth(target.value);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLInputElement>) => {
    try {
      let nextWidth = evaluate(`${width}`);
      if (nextWidth !== widthValue && !isNaN(nextWidth)) {
        if (nextWidth < 1) {
          nextWidth = 1;
        }
        const paperLayer = getPaperLayer(selected[0]);
        paperLayer.bounds.width = nextWidth;
        setLayerWidth({id: selected[0], width: nextWidth});
        setWidth(nextWidth);
      } else {
        setWidth(widthValue);
      }
    } catch(error) {
      setWidth(widthValue);
    }
  }

  return (
    <SidebarInput
      value={width}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label={'W'}
      disabled={selected.length > 1 || selected.length === 0} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const widthValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1:
        return Math.round(layer.present.byId[layer.present.selected[0]].frame.width);
      default:
        return 'multi';
    }
  })();
  return { selected, widthValue };
};

export default connect(
  mapStateToProps,
  { setLayerWidth }
)(WidthInput);