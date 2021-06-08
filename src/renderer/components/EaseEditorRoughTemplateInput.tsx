import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import { RootState } from '../store/reducers';
import { setLayersRoughTweenTemplate } from '../store/actions/layer';
import { getSelectedRoughTweensTemplate, getSelectedRoughTweenPropsMatch } from '../store/selectors/layer';
import Form from './Form';

gsap.registerPlugin(CustomEase, RoughEase);

interface EaseEditorRoughTemplateInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorRoughTemplateInput = (props: EaseEditorRoughTemplateInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { setParamInfo } = props;
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const selectedTweensById = useSelector((state: RootState) => selectedTweens.reduce((result, current) => ({
    ...result,
    [current]: state.layer.present.tweens.byId[current]
  }), {}));
  const template = useSelector((state: RootState) => getSelectedRoughTweensTemplate(state));
  const roughPropsMatch = useSelector((state: RootState) => getSelectedRoughTweenPropsMatch(state));
  const [currentValue, setCurrentValue] = useState(template === 'none' ? '' : template);
  const [evaluation, setEvaluation] = useState(template);
  const [valid, setValid] = useState(true);
  const [dirty, setDirty] = useState(false);
  const dispatch = useDispatch();

  const evaluateTemplate = (value: string): string => {
    try {
      const initialRoughProps = selectedTweensById[selectedTweens[0]].rough;
      const ref = CustomEase.getSVGData(`rough({clamp: ${initialRoughProps.clamp}, points: ${initialRoughProps.points}, randomize: ${initialRoughProps.randomize}, strength: ${initialRoughProps.strength}, taper: ${initialRoughProps.taper}, template: ${value.length === 0 ? 'none' : value}})`, {width: 400, height: 400});
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
      if (roughPropsMatch) {
        const tweenRef = selectedTweensById[selectedTweens[0]];
        const sharedRef = CustomEase.getSVGData(`rough({
          clamp: ${tweenRef.rough.clamp},
          points: ${tweenRef.rough.points},
          randomize: ${tweenRef.rough.randomize},
          strength: ${tweenRef.rough.strength},
          taper: ${tweenRef.rough.taper},
          template: ${currentValue}
        })`, {
          width: 400,
          height: 400
        });
        dispatch(setLayersRoughTweenTemplate({
          tweens: selectedTweens,
          template: currentValue.length === 0 ? 'none' : currentValue,
          ref: selectedTweens.reduce((result, current) => ({
            ...result,
            [current]: sharedRef
          }), {})
        }));
      } else {
        dispatch(setLayersRoughTweenTemplate({
          tweens: selectedTweens,
          template: currentValue.length === 0 ? 'none' : currentValue,
          ref: selectedTweens.reduce((result, current) => {
            const tweenItem = selectedTweensById[current];
            const roughProps = tweenItem.rough;
            return {
              ...result,
              [current]: CustomEase.getSVGData(`rough({
                clamp: ${roughProps.clamp},
                points: ${roughProps.points},
                randomize: ${roughProps.randomize},
                strength: ${roughProps.strength},
                taper: ${roughProps.taper},
                template: ${currentValue}
              })`, {
                width: 400,
                height: 400
              })
            };
          }, {})
        }));
      }
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