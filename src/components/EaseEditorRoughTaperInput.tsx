/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize'
import { RootState } from '../store/reducers';
import { setLayersRoughTweenTaper } from '../store/actions/layer';
import { getSelectedRoughTweensTaper, getSelectedRoughTweenPropsMatch } from '../store/selectors/layer';
import { DEFAULT_ROUGH_TWEEN_TAPER_TYPES } from '../constants';
import Form from './Form';
import Icon from './Icon';

gsap.registerPlugin(CustomEase, RoughEase);

interface EaseEditorRoughTaperInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorRoughTaperInput = (props: EaseEditorRoughTaperInputProps): ReactElement => {
  const { setParamInfo } = props;
  const formControlRef = useRef<HTMLSelectElement>(null);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const selectedTweensById = useSelector((state: RootState) => selectedTweens.reduce((result, current) => ({
    ...result,
    [current]: state.layer.present.tweens.byId[current]
  }), {}));
  const taperValue = useSelector((state: RootState) => getSelectedRoughTweensTaper(state));
  const roughPropsMatch = useSelector((state: RootState) => getSelectedRoughTweenPropsMatch(state));
  const [taper, setTaper] = useState(taperValue);
  const dispatch = useDispatch();

  const options = [
    ...(taperValue === 'multi' ? [{ value: 'multi', label: 'multi' }] : []),
    ...DEFAULT_ROUGH_TWEEN_TAPER_TYPES.map((option) => ({
      value: option,
      label: capitalize(option)
    }))
  ].map((option, index) => (
    <option
      key={index}
      value={option.value}>
      { option.label }
    </option>
  ));

  useEffect(() => {
    setTaper(taperValue);
  }, [taperValue]);

  const handleChange = (e: any): void => {
    setTaper(e.target.value);
    if (roughPropsMatch) {
      const tweenRef = selectedTweensById[selectedTweens[0]];
      const sharedRef = CustomEase.getSVGData(`rough({
        clamp: ${tweenRef.rough.clamp},
        points: ${tweenRef.rough.points},
        randomize: ${tweenRef.rough.randomize},
        strength: ${tweenRef.rough.strength},
        taper: ${e.target.value},
        template: ${tweenRef.rough.template}
      })`, {
        width: 400,
        height: 400
      });
      dispatch(setLayersRoughTweenTaper({
        tweens: selectedTweens,
        taper: e.target.value,
        ref: selectedTweens.reduce((result, current) => ({
          ...result,
          [current]: sharedRef
        }), {})
      }));
    } else {
      dispatch(setLayersRoughTweenTaper({
        tweens: selectedTweens,
        taper: e.target.value,
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
              taper: ${e.target.value},
              template: ${roughProps.template}
            })`, {
              width: 400,
              height: 400
            })
          };
        }, {})
      }));
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'String',
      description: 'To make the strength of the roughness taper towards the end or beginning or both, use "out", "in", or "both" respectively.'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
  }

  return (
    <Form inline>
      <Form.Group controlId='control-ee-rough-taper'>
        <Form.Control
          ref={formControlRef}
          as='select'
          value={taper}
          size='small'
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required
          rightReadOnly
          right={
            <Form.Text>
              <Icon
                name='list-toggle'
                size='small' />
            </Form.Text>
          }>
          { options }
        </Form.Control>
        <Form.Label>
          Taper
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default EaseEditorRoughTaperInput;