import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { getSelectedFromX } from '../store/selectors/layer';
import { setLinesFromXThunk } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const FromXInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const xValue = useSelector((state: RootState) => getSelectedFromX(state));
  const [x, setX] = useState(xValue !== 'multi' ? Math.round(xValue as number) : xValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setX(xValue !== 'multi' ? Math.round(xValue as number) : xValue);
  }, [xValue, selected]);

  const handleChange = (e: any): void => {
    const target = e.target;
    setX(target.value);
  };

  const handleSubmit = (e: any): void => {
    try {
      const nextX = mexp.eval(`${x}`) as any;
      if (nextX !== xValue) {
        dispatch(setLinesFromXThunk({layers: selected, x: Math.round(nextX)}));
        setX(Math.round(nextX));
      } else {
        setX(xValue !== 'multi' ? Math.round(xValue as number) : xValue);
      }
    } catch(error) {
      setX(xValue !== 'multi' ? Math.round(xValue as number) : xValue);
    }
  }

  return (
    <SidebarInput
      value={x}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label={'X'} />
  );
}

export default FromXInput;