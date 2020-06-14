import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarToggleButton from './SidebarToggleButton';
import { RootState } from '../store/reducers';
import { EnableLayerHorizontalFlipPayload, DisableLayerHorizontalFlipPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerHorizontalFlip, disableLayerHorizontalFlip } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';

interface HorizontalFlipInputProps {
  selected?: string[];
  horizontalFlipValue?: boolean;
  enableLayerHorizontalFlip?(payload: EnableLayerHorizontalFlipPayload): LayerTypes;
  disableLayerHorizontalFlip?(payload: DisableLayerHorizontalFlipPayload): LayerTypes;
}

const HorizontalFlipInput = (props: HorizontalFlipInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
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
      active={horizontalFlip}
      onClick={handleClick}
      disabled={selected.length > 1 || selected.length === 0}>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'
        style={{
          fill: horizontalFlip
          ? theme.text.onPrimary
          : theme.text.lighter
        }}>
        <path d='M13,4 L19,20 L13,19.0039693 L13,4 Z M11,4 L11,19 L5,20 L11,4 Z' />
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