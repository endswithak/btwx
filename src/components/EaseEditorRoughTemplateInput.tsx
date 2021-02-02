import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import { RootState } from '../store/reducers';
import { setLayerRoughTweenTemplate } from '../store/actions/layer';
import Form from './Form';

gsap.registerPlugin(CustomEase, RoughEase);

interface EaseEditorRoughTemplateInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorRoughTemplateInput = (props: EaseEditorRoughTemplateInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const template = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough.template : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'rough' : true);
  const roughTween = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough : null);
  const [currentValue, setCurrentValue] = useState(template === 'none' ? '' : template);
  const [evaluation, setEvaluation] = useState(template);
  const [valid, setValid] = useState(true);
  const [dirty, setDirty] = useState(false);
  const dispatch = useDispatch();

  const evaluateTemplate = (value: string): string => {
    try {
      const ref = CustomEase.getSVGData(`rough({clamp: ${roughTween.clamp}, points: ${roughTween.points}, randomize: ${roughTween.randomize}, strength: ${roughTween.strength}, taper: ${roughTween.taper}, template: ${value.length === 0 ? 'none' : value}})`, {width: 400, height: 400});
      CustomEase.getSVGData(value.length === 0 ? 'none' : value, {width: 100, height: 100});
      return ref;
    } catch(error) {
      return null;
    }
  }

  const handleChange = (e: any): void => {
    const nextValue = e.target.value;
    const nextEval = evaluateTemplate(nextValue);
    setEvaluation(nextEval);
    setValid(nextEval !== null);
    setDirty(nextValue.length === 0 ? 'none' !== template : nextValue !== template);
    setCurrentValue(nextValue);
  }

  const handleSubmit = (e: any): void => {
    if (valid && dirty) {
      dispatch(setLayerRoughTweenTemplate({id: id, template: currentValue.length === 0 ? 'none' : currentValue, ref: evaluation}));
    } else {
      setCurrentValue(template === 'none' ? '' : template);
      setValid(true);
    }
    setDirty(false);
  }

  const handleFocus = (e: any): void => {
    setParamInfo({
      type: 'String',
      description: 'An ease that should be used as a template, like a general guide. The RoughEase will plot points that wander from that template. You can use this to influence the general shape of the RoughEase.'
    });
  }

  const handleBlur = (e: any): void => {
    setParamInfo(null);
  }

  useEffect(() => {
    setCurrentValue(template === 'none' ? '' : template);
  }, [template]);

  return (
    <Form
      inline
      onSubmit={handleSubmit}
      submitOnBlur>
      <Form.Group controlId='control-ee-rough-template'>
        <Form.Control
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          ref={formControlRef}
          placeholder='Add template...'
          as='input'
          value={currentValue}
          size='small'
          type='text'
          isInvalid={!valid && dirty}
          isValid={valid && dirty}
          onChange={handleChange}
          required
          rightReadOnly
          leftReadOnly />
        <Form.Label>
          Template
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default EaseEditorRoughTemplateInput;