import React, { ReactElement, useRef, useState } from 'react';
import tinyColor from 'tinycolor2';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersCustomWiggleTweenStrength } from '../store/actions/layer';
import { getSelectedCustomWiggleTweensStrength, getSelectedTweensProp } from '../store/selectors/layer';
import MathFormGroup from './MathFormGroup';
import HexFormGroup from './HexFormGroup';
import PathDataFormGroup from './PathDataFormGroup';
import Form from './Form';

interface EaseEditorWiggleStrengthInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorWiggleStrengthInput = (props: EaseEditorWiggleStrengthInputProps): ReactElement => {
  const { setParamInfo } = props;
  const formControlRef = useRef(null);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const prop = useSelector((state: RootState) => getSelectedTweensProp(state));
  const strength = useSelector((state: RootState) => getSelectedCustomWiggleTweensStrength(state));
  const [strengthValue, setStrengthValue] = useState(strength);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setStrengthValue(e.target.value);
  }

  const handleSubmitSuccess = (newStrength: any): void => {
    if (strength !== newStrength) {
      const isColorProp = prop === 'fill' || prop === 'stroke' || prop === 'shadowColor';
      if (isColorProp) {
        const hsl = tinyColor(newStrength).toHsl();
        newStrength = { h: hsl.h, s: hsl.s, l: hsl.l, a: hsl.a };
      }
      dispatch(setLayersCustomWiggleTweenStrength({
        tweens: selectedTweens,
        strength: newStrength
      }));
    }
  }

  const handleTextSubmit = (e: any): void => {
    if (e.target.value !== strength) {
      dispatch(setLayersCustomWiggleTweenStrength({
        tweens: selectedTweens,
        strength: e.target.value
      }));
      setStrengthValue(e.target.value);
    }
  }

  switch(prop) {
    case 'text':
    case 'multi':
      return (
        <Form
          inline
          onSubmit={handleTextSubmit}
          submitOnBlur>
          <Form.Group controlId='control-ee-wiggles-strength'>
            <Form.Control
              ref={formControlRef}
              as='input'
              value={strengthValue}
              disabled={prop === 'multi'}
              size='small'
              type='text'
              onChange={handleChange}
              required
              rightReadOnly
              leftReadOnly />
            <Form.Label>
              Strength
            </Form.Label>
          </Form.Group>
        </Form>
      )
    case 'fill':
    case 'stroke':
    case 'shadowColor':
      return (
        <HexFormGroup
          ref={formControlRef}
          controlId='control-ee-wiggles-strength'
          value={strength !== 'multi' ? tinyColor(strength as any).toHex() : strength}
          size='small'
          label='Strength'
          onSubmitSuccess={handleSubmitSuccess}
          submitOnBlur />
      );
    case 'fillGradientOriginX':
    case 'fillGradientOriginY':
    case 'fillGradientDestinationX':
    case 'fillGradientDestinationY':
    case 'x':
    case 'y':
    case 'rotation':
    case 'width':
    case 'height':
    case 'strokeGradientOriginX':
    case 'strokeGradientOriginY':
    case 'strokeGradientDestinationX':
    case 'strokeGradientDestinationY':
    case 'dashOffset':
    case 'dashArrayWidth':
    case 'dashArrayGap':
    case 'strokeWidth':
    case 'shadowOffsetX':
    case 'shadowOffsetY':
    case 'shadowBlur':
    case 'opacity':
    case 'fontSize':
    case 'letterSpacing':
    case 'fontWeight':
    case 'lineHeight':
      return (
        <MathFormGroup
          ref={formControlRef}
          controlId='control-ee-wiggles-strength'
          value={strength}
          size='small'
          label='Strength'
          onSubmitSuccess={handleSubmitSuccess}
          submitOnBlur />
      );
    case 'shape':
      return (
        <PathDataFormGroup
          ref={formControlRef}
          controlId='control-ee-wiggles-strength'
          value={strength as string}
          size='small'
          label='Strength'
          onSubmitSuccess={handleSubmitSuccess}
          submitOnBlur />
      )
    default:
      return null;
  }
}

export default EaseEditorWiggleStrengthInput;