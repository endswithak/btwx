import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersHeightPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersHeight } from '../store/actions/layer';

interface HeightInputProps {
  selected?: string[];
  heightValue?: number | string;
  setLayersHeight?(payload: SetLayersHeightPayload): LayerTypes;
}

const HeightInput = (props: HeightInputProps): ReactElement => {
  const { selected, setLayersHeight, heightValue } = props;
  const [height, setHeight] = useState(props.heightValue);

  useEffect(() => {
    setHeight(heightValue);
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
        setHeight(heightValue);
      }
    } catch(error) {
      setHeight(heightValue);
    }
  }

  return (
    <SidebarInput
      value={height}
      onChange={handleChange}
      onSubmit={handleSubmit}
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
    const height = Math.round(current.master.height * current.transform.scale.y);
    return [...result, height];
  }, []);
  const heightValue = (() => {
    if (heightValues.every((value: number) => value === heightValues[0])) {
      return heightValues[0];
    } else {
      return 'multi';
    }
  })();
  return { selected, heightValue };
};

export default connect(
  mapStateToProps,
  { setLayersHeight }
)(HeightInput);