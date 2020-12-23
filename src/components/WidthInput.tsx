import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import SidebarInput from './SidebarInput';
import { RootState } from '../store/reducers';
import { getSelectedInnerWidth } from '../store/selectors/layer';
import { setLayersWidth } from '../store/actions/layer';

const WidthInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const widthValue = useSelector((state: RootState) => getSelectedInnerWidth(state));
  const isDisabled = useSelector((state: RootState) => state.layer.present.selected.some((id) => state.layer.present.byId[id].type === 'Text'));
  const [width, setWidth] = useState(widthValue !== 'multi' ? Math.round(widthValue) : widthValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setWidth(widthValue !== 'multi' ? Math.round(widthValue) : widthValue);
  }, [widthValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setWidth(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      let nextWidth = mexp.eval(`${width}`) as any;
      if (nextWidth !== widthValue) {
        if (nextWidth < 1) {
          nextWidth = 1;
        }
        dispatch(setLayersWidth({layers: selected, width: Math.round(nextWidth)}));
        setWidth(Math.round(nextWidth));
      } else {
        setWidth(widthValue !== 'multi' ? Math.round(widthValue) : widthValue);
      }
    } catch(error) {
      setWidth(widthValue !== 'multi' ? Math.round(widthValue) : widthValue);
    }
  }

  return (
    <SidebarInput
      value={width}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitOnBlur
      label={'W'}
      disabled={isDisabled} />
  );
}

export default WidthInput;