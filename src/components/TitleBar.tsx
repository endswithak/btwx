import React, { useRef, useContext, useEffect, ReactElement } from 'react';
import { remote } from 'electron';
import FramelessTitleBar from 'frameless-titlebar';
import { ThemeContext } from './ThemeProvider';

const currentWindow = remote.getCurrentWindow();

interface TitleBarProps {
  title?: string;
}

const TitleBar = (props: TitleBarProps): ReactElement => {
  const theme = useContext(ThemeContext);
  return (
    <FramelessTitleBar
      currentWindow={currentWindow}
      platform={process.platform}
      theme={{
        "bar": {
          "palette": "dark",
          "height": "24px",
          "borderBottom": "",
          "background": theme.background.z1,
          "fontFamily": "'Space Mono', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', Arial, sans-serif",
        }
      }}
      title={props.title}
      drag={true}
      onClose={() => currentWindow.close()}
      onMinimize={() => currentWindow.minimize()}
      onMaximize={() => currentWindow.maximize()}
      onDoubleClick={() => currentWindow.maximize()} />
  );
}

export default TitleBar;