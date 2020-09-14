import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { evaluate } from 'mathjs';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { SetLayersStrokeWidthPayload, LayerTypes } from '../store/actionTypes/layer';
import { setLayersStrokeWidth } from '../store/actions/layer';
import { getPaperLayer } from '../store/selectors/layer';

interface StrokeWidthInputProps {
  strokeWidthValue?: number | 'multi';
  selected?: string[];
  disabled?: boolean;
  setLayersStrokeWidth?(payload: SetLayersStrokeWidthPayload): LayerTypes;
}

const StrokeWidthInput = (props: StrokeWidthInputProps): ReactElement => {
  const { strokeWidthValue, selected, disabled, setLayersStrokeWidth } = props;
  const [strokeWidth, setStrokeWidth] = useState(strokeWidthValue);

  useEffect(() => {
    setStrokeWidth(strokeWidthValue);
  }, [strokeWidthValue, selected]);

  const handleStrokeWidthChange = (e: any): void => {
    const target = e.target;
    setStrokeWidth(target.value);
  };

  const handleStrokeWidthSubmit = (e: any): void => {
    try {
      const nextStrokeWidth = evaluate(`${strokeWidth}`);
      if (nextStrokeWidth !== strokeWidthValue && !isNaN(nextStrokeWidth)) {
        setLayersStrokeWidth({layers: selected, strokeWidth: nextStrokeWidth});
        setStrokeWidth(nextStrokeWidth);
      } else {
        setStrokeWidth(strokeWidthValue);
      }
    } catch(error) {
      setStrokeWidth(strokeWidthValue);
    }
  };

  return (
    <SidebarInput
      value={strokeWidth}
      onChange={handleStrokeWidthChange}
      onSubmit={handleStrokeWidthSubmit}
      submitOnBlur
      disabled={disabled}
      bottomLabel={'Width'} />
  );
}

const mapStateToProps = (state: RootState) => {
  const { layer } = state;
  const selected = layer.present.selected;
  const layerItems: (em.Shape | em.Image | em.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const strokeWidthValues = layerItems.reduce((result: number[], current: em.Shape | em.Image | em.Text) => {
    return [...result, current.style.stroke.width];
  }, []);
  const strokeWidthValue = strokeWidthValues.every((strokeWidth: number) => strokeWidth === strokeWidthValues[0]) ? strokeWidthValues[0] : 'multi';
  const disabled = !layerItems.every((layerItem) => layerItem.style.stroke.enabled);
  return { selected, strokeWidthValue, disabled };
};

export default connect(
  mapStateToProps,
  { setLayersStrokeWidth }
)(StrokeWidthInput);