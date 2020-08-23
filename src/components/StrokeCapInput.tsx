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
  strokeCapValue?: em.StrokeCap | 'multi';
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

  const handleClick = (strokeCapType: em.StrokeCap) => {
    setLayersStrokeCap({layers: selected, strokeCap: strokeCapType})
    setStrokeCap(strokeCapType);
  };

  return (
    <>
      <SidebarSectionRow>
        <SidebarSectionColumn>
          <SidebarToggleButton
            onClick={() => handleClick('butt')}
            active={'butt' === strokeCap}
            disabled={disabled}>
            <Icon name='stroke-cap-butt' />
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn>
          <SidebarToggleButton
            onClick={() => handleClick('round')}
            active={'round' === strokeCap}
            disabled={disabled}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <Icon name='stroke-cap-round' />
            </svg>
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn>
          <SidebarToggleButton
            onClick={() => handleClick('square')}
            active={'square' === strokeCap}
            disabled={disabled}>
            <Icon name='stroke-cap-square' />
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
  const layerItems: (em.Shape | em.Image | em.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const strokeCapValues = layerItems.reduce((result: em.StrokeCap[], current: em.Shape | em.Image | em.Text) => {
    return [...result, current.style.strokeOptions.cap];
  }, []);
  const strokeCapValue = strokeCapValues.every((cap: em.StrokeCap) => cap === strokeCapValues[0]) ? strokeCapValues[0] : 'multi';
  const disabled = !layerItems.every((layerItem) => layerItem.style.stroke.enabled) || layerItems.every((layerItem) => layerItem.type === 'Shape' && (layerItem as em.Shape).path.closed);
  return { selected, strokeCapValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersStrokeCap }
)(StrokeCapInput);