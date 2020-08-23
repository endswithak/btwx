import React, { useContext, ReactElement, useState } from 'react';
import { ThemeContext } from './ThemeProvider';
import Icon from './Icon';

interface TweenDrawerIconProps {
  onClick(): void;
  icon: string;
  selected?: boolean;
}

const TweenDrawerIcon = (props: TweenDrawerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const [hover, setHover] = useState(false);
  const { onClick, icon, selected } = props;

  const handleMouseEnter = () => {
    setHover(true);
  }

  const handleMouseLeave = () => {
    setHover(false);
  }

  return (
    <div
      className='c-tween-drawer__icon'
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <Icon
        name={icon}
        style={{
          fill: selected
          ? theme.palette.primary
          : hover
            ? theme.text.base
            : theme.text.lighter
        }} />
    </div>
  );
}

export default TweenDrawerIcon;