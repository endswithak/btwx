import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { EnableLayerVerticalFlipPayload, DisableLayerVerticalFlipPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayerVerticalFlip, disableLayerVerticalFlip } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

interface VerticalFlipInputProps {
  selected?: string[];
  verticalFlipValue?: boolean;
  disabled?: boolean;
  enableLayerVerticalFlip?(payload: EnableLayerVerticalFlipPayload): LayerTypes;
  disableLayerVerticalFlip?(payload: DisableLayerVerticalFlipPayload): LayerTypes;
}

const VerticalFlipInput = (props: VerticalFlipInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { selected, verticalFlipValue, enableLayerVerticalFlip, disableLayerVerticalFlip, disabled } = props;
  const [verticalFlip, setVerticalFlip] = useState<boolean>(verticalFlipValue);

  useEffect(() => {
    setVerticalFlip(verticalFlipValue);
  }, [verticalFlipValue]);

  const handleClick = (e: any) => {
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
      active={verticalFlip}
      onClick={handleClick}
      disabled={disabled}>
      <svg
        width='24'
        height='24'
        viewBox='0 0 24 24'>
        <path d={Icon('vertical-flip').fill} />
      </svg>
    </SidebarToggleButton>
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
        return layer.present.byId[layer.present.selected[0]].transform.verticalFlip;
      default:
        return false;
    }
  })();
  const disabled = selected.some((id) => layer.present.byId[id].type === 'Artboard') || selected.length > 1;
  return { selected, verticalFlipValue, disabled };
};

export default connect(
  mapStateToProps,
  { enableLayerVerticalFlip, disableLayerVerticalFlip }
)(VerticalFlipInput);