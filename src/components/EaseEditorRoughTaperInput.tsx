/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import { useSelector, useDispatch } from 'react-redux';
import capitalize from 'lodash.capitalize'
import { RootState } from '../store/reducers';
import { setLayerRoughTweenTaper } from '../store/actions/layer';
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
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const taperValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough.taper : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'rough' : true);
  const roughTween = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough : null);
  const [taper, setTaper] = useState(taperValue);
  const dispatch = useDispatch();

  const options = DEFAULT_ROUGH_TWEEN_TAPER_TYPES.map((option) => ({
    value: option,
    label: capitalize(option)
  })).map((option, index) => (
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
    const ref = CustomEase.getSVGData(`rough({clamp: ${roughTween.clamp}, points: ${roughTween.points}, randomize: ${roughTween.randomize}, strength: ${roughTween.strength}, taper: ${e.target.value}, template: ${roughTween.template}})`, {width: 400, height: 400});
    dispatch(setLayerRoughTweenTaper({id: id, taper: e.target.value, ref: ref}));
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
          disabled={disabled}
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