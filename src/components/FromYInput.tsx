import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { getSelectedFromY } from '../store/selectors/layer';
import { setLinesFromY } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const FromYInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const yValue = useSelector((state: RootState) => getSelectedFromY(state));
  const [y, setY] = useState(yValue !== 'multi' ? Math.round(yValue as number) : yValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setY(yValue !== 'multi' ? Math.round(yValue as number) : yValue);
  }, [yValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setY(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      const nextY = mexp.eval(`${y}`) as any;
      if (nextY !== yValue) {
        dispatch(setLinesFromY({layers: selected, y: Math.round(nextY)}));
        setY(Math.round(nextY));
      } else {
        setY(yValue !== 'multi' ? Math.round(yValue as number) : yValue);
      }
    } catch(error) {
      setY(yValue !== 'multi' ? Math.round(yValue as number) : yValue);
    }
  }

  return (
    <SidebarInput
      value={y}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label={'Y'} />
  );
}

export default FromYInput;