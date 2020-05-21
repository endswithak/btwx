import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarToggleButton from './SidebarToggleButton';
import { RootState } from '../store/reducers';
import { SetLayerHorizontalFlipPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerHorizontalFlip } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface YFlipInputProps {
  selected?: string[];
  horizontalFlipValue?: boolean;
  setLayerHorizontalFlip?(payload: SetLayerHorizontalFlipPayload): LayerTypes;
}

const YFlipInput = (props: YFlipInputProps): ReactElement => {
  const { selected, setLayerHorizontalFlip, horizontalFlipValue } = props;
  const [horizontalFlip, setHorizontalFlip] = useState<boolean>(horizontalFlipValue);

  useEffect(() => {
    setHorizontalFlip(horizontalFlipValue);
  }, [horizontalFlipValue]);

  const handleClick = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setHorizontalFlip(!horizontalFlip);
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.scale(paperLayer.scaling.x, -1);
    setLayerHorizontalFlip({id: selected[0], horizontalFlip: !horizontalFlip ? -1 : 1});
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
        return layer.present.byId[layer.present.selected[0]].style.horizontalFlip === -1;
      default:
        return false;
    }
  })();
  return { selected, horizontalFlipValue };
};

export default connect(
  mapStateToProps,
  { setLayerHorizontalFlip }
)(YFlipInput);