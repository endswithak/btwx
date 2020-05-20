import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarFlippedButton from './SidebarFlippedButton';
import { RootState } from '../store/reducers';
import { SetLayerVerticalFlipPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerVerticalFlip } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface XFlipInputProps {
  selected?: string[];
  verticalFlipValue?: boolean;
  setLayerVerticalFlip?(payload: SetLayerVerticalFlipPayload): LayerTypes;
}

const XFlipInput = (props: XFlipInputProps): ReactElement => {
  const { selected, setLayerVerticalFlip, verticalFlipValue } = props;
  const [verticalFlip, setVerticalFlip] = useState<boolean>(verticalFlipValue);

  useEffect(() => {
    setVerticalFlip(verticalFlipValue);
  }, [verticalFlipValue]);

  const handleClick = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setVerticalFlip(!verticalFlip);
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.scale(1, -1);
    setLayerVerticalFlip({id: selected[0], verticalFlip: !verticalFlip ? -1 : 1});
  };

  return (
    <SidebarFlippedButton
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
        return layer.present.byId[layer.present.selected[0]].style.verticalFlip === -1;
      default:
        return false;
    }
  })();
  return { selected, verticalFlipValue };
};

export default connect(
  mapStateToProps,
  { setLayerVerticalFlip }
)(XFlipInput);