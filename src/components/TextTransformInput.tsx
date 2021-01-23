import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersTextTransformThunk } from '../store/actions/layer';
import { getSelectedTextTransform } from '../store/selectors/layer';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import SidebarButtonGroup from './SidebarButtonGroup';
import SidebarToggleButton from './SidebarToggleButton';
import Icon from './Icon';

const TextTransformInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const textTransformValue = useSelector((state: RootState) => getSelectedTextTransform(state));
  const [textTransform, setTextTransform] = useState(textTransformValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setTextTransform(textTransformValue);
  }, [textTransformValue, selected]);

  const handleClick = (textTransformButtonValue: Btwx.TextTransform): void => {
    dispatch(setLayersTextTransformThunk({layers: selected, textTransform: textTransformButtonValue as Btwx.TextTransform}));
    setTextTransform(textTransformButtonValue);
  };

  return (
    <SidebarButtonGroup bottomLabel='Transform'>
      <SidebarSectionRow>
        <SidebarSectionColumn width='33.33%'>
          <SidebarToggleButton
            onClick={() => handleClick('none')}
            active={'none' === textTransform}>
            <Icon name='text-transform-none' />
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn width='33.33%'>
          <SidebarToggleButton
            onClick={() => handleClick('uppercase')}
            active={'uppercase' === textTransform}>
            <Icon name='text-transform-uppercase' />
          </SidebarToggleButton>
        </SidebarSectionColumn>
        <SidebarSectionColumn width='33.33%'>
          <SidebarToggleButton
            onClick={() => handleClick('lowercase')}
            active={'lowercase' === textTransform}>
            <Icon name='text-transform-lowercase' />
          </SidebarToggleButton>
        </SidebarSectionColumn>
      </SidebarSectionRow>
    </SidebarButtonGroup>
  );
}

export default TextTransformInput;