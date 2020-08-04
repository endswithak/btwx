import React, { useContext, ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import SidebarToggleButton from './SidebarToggleButton';
import { RootState } from '../store/reducers';
import { SetLayerStrokeCapPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayerStrokeCap } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';

interface StrokeCapInputProps {
  selected?: string[];
  strokeCapValue?: em.StrokeCap;
  disabled?: boolean;
  setLayerStrokeCap?(payload: SetLayerStrokeCapPayload): LayerTypes;
}

const StrokeCapInput = (props: StrokeCapInputProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { selected, strokeCapValue, setLayerStrokeCap, disabled } = props;
  const [strokeCap, setStrokeCap] = useState<em.StrokeCap>(strokeCapValue);

  useEffect(() => {
    setStrokeCap(strokeCapValue);
  }, [strokeCapValue, disabled, selected]);

  const handleClick = (strokeCapType: em.StrokeCap) => {
    const paperLayer = getPaperLayer(selected[0]);
    paperLayer.strokeCap = strokeCapType;
    setLayerStrokeCap({id: selected[0], strokeCap: strokeCapType})
    setStrokeCap(strokeCapType);
  };

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn>
        <SidebarToggleButton
          onClick={() => handleClick('butt')}
          active={'butt' === strokeCap}
          disabled={disabled}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <path d="M18,14 L18,21 L7,21 L7,16 L13,16 L13,14 L18,14 Z M12,9 L12,11 L18,11 L18,13 L12,13 L12,15 L6,15 L6,9 L12,9 Z M10,11 L8,11 L8,13 L10,13 L10,11 Z M18,3 L18,10 L13,10 L13,8 L7,8 L7,3 L18,3 Z" />
          </svg>
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
            <path d="M21,3 L21,10 L16,10 L16,8 L9,8 C8.48716416,8 8.06449284,8.38604019 8.00672773,8.88337887 L8,9 L8,15 C8,15.5128358 8.38604019,15.9355072 8.88337887,15.9932723 L9,16 L16,16 L16,14 L21,14 L21,21 L12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 L21,3 Z M15,9 L15,11 L21,11 L21,13 L15,13 L15,15 L9,15 L9,9 L15,9 Z M13,11 L11,11 L11,13 L13,13 L13,11 Z" />
          </svg>
        </SidebarToggleButton>
      </SidebarSectionColumn>
      <SidebarSectionColumn>
        <SidebarToggleButton
          onClick={() => handleClick('square')}
          active={'square' === strokeCap}
          disabled={disabled}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24">
            <path d="M21,3 L21,10 L16,10 L16,8 L8,8 L8,16 L16,16 L16,14 L21,14 L21,21 L3,21 L3,3 L21,3 Z M15,9 L15,11 L21,11 L21,13 L15,13 L15,15 L9,15 L9,9 L15,9 Z M13,11 L11,11 L11,13 L13,13 L13,11 Z" />
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
        return (layer.present.byId[layer.present.selected[0]].style.strokeOptions.dashArray[0] === 0 && layer.present.byId[layer.present.selected[0]].style.strokeOptions.dashArray[1] === 0) || !layer.present.byId[layer.present.selected[0]].style.stroke.enabled;
      default:
        return true;
    }
  })();
  const strokeCapValue = (() => {
    switch(layer.present.selected.length) {
      case 0:
        return null;
      case 1:
        return layer.present.byId[layer.present.selected[0]].style.strokeOptions.cap;
      default:
        return null;
    }
  })();
  return { selected, strokeCapValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayerStrokeCap }
)(StrokeCapInput);