import React, { useContext, ReactElement, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gsap } from 'gsap';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface InsertKnobItemProps {
  item: {
    label: string;
    icon: string;
    onSelection: any;
  };
  index: number;
  isActive: boolean;
  onMouseEnter(index: number): void;
  onClick(index: number): void;
}

interface ItemProps {
  isActive: boolean;
  onClick: any;
  onMouseEnter: any;
}

const Item = styled.li<ItemProps>`
  cursor: pointer;
  background: ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z2};
  color: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
  box-shadow: 0 0 0 1px ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset, 0 4px 16px 0 rgba(0,0,0,0.16);
  svg {
    fill: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
  }
`;

const InsertKnobItem = (props: InsertKnobItemProps): ReactElement => {
  const { isActive, item, onMouseEnter, index, onClick } = props;
  const theme = useContext(ThemeContext);
  // const ref = useRef<HTMLLIElement>(null);

  // useEffect(() => {
  //   if (ref.current) {
  //     gsap.fromTo(ref.current, { scale: 0 }, { scale: 1, duration: 0.10, delay: 0.01 * index });
  //   }
  // }, []);

  return (
    <Item
      // ref={ref}
      className='c-insert-knob__item'
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      theme={theme}
      isActive={isActive}>
      <div className='c-insert-knob__icon'>
        <Icon name={item.icon} />
      </div>
      <div className='c-insert-knob__label'>
        {item.label}
      </div>
    </Item>
  );
}

export default InsertKnobItem;