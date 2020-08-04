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
  layerItem?: em.Layer;
  widthValue?: number | string;
  setLayerWidth?(payload: SetLayerWidthPayload): LayerTypes;
}

const WidthInput = (props: WidthInputProps): ReactElement => {
  const { selected, setLayerWidth, widthValue, layerItem } = props;
  const [width, setWidth] = useState(widthValue);

  useEffect(() => {
    setWidth(widthValue);
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
        const paperLayer = getPaperLayer(selected[0]);
        if (layerItem.transform.rotation !== 0) {
          paperLayer.rotation = -layerItem.transform.rotation;
        }
        paperLayer.bounds.width = nextWidth;
        if (layerItem.transform.rotation !== 0) {
          paperLayer.rotation = layerItem.transform.rotation;
        }
        paperLayer.position.x = layerItem.frame.x;
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
  const widthValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return '';
      case 1: {
        return Math.round(layerItem.master.width * layerItem.transform.scale.x);
      }
      default:
        return 'multi';
    }
  })();
  return { selected, widthValue, layerItem };
};

export default connect(
  mapStateToProps,
  { setLayerWidth }
)(WidthInput);