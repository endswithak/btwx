import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { canBooleanSelected } from '../store/selectors/layer';
import { applyBooleanOperationThunk } from '../store/actions/layer';
import StackedButton from './StackedButton';
import Icon from './Icon';

const SubtractButton = (): ReactElement => {
  const canSubtract = useSelector((state: RootState) => canBooleanSelected(state));
  const dispatch = useDispatch();

  const handleSubtractClick = (): void => {
    if (canSubtract) {
      dispatch(applyBooleanOperationThunk('subtract'));
    }
  }

  return (
    <StackedButton
      label='Subtract'
      onClick={handleSubtractClick}
      disabled={!canSubtract}
      size='small'>
      <Icon
        size='small'
        name='combine-subtract' />
    </StackedButton>
  );
}

export default SubtractButton;