import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarToggleButton from './SidebarToggleButton';
import { RootState } from '../store/reducers';
import { SetLayersStrokeJoinPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersStrokeJoin } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';

interface StrokeJoinInputProps {
  selected?: string[];
  strokeJoinValue?: em.StrokeJoin | 'multi';
  disabled?: boolean;
  setLayersStrokeJoin?(payload: SetLayersStrokeJoinPayload): LayerTypes;
}

const StrokeJoinInput = (props: StrokeJoinInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { selected, strokeJoinValue, setLayersStrokeJoin, disabled } = props;
  const [strokeJoin, setStrokeJoin] = useState<em.StrokeJoin | 'multi'>(strokeJoinValue);

  useEffect(() => {
    setStrokeJoin(strokeJoinValue);
  }, [strokeJoinValue, disabled, selected]);

  const handleClick = (strokeJoinType: em.StrokeJoin) => {
    setLayersStrokeJoin({layers: selected, strokeJoin: strokeJoinType})
    setStrokeJoin(strokeJoinType);
  };

  return (
    <>
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
      <SidebarSectionRow>
        <div
          className='c-sidebar-input__bottom-label'
          style={{
            marginTop: 0,
            paddingRight: theme.unit,
            color: theme.text.base
          }}>
          Join
        </div>
      </SidebarSectionRow>
    </>
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: (em.Shape | em.Image | em.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const strokeJoinValues = layerItems.reduce((result: em.StrokeJoin[], current: em.Shape | em.Image | em.Text) => {
    return [...result, current.style.strokeOptions.join];
  }, []);
  const strokeJoinValue = strokeJoinValues.every((join: em.StrokeJoin) => join === strokeJoinValues[0]) ? strokeJoinValues[0] : 'multi';
  const disabled = !layerItems.every((layerItem) => layerItem.style.stroke.enabled) || !layerItems.every((layerItem) => layerItem.type === 'Shape' && (layerItem as em.Shape).path.closed);
  return { selected, strokeJoinValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersStrokeJoin }
)(StrokeJoinInput);