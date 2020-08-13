import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersWidthPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersWidth } from '../store/actions/layer';

interface WidthInputProps {
  selected?: string[];
  widthValue?: number | 'multi';
  setLayersWidth?(payload: SetLayersWidthPayload): LayerTypes;
}

const WidthInput = (props: WidthInputProps): ReactElement => {
  const { selected, setLayersWidth, widthValue } = props;
  const [width, setWidth] = useState(widthValue !== 'multi' ? Math.round(widthValue) : widthValue);

  useEffect(() => {
    setWidth(widthValue !== 'multi' ? Math.round(widthValue) : widthValue);
  }, [widthValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setWidth(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      let nextWidth = evaluate(`${width}`);
      if (nextWidth !== widthValue && !isNaN(nextWidth)) {
        if (nextWidth < 1) {
          nextWidth = 1;
        }
        setLayersWidth({layers: selected, width: nextWidth});
        setWidth(nextWidth);
      } else {
        setWidth(widthValue !== 'multi' ? Math.round(widthValue) : widthValue);
      }
    } catch(error) {
      setWidth(widthValue !== 'multi' ? Math.round(widthValue) : widthValue);
    }
  }

  return (
    <SidebarInput
      value={width}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label={'W'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: em.Layer[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const widthValues: number[] = layerItems.reduce((result, current) => {
    return [...result, current.frame.innerWidth];
  }, []);
  const widthValue = (() => {
    if (widthValues.every((value: number) => value === widthValues[0])) {
      return widthValues[0];
    } else {
      return 'multi';
    }
  })();
  return { selected, widthValue };
};

export default connect(
  mapStateToProps,
  { setLayersWidth }
)(WidthInput);