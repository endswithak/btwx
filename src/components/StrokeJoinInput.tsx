import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarToggleButton from './SidebarToggleButton';
import { RootState } from '../store/reducers';
import { SetLayerStrokeJoinPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerStrokeJoin } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';

interface StrokeJoinInputProps {
  selected?: string[];
  strokeJoinValue?: em.StrokeJoin;
  disabled?: boolean;
  setLayerStrokeJoin?(payload: SetLayerStrokeJoinPayload): LayerTypes;
}

const StrokeJoinInput = (props: StrokeJoinInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { selected, strokeJoinValue, setLayerStrokeJoin, disabled } = props;
  const [strokeJoin, setStrokeJoin] = useState<em.StrokeJoin>(strokeJoinValue);

  useEffect(() => {
    setStrokeJoin(strokeJoinValue);
  }, [strokeJoinValue, disabled, selected]);

  const handleClick = (strokeJoinType: em.StrokeJoin) => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.strokeJoin = strokeJoinType;
    setLayerStrokeJoin({id: selected[0], strokeJoin: strokeJoinType})
    setStrokeJoin(strokeJoinType);
  };

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn>
        <SidebarToggleButton
          onClick={() => handleClick('miter')}
          active={'miter' === strokeJoin}
          disabled={disabled}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <path d="M21,14 L21,21 L14,21 L14,16 L16,16 L16,14 L21,14 Z M21,3 L21,10 L16,10 L16,8 L8,8 L8,16 L10,16 L10,21 L3,21 L3,3 L21,3 Z M15,9 L15,11 L21,11 L21,13 L15,13 L15,15 L13,15 L13,21 L11,21 L11,15 L9,15 L9,9 L15,9 Z M13,11 L11,11 L11,13 L13,13 L13,11 Z" />
          </svg>
        </SidebarToggleButton>
      </SidebarSectionColumn>
      <SidebarSectionColumn>
        <SidebarToggleButton
          onClick={() => handleClick('round')}
          active={'round' === strokeJoin}
          disabled={disabled}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <path d="M21,14 L21,21 L14,21 L14,16 L16,16 L16,14 L21,14 Z M21,3 L21,10 L16,10 L16,8 L8,8 L8,16 L10,16 L10,21 L3,21 L3,8 C3,5.23857625 5.23857625,3 8,3 L21,3 Z M15,9 L15,11 L21,11 L21,13 L15,13 L15,15 L13,15 L13,21 L11,21 L11,15 L9,15 L9,9 L15,9 Z M13,11 L11,11 L11,13 L13,13 L13,11 Z" />
          </svg>
        </SidebarToggleButton>
      </SidebarSectionColumn>
      <SidebarSectionColumn>
        <SidebarToggleButton
          onClick={() => handleClick('bevel')}
          active={'bevel' === strokeJoin}
          disabled={disabled}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <path d="M21,14 L21,21 L14,21 L14,16 L16,16 L16,14 L21,14 Z M21,3 L21,10 L16,10 L16,8 L8,8 L8,16 L10,16 L10,21 L3,21 L3,8.00529368 L8,3 L21,3 Z M15,9 L15,11 L21,11 L21,13 L15,13 L15,15 L13,15 L13,21 L11,21 L11,15 L9,15 L9,9 L15,9 Z M13,11 L11,11 L11,13 L13,13 L13,11 Z" />
          </svg>
        </SidebarToggleButton>
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const disabled = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return true;
      case 1:
        return !layer.present.byId[layer.present.selected[0]].style.stroke.enabled;
      default:
        return true;
    }
  })();
  const strokeJoinValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return null;
      case 1:
        return layer.present.byId[layer.present.selected[0]].style.strokeOptions.join;
      default:
        return null;
    }
  })();
  return { selected, strokeJoinValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayerStrokeJoin }
)(StrokeJoinInput);