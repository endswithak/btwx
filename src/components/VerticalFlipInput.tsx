import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { EnableLayersVerticalFlipPayload, DisableLayersVerticalFlipPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayersVerticalFlip, disableLayersVerticalFlip } from '../store/actions/layer';
import { canFlipSeleted } from '../store/selectors/layer';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

interface VerticalFlipInputProps {
  selected?: string[];
  verticalFlipValue?: boolean;
  disabled?: boolean;
  enableLayersVerticalFlip?(payload: EnableLayersVerticalFlipPayload): LayerTypes;
  disableLayersVerticalFlip?(payload: DisableLayersVerticalFlipPayload): LayerTypes;
}

const VerticalFlipInput = (props: VerticalFlipInputProps): ReactElement => {
  const { selected, verticalFlipValue, enableLayersVerticalFlip, disableLayersVerticalFlip, disabled } = props;
  const [verticalFlip, setVerticalFlip] = useState<boolean>(verticalFlipValue);

  useEffect(() => {
    setVerticalFlip(verticalFlipValue);
  }, [verticalFlipValue]);

  const handleClick = (e: any) => {
    if (verticalFlip) {
      disableLayersVerticalFlip({layers: selected});
    } else {
      enableLayersVerticalFlip({layers: selected});
    }
    setVerticalFlip(!verticalFlip);
  };

  return (
    <SidebarToggleButton
      active={verticalFlip}
      onClick={handleClick}
      disabled={disabled}>
      <Icon name='vertical-flip' small />
    </SidebarToggleButton>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const verticalFlipValue = layer.present.selected.every((id) => layer.present.byId[id].transform.verticalFlip);
  const disabled = !canFlipSeleted(state);
  return { selected, verticalFlipValue, disabled };
};

export default connect(
  mapStateToProps,
  { enableLayersVerticalFlip, disableLayersVerticalFlip }
)(VerticalFlipInput);