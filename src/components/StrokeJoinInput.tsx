import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SetLayersStrokeJoinPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersStrokeJoin } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

interface StrokeJoinInputProps {
  selected?: string[];
  strokeJoinValue?: Btwx.StrokeJoin | 'multi';
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

  const handleClick = (strokeJoinType: Btwx.StrokeJoin) => {
    setLayersStrokeJoin({layers: selected, strokeJoin: strokeJoinType})
    setStrokeJoin(strokeJoinType);
  };

  return (
    <>
      <SidebarSectionRow>
        <SidebarSectionColumn>
          <SidebarToggleButton
            onClick={() => handleClick('miter')}
            active={'miter' === strokeJoin && !disabled}
            disabled={disabled}>
            <Icon name='stroke-join-miter' small />
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn>
          <SidebarToggleButton
            onClick={() => handleClick('round')}
            active={'round' === strokeJoin && !disabled}
            disabled={disabled}>
            <Icon name='stroke-join-round' small />
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn>
          <SidebarToggleButton
            onClick={() => handleClick('bevel')}
            active={'bevel' === strokeJoin && !disabled}
            disabled={disabled}>
            <Icon name='stroke-join-bevel' small />
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
  const layerItems: (Btwx.Shape | Btwx.Image | Btwx.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const strokeJoinValues = layerItems.reduce((result: Btwx.StrokeJoin[], current: Btwx.Shape | Btwx.Image | Btwx.Text) => {
    return [...result, current.style.strokeOptions.join];
  }, []);
  const strokeJoinValue = strokeJoinValues.every((join: Btwx.StrokeJoin) => join === strokeJoinValues[0]) ? strokeJoinValues[0] : 'multi';
  const disabled = !layerItems.every((layerItem) => layerItem.style.stroke.enabled) || !layerItems.every((layerItem) => layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType !== 'Line');
  return { selected, strokeJoinValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersStrokeJoin }
)(StrokeJoinInput);