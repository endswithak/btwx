import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedStrokeEnabled, getSelectedStrokeJoin } from '../store/selectors/layer';
import { setLayersStrokeJoin } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

const StrokeJoinInput = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const strokeJoinValue = useSelector((state: RootState) => getSelectedStrokeJoin(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state) || (state.layer.present.selected.every((id) => state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Line')));
  const [strokeJoin, setStrokeJoin] = useState<Btwx.StrokeJoin | 'multi'>(strokeJoinValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setStrokeJoin(strokeJoinValue);
  }, [strokeJoinValue, disabled, selected]);

  const handleClick = (strokeJoinType: Btwx.StrokeJoin): void => {
    dispatch(setLayersStrokeJoin({layers: selected, strokeJoin: strokeJoinType}));
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

export default StrokeJoinInput;