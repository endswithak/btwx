import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayerHeightPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerHeight } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface HeightInputProps {
  layerItem?: em.Layer;
  selected?: string[];
  heightValue?: number | string;
  setLayerHeight?(payload: SetLayerHeightPayload): LayerTypes;
}

const HeightInput = (props: HeightInputProps): ReactElement => {
  const { selected, setLayerHeight, heightValue, layerItem } = props;
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
        const paperLayer = getPaperLayer(selected[0]);
        if (layerItem.transform.rotation !== 0) {
          paperLayer.rotation = -layerItem.transform.rotation;
        }
        paperLayer.bounds.height = nextHeight;
        if (layerItem.transform.rotation !== 0) {
          paperLayer.rotation = layerItem.transform.rotation;
        }
        paperLayer.position.y = layerItem.frame.y;
        setLayerHeight({id: selected[0], height: nextHeight});
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
      label={'H'}
      disabled={selected.length > 1 || selected.length === 0} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItem = ((): em.Layer => {
    switch(layer.present.selected.length) {
      case 0:
        return null;
      case 1: {
        return layer.present.byId[layer.present.selected[0]];
      }
      default:
        return null;
    }
  })();
  const heightValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1: {
        return Math.round(layerItem.master.height * layerItem.transform.scale.y);
      }
      default:
        return 'multi';
    }
  })();
  return { selected, heightValue, layerItem };
};

export default connect(
  mapStateToProps,
  { setLayerHeight }
)(HeightInput);