import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarToggleButton from './SidebarToggleButton';
import { RootState } from '../store/reducers';
import { EnableLayerVerticalFlipPayload, DisableLayerVerticalFlipPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerVerticalFlip, disableLayerVerticalFlip } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface VerticalFlipInputProps {
  selected?: string[];
  verticalFlipValue?: boolean;
  enableLayerVerticalFlip?(payload: EnableLayerVerticalFlipPayload): LayerTypes;
  disableLayerVerticalFlip?(payload: DisableLayerVerticalFlipPayload): LayerTypes;
}

const VerticalFlipInput = (props: VerticalFlipInputProps): ReactElement => {
  const { selected, verticalFlipValue, enableLayerVerticalFlip, disableLayerVerticalFlip } = props;
  const [verticalFlip, setVerticalFlip] = useState<boolean>(verticalFlipValue);

  useEffect(() => {
    setVerticalFlip(verticalFlipValue);
  }, [verticalFlipValue]);

  const handleClick = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.scale(1, -1);
    if (verticalFlip) {
      disableLayerVerticalFlip({id: selected[0]});
    } else {
      enableLayerVerticalFlip({id: selected[0]});
    }
    setVerticalFlip(!verticalFlip);
  };

  return (
    <SidebarToggleButton
      text={'—'}
      active={verticalFlip}
      onClick={handleClick}
      disabled={selected.length > 1 || selected.length === 0} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const verticalFlipValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return false;
      case 1:
        return layer.present.byId[layer.present.selected[0]].style.verticalFlip;
      default:
        return false;
    }
  })();
  return { selected, verticalFlipValue };
};

export default connect(
  mapStateToProps,
  { enableLayerVerticalFlip, disableLayerVerticalFlip }
)(VerticalFlipInput);