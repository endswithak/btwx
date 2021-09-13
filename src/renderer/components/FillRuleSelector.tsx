import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeFillRuleSelector } from '../store/actions/fillRuleSelector';
import { getSelectedFillRule } from '../store/selectors/layer';
import { setLayersFillRule } from '../store/actions/layer';
import { RootState } from '../store/reducers';
import Form from './Form';
import Icon from './Icon';


const FillRuleSelector = (): ReactElement => {
  const listRef = useRef<HTMLDivElement>(null);
  const formControlRef = useRef<HTMLSelectElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const fillRuleValue = useSelector((state: RootState) => getSelectedFillRule(state));
  const [fillRule, setFillRule] = useState(fillRuleValue);
  const y = useSelector((state: RootState) => state.fillRuleSelector.y);
  const dispatch = useDispatch();

  const options: ReactElement[] = [
    ...(fillRuleValue === 'multi' ? [{ value: 'multi', label: 'multi' }] : []),
    { value: 'nonzero', label: 'Non-Zero' },
    { value: 'evenodd', label: 'Even-Odd' }
  ].map((option, index) => (
    <option
      key={index}
      value={option.value}>
      { option.label }
    </option>
  ));

  const onMouseDown = (event: any): void => {
    if (!listRef.current.contains(event.target) && !document.getElementById('fill-rule-toggle').contains(event.target)) {
      dispatch(closeFillRuleSelector());
    }
  }

  useEffect(() => {
    setFillRule(fillRuleValue);
  }, [fillRuleValue, selected]);

  const handleChange = (e: any): void => {
    if (e.target.value !== 'multi') {
      setFillRule(e.target.value);
      dispatch(setLayersFillRule({
        layers: selected,
        fillRule: e.target.value
      }));
    }
  }

  useEffect(() => {
    if (formControlRef.current) {
      formControlRef.current.focus();
    }
    document.addEventListener('mousedown', onMouseDown, true);
    return (): void => {
      document.removeEventListener('mousedown', onMouseDown, true);
    }
  }, []);

  return (
    <div
      className='c-fill-rule-selector'
      ref={listRef}
      style={{
        top: y
      }}>
      <div className='c-fill-rule-selector__input'>
        <Form inline>
          <Form.Group controlId='control-fill-rule'>
            <Form.Control
              ref={formControlRef}
              as='select'
              value={fillRule}
              size='small'
              onChange={handleChange}
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
              Fill Rule
            </Form.Label>
          </Form.Group>
        </Form>
      </div>
      <div className='c-fill-rule-selector__info'>
        <p>
          Determines how to fill shapes with overlapping paths.
        </p>
        <p>
          Non-Zero will fill the entire shape, while Even-Odd will preserve the holes in the overlapping paths.
        </p>
      </div>
    </div>
  );
}

export default FillRuleSelector;