import React, { useContext, ReactElement, useState } from 'react';
import { ThemeContext } from './ThemeProvider';

interface TweenDrawerIconProps {
  onClick(): void;
  iconPath: string;
  selected?: boolean;
}

const TweenDrawerIcon = (props: TweenDrawerIconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const [hover, setHover] = useState(false);
  const { onClick, iconPath, selected } = props;

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
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        style={{
          fill: selected
          ? theme.palette.primary
          : hover
            ? theme.text.base
            : theme.text.lighter
        }}>
        <path d={iconPath} />
      </svg>
    </div>
  );
}

export default TweenDrawerIcon;