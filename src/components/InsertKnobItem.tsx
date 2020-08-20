import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';

interface InsertKnobItemProps {
  item: {
    label: string;
    icon: em.Icon;
    onSelection: any;
  };
  isActive: boolean;
}

interface ItemProps {
  isActive: boolean;
}

const Item = styled.li<ItemProps>`
  background: ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
  svg {
    fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
  }
`;

const InsertKnobItem = (props: InsertKnobItemProps): ReactElement => {
  const { isActive, item } = props;
  const theme = useContext(ThemeContext);

  return (
    <Item
      className='c-insert-knob__item'
      theme={theme}
      isActive={isActive}>
      <div className='c-insert-knob__icon'>
        <svg
          viewBox='0 0 24 24'
          width='24px'
          height='24px'>
          <path d={item.icon.fill} />
        </svg>
      </div>
      <div className='c-insert-knob__label'>
        {item.label}
      </div>
    </Item>
  );
}

export default InsertKnobItem;