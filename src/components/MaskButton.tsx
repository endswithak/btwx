import React, { ReactElement } from 'react';
import { RootState } from '../store/reducers';
import { connect } from 'react-redux';
import { AddLayersMaskPayload, LayerTypes } from '../store/actionTypes/layer';
import { addLayersMask } from '../store/actions/layer';
import { orderLayersByDepth } from '../store/selectors/layer';
import TopbarButton from './TopbarButton';

interface MaskButtonProps {
  canMask?: boolean;
  selected?: string[];
  addLayersMask?(payload: AddLayersMaskPayload): LayerTypes;
}

const MaskButton = (props: MaskButtonProps): ReactElement => {
  const { canMask, selected, addLayersMask } = props;

  const handleMaskClick = (): void => {
    if (canMask) {
      addLayersMask({layers: selected});
    }
  }

  return (
    <TopbarButton
      label='Mask'
      onClick={handleMaskClick}
      icon='M16.0566792,20.6980024 L16.3546361,21.6525817 C15.847026,21.8109856 15.3228978,21.9186671 14.7880039,21.973513 L14.3849047,22.0047076 L14.2171817,22.0117647 L14.1856696,21.0122613 L14.3325688,21.0060781 C14.8118374,20.9809607 15.2773132,20.9082021 15.7246478,20.7926318 L16.0566792,20.6980024 Z M10.3532316,20.0120132 C10.8264008,20.2976977 11.3353999,20.5286987 11.8710558,20.6967565 L12.1955747,20.7899719 L11.943458,21.7576689 C11.3244785,21.5960954 10.7289235,21.3607684 10.1685017,21.0579417 L9.83655827,20.8681959 L10.3532316,20.0120132 Z M19.4250036,18.3977506 L20.2048142,19.0237662 C19.80557,19.5207976 19.3485694,19.9686742 18.8440721,20.357346 L18.5357562,20.5833641 L17.9641611,19.7628282 C18.4230149,19.4429846 18.8410556,19.0699031 19.2097655,18.6530438 L19.4250036,18.3977506 Z M7.6653983,17.0693693 C7.91084113,17.5752374 8.21510088,18.0461686 8.56885344,18.4737675 L8.78696952,18.7250598 L8.04721755,19.3979396 C7.61793,18.9263246 7.2462845,18.4052716 6.94076601,17.8456772 L6.76545803,17.5053828 L7.6653983,17.0693693 Z M20.9313679,14.7231376 L21.9264404,14.8222895 C21.8624145,15.461036 21.722005,16.0857225 21.5096386,16.685155 L21.3736192,17.0416944 L20.4482102,16.6627245 C20.6561457,16.1545199 20.8058021,15.6173329 20.8892833,15.0599329 L20.9313679,14.7231376 Z M2,16 L2,2 L16,2 L16,16 L2,16 Z M15,3 L3,3 L3,15 L6.01450559,15.0007546 C6.00487984,14.8350654 6,14.6681026 6,14.5 C6,9.80557963 9.80557963,6 14.5,6 C14.6681026,6 14.8350654,6.00487984 15.0007546,6.01450559 L15,3 Z M21.1207246,10.43219 C21.4057947,11.0006944 21.6221993,11.6022295 21.7647046,12.2262375 L21.841298,12.6032547 L20.8567349,12.7782849 C20.7568253,12.217881 20.5907997,11.6818722 20.3673577,11.1780918 L20.2264721,10.8797536 L21.1207246,10.43219 Z M17.9916771,7.10130899 C18.5424241,7.42254861 19.0528929,7.80842959 19.5119541,8.24980783 L19.7811328,8.5212213 L19.0549764,9.20875111 C18.6719511,8.80365961 18.2414791,8.44480163 17.7730536,8.14072484 L17.4875197,7.96492089 L17.9916771,7.10130899 Z'
      disabled={!canMask} />
  );
}

const mapStateToProps = (state: RootState): {
  canMask?: boolean;
  selected?: string[];
} => {
  const { layer } = state;
  const selected = layer.present.selected;
  const selectedById: {[id: string]: em.Page | em.Artboard | em.Group | em.Shape | em.Text} = selected.reduce((result, current) => {
    result = {
      ...result,
      [current]: layer.present.byId[current]
    }
    return result;
  }, {});
  const selectedByDepth = orderLayersByDepth(state.layer.present, selected);
  const canMask = selected.length > 0 && selectedById[selectedByDepth[0]].type === 'Shape';
  return { selected, canMask };
};

export default connect(
  mapStateToProps,
  { addLayersMask }
)(MaskButton);