import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import mexp from 'math-expression-evaluator';
import { RootState } from '../store/reducers';
import { getSelectedInnerHeight } from '../store/selectors/layer';
import { setLayersHeight } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

const HeightInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const heightValue = useSelector((state: RootState) => getSelectedInnerHeight(state));
  const disabled = useSelector((state: RootState) => state.layer.present.selected.some((id) => state.layer.present.byId[id].type === 'Shape' && (state.layer.present.byId[id] as Btwx.Shape).shapeType === 'Line' || state.layer.present.byId[id].type === 'Text' || state.layer.present.byId[id].type === 'Group'));
  const [height, setHeight] = useState(heightValue !== 'multi' ? Math.round(heightValue) : heightValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setHeight(heightValue !== 'multi' ? Math.round(heightValue) : heightValue);
  }, [heightValue, selected]);

  const handleChange = (e: any) => {
    const target = e.target;
    setHeight(target.value);
  };

  const handleSubmit = (e: any) => {
    try {
      let nextHeight = mexp.eval(`${height}`) as any;
      if (height !== heightValue) {
        if (nextHeight < 1) {
          nextHeight = 1;
        }
        dispatch(setLayersHeight({layers: selected, height: Math.round(nextHeight)}));
        setHeight(Math.round(nextHeight));
      } else {
        setHeight(heightValue !== 'multi' ? Math.round(heightValue) : heightValue);
      }
    } catch(error) {
      setHeight(heightValue !== 'multi' ? Math.round(heightValue) : heightValue);
    }
  }

  return (
    <SidebarInput
      value={height}
      onChange={handleChange}
      onSubmit={handleSubmit}
      disabled={disabled}
      submitOnBlur
      label={'H'} />
  );
}

export default HeightInput;