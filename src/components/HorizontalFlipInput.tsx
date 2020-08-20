import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { EnableLayerHorizontalFlipPayload, DisableLayerHorizontalFlipPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerHorizontalFlip, disableLayerHorizontalFlip } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

interface HorizontalFlipInputProps {
  selected?: string[];
  horizontalFlipValue?: boolean;
  disabled?: boolean;
  enableLayerHorizontalFlip?(payload: EnableLayerHorizontalFlipPayload): LayerTypes;
  disableLayerHorizontalFlip?(payload: DisableLayerHorizontalFlipPayload): LayerTypes;
}

const HorizontalFlipInput = (props: HorizontalFlipInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { selected, horizontalFlipValue, enableLayerHorizontalFlip, disableLayerHorizontalFlip, disabled } = props;
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
      active={horizontalFlip}
      onClick={handleClick}
      disabled={disabled}>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'>
        <path d={Icon('horizontal-flip').fill} />
      </svg>
    </SidebarToggleButton>
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
        return layer.present.byId[layer.present.selected[0]].transform.horizontalFlip;
      default:
        return false;
    }
  })();
  const disabled = selected.some((id) => layer.present.byId[id].type === 'Artboard') || selected.length > 1;
  return { selected, horizontalFlipValue, disabled };
};

export default connect(
  mapStateToProps,
  { enableLayerHorizontalFlip, disableLayerHorizontalFlip }
)(HorizontalFlipInput);