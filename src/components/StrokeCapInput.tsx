import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { selectedStrokeEnabled, getSelectedStrokeCap } from '../store/selectors/layer';
import { setLayersStrokeCap } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

const StrokeCapInput = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const strokeCapValue = useSelector((state: RootState) => getSelectedStrokeCap(state));
  const disabled = useSelector((state: RootState) => !selectedStrokeEnabled(state) || (state.layer.present.selected.every((id) => state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType !== 'Line')));
  const [strokeCap, setStrokeCap] = useState<Btwx.StrokeCap | 'multi'>(strokeCapValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setStrokeCap(strokeCapValue);
  }, [strokeCapValue, disabled, selected]);

  const handleClick = (strokeCapType: Btwx.StrokeCap) => {
    dispatch(setLayersStrokeCap({layers: selected, strokeCap: strokeCapType}));
    setStrokeCap(strokeCapType);
  };

  return (
    <>
      <SidebarSectionRow>
        <SidebarSectionColumn>
          <SidebarToggleButton
            onClick={() => handleClick('butt')}
            active={'butt' === strokeCap && !disabled}
            disabled={disabled}>
            <Icon name='stroke-cap-butt' small />
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn>
          <SidebarToggleButton
            onClick={() => handleClick('round')}
            active={'round' === strokeCap && !disabled}
            disabled={disabled}>
            <Icon name='stroke-cap-round' small />
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn>
          <SidebarToggleButton
            onClick={() => handleClick('square')}
            active={'square' === strokeCap && !disabled}
            disabled={disabled}>
            <Icon name='stroke-cap-square' small />
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
          Cap
        </div>
      </SidebarSectionRow>
    </>
  );
}

export default StrokeCapInput;