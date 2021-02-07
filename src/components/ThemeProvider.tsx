import React, { createContext, ReactElement } from 'react';
import getTheme, { THEMES } from '../store/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext(THEMES.dark);
const { Provider } = ThemeContext;

const ThemeProvider = (props: ThemeProviderProps): ReactElement => {
  const { children } = props;
  const theme = useSelector((state: RootState) => state.viewSettings.theme);
  return (
    <Provider value={getTheme(theme)}>
      {children}
    </Provider>
  )
};

export default ThemeProvider;

export { ThemeContext };