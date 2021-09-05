import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import { boolSelectedThunk } from '../store/actions/layer';
import { canBooleanSelected } from '../store/selectors/layer';
import StackedButton from './StackedButton';
import Icon from './Icon';

const ExcludeButton = (): ReactElement => {
  const canExclude = useSelector((state: RootState) => canBooleanSelected(state));
  const dispatch = useDispatch();

  const handleExcludeClick = (): void => {
    if (canExclude) {
      dispatch(boolSelectedThunk('exclude'));
    }
  }

  return (
    <StackedButton
      label='Difference'
      onClick={handleExcludeClick}
      disabled={!canExclude}
      size='small'>
      <Icon
        size='small'
        name='combine-exclude' />
    </StackedButton>
  );
}

export default ExcludeButton;