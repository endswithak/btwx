import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersHeightPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersHeight } from '../store/actions/layer';

interface HeightInputProps {
  selected?: string[];
  disabled?: boolean;
  heightValue?: number | 'multi';
  setLayersHeight?(payload: SetLayersHeightPayload): LayerTypes;
}

const HeightInput = (props: HeightInputProps): ReactElement => {
  const { selected, setLayersHeight, disabled, heightValue } = props;
  const [height, setHeight] = useState(heightValue !== 'multi' ? Math.round(heightValue) : heightValue);

  useEffect(() => {
    setHeight(heightValue !== 'multi' ? Math.round(heightValue) : heightValue);
  }, [heightValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setHeight(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      let nextHeight = evaluate(`${height}`);
      if (height !== heightValue && !isNaN(nextHeight)) {
        if (nextHeight < 1) {
          nextHeight = 1;
        }
        setLayersHeight({layers: selected, height: nextHeight});
        setHeight(nextHeight);
      } else {
        setHeight(heightValue !== 'multi' ? Math.round(heightValue) : heightValue);
      }
    } catch(error) {
      setHeight(heightValue !== 'multi' ? Math.round(heightValue) : heightValue);
    }
  }

  return (
    <SidebarInput
      value={height}
      onChange={handleChange}
      onSubmit={handleSubmit}
      disabled={disabled}
      submitOnBlur
      label={'H'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: em.Layer[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const heightValues: number[] = layerItems.reduce((result, current) => {
    return [...result, current.frame.innerHeight];
  }, []);
  const heightValue = (() => {
    if (heightValues.every((value: number) => value === heightValues[0])) {
      return heightValues[0];
    } else {
      return 'multi';
    }
  })();
  const disabled = layerItems.some((layerItem) => layerItem.type === 'Shape' && (layerItem as em.Shape).shapeType === 'Line');
  return { selected, heightValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersHeight }
)(HeightInput);