import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { EnableLayersHorizontalFlipPayload, DisableLayersHorizontalFlipPayload, LayerTypes } from '../store/actionTypes/layer';
import { enableLayersHorizontalFlip, disableLayersHorizontalFlip } from '../store/actions/layer';
import { canTransformFlipSelection } from '../store/selectors/layer';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

interface HorizontalFlipInputProps {
  selected?: string[];
  horizontalFlipValue?: boolean;
  disabled?: boolean;
  enableLayersHorizontalFlip?(payload: EnableLayersHorizontalFlipPayload): LayerTypes;
  disableLayersHorizontalFlip?(payload: DisableLayersHorizontalFlipPayload): LayerTypes;
}

const HorizontalFlipInput = (props: HorizontalFlipInputProps): ReactElement => {
  const { selected, horizontalFlipValue, enableLayersHorizontalFlip, disableLayersHorizontalFlip, disabled } = props;
  const [horizontalFlip, setHorizontalFlip] = useState<boolean>(horizontalFlipValue);

  useEffect(() => {
    setHorizontalFlip(horizontalFlipValue);
  }, [horizontalFlipValue]);

  const handleClick = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (horizontalFlip) {
      disableLayersHorizontalFlip({layers: selected});
    } else {
      enableLayersHorizontalFlip({layers: selected});
    }
    setHorizontalFlip(!horizontalFlip);
  };

  return (
    <SidebarToggleButton
      active={horizontalFlip}
      onClick={handleClick}
      disabled={disabled}>
      <Icon name='horizontal-flip' small />
    </SidebarToggleButton>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const horizontalFlipValue = layer.present.selected.every((id) => layer.present.byId[id].transform.horizontalFlip);
  const disabled = !canTransformFlipSelection(layer.present);
  return { selected, horizontalFlipValue, disabled };
};

export default connect(
  mapStateToProps,
  { enableLayersHorizontalFlip, disableLayersHorizontalFlip }
)(HorizontalFlipInput);