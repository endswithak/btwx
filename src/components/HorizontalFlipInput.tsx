import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarToggleButton from './SidebarToggleButton';
import { RootState } from '../store/reducers';
import { EnableLayerHorizontalFlipPayload, DisableLayerHorizontalFlipPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerHorizontalFlip, disableLayerHorizontalFlip } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface HorizontalFlipInputProps {
  selected?: string[];
  horizontalFlipValue?: boolean;
  enableLayerHorizontalFlip?(payload: EnableLayerHorizontalFlipPayload): LayerTypes;
  disableLayerHorizontalFlip?(payload: DisableLayerHorizontalFlipPayload): LayerTypes;
}

const HorizontalFlipInput = (props: HorizontalFlipInputProps): ReactElement => {
  const { selected, horizontalFlipValue, enableLayerHorizontalFlip, disableLayerHorizontalFlip } = props;
  const [horizontalFlip, setHorizontalFlip] = useState<boolean>(horizontalFlipValue);

  useEffect(() => {
    setHorizontalFlip(horizontalFlipValue);
  }, [horizontalFlipValue]);

  const handleClick = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.scale(-1, 1);
    if (horizontalFlip) {
      disableLayerHorizontalFlip({id: selected[0]});
    } else {
      enableLayerHorizontalFlip({id: selected[0]});
    }
    setHorizontalFlip(!horizontalFlip);
  };

  return (
    <SidebarToggleButton
      text={'|'}
      active={horizontalFlip}
      onClick={handleClick}
      disabled={selected.length > 1 || selected.length === 0} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const horizontalFlipValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return false;
      case 1:
        return layer.present.byId[layer.present.selected[0]].style.horizontalFlip;
      default:
        return false;
    }
  })();
  return { selected, horizontalFlipValue };
};

export default connect(
  mapStateToProps,
  { enableLayerHorizontalFlip, disableLayerHorizontalFlip }
)(HorizontalFlipInput);