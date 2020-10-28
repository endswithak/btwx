import React, { ReactElement, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import mexp from 'math-expression-evaluator';
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
  const [strokeWidth, setStrokeWidth] = useState(strokeWidthValue !== 'multi' ? Math.round(strokeWidthValue) : strokeWidthValue);

  useEffect(() => {
    setStrokeWidth(strokeWidthValue !== 'multi' ? Math.round(strokeWidthValue) : strokeWidthValue);
  }, [strokeWidthValue, selected]);

  const handleStrokeWidthChange = (e: any): void => {
    const target = e.target;
    setStrokeWidth(target.value);
  };

  const handleStrokeWidthSubmit = (e: any): void => {
    try {
      const nextStrokeWidth = mexp.eval(`${strokeWidth}`) as any;
      if (nextStrokeWidth !== strokeWidthValue) {
        setLayersStrokeWidth({layers: selected, strokeWidth: Math.round(nextStrokeWidth)});
        setStrokeWidth(Math.round(nextStrokeWidth));
      } else {
        setStrokeWidth(strokeWidthValue !== 'multi' ? Math.round(strokeWidthValue) : strokeWidthValue);
      }
    } catch(error) {
      setStrokeWidth(strokeWidthValue !== 'multi' ? Math.round(strokeWidthValue) : strokeWidthValue);
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
  const layerItems: (Btwx.Shape | Btwx.Image | Btwx.Text)[] = selected.reduce((result, current) => {
    const layerItem = layer.present.byId[current];
    return [...result, layerItem];
  }, []);
  const strokeWidthValues = layerItems.reduce((result: number[], current: Btwx.Shape | Btwx.Image | Btwx.Text) => {
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