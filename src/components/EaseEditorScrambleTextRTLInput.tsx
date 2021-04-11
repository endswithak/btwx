/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersScrambleTextTweenRightToLeft } from '../store/actions/layer';
import { getSelectedScrambleTextTweensRightToLeft } from '../store/selectors/layer';
import Form from './Form';
import Icon from './Icon';

interface EaseEditorScrambleTextRTLInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorScrambleTextRTLInput = (props: EaseEditorScrambleTextRTLInputProps): ReactElement => {
  const { setParamInfo } = props;
  const formControlRef = useRef(null);
  const selectedTweens = useSelector((state: RootState) => state.layer.present.tweens.selected.allIds);
  const rtlValue = useSelector((state: RootState) => getSelectedScrambleTextTweensRightToLeft(state));
  const [rtl, setRTL] = useState(rtlValue ? 'RTL' : 'LTR');
  const dispatch = useDispatch();

  const options = [
    ...(rtlValue === 'multi' ? [{ value: 'multi', label: 'multi' }] : []),
    ...[{
      value: 'LTR',
      label: 'LTR'
    },{
      value: 'RTL',
      label: 'RTL'
    }]
  ].map((option, index) => (
      <option
        key={index}
        value={option.value}>
        { option.label }
      </option>
    ));

  useEffect(() => {
    setRTL(rtlValue ? 'RTL' : 'LTR');
  }, [rtlValue]);

  const handleChange = (e): void => {
    if ((e.target.value === 'RTL' && !rtlValue) || (e.target.value === 'LTR' && rtlValue)) {
      setRTL(e.target.value);
      dispatch(setLayersScrambleTextTweenRightToLeft({
        tweens: selectedTweens,
        rightToLeft: e.target.value === 'RTL'
      }));
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'String',
      description: 'Direction the text will be revealed.'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
  }

  return (
    <Form
      inline
      validated={true}>
      <Form.Group controlId='control-ee-sc-rtl'>
        <Form.Control
          ref={formControlRef}
          as='select'
          value={rtl}
          size='small'
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
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
          Reveal
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default EaseEditorScrambleTextRTLInput;