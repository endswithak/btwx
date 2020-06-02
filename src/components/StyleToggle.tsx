import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface StrokeOptionsToggleProps {
  styleEnabled: boolean;
  setStyleEnabled(styleEnabled: boolean): void;
}

const StyleToggle = (props: StrokeOptionsToggleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { styleEnabled, setStyleEnabled } = props;

  return (
    <div
      onClick={() => setStyleEnabled(!styleEnabled)}
      style={{
        display: 'flex',
        width: theme.unit * 8,
        height: theme.unit * 8,
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}>
      <svg
        enableBackground="new 0 0 24 24"
        viewBox="0 0 24 24"
        width="18px"
        height="18px"
        style={{
          fill: styleEnabled
          ? theme.palette.primary
          : theme.text.lighter
        }}>
        <path d={
          styleEnabled
          ? 'M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'
          : 'M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'
        } />
      </svg>
    </div>
  );
}

export default StyleToggle;