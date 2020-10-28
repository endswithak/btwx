import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { SetLayersStrokeCapPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersStrokeCap } from '../store/actions/layer';
import { ThemeContext } from './ThemeProvider';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

interface StrokeCapInputProps {
  selected?: string[];
  strokeCapValue?: Btwx.StrokeCap | 'multi';
  disabled?: boolean;
  setLayersStrokeCap?(payload: SetLayersStrokeCapPayload): LayerTypes;
}

const StrokeCapInput = (props: StrokeCapInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { selected, strokeCapValue, setLayersStrokeCap, disabled } = props;
  const [strokeCap, setStrokeCap] = useState<em.StrokeCap | 'multi'>(strokeCapValue);

  useEffect(() => {
    setStrokeCap(strokeCapValue);
  }, [strokeCapValue, disabled, selected]);

  const handleClick = (strokeCapType: Btwx.StrokeCap) => {
    setLayersStrokeCap({layers: selected, strokeCap: strokeCapType})
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

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: (Btwx.Shape | Btwx.Image | Btwx.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const strokeCapValues = layerItems.reduce((result: Btwx.StrokeCap[], current: Btwx.Shape | Btwx.Image | Btwx.Text) => {
    return [...result, current.style.strokeOptions.cap];
  }, []);
  const strokeCapValue = strokeCapValues.every((cap: Btwx.StrokeCap) => cap === strokeCapValues[0]) ? strokeCapValues[0] : 'multi';
  const disabled = !layerItems.every((layerItem) => layerItem.style.stroke.enabled) || layerItems.every((layerItem) => layerItem.type === 'Shape' && (layerItem as Btwx.Shape).shapeType !== 'Line');
  return { selected, strokeCapValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersStrokeCap }
)(StrokeCapInput);