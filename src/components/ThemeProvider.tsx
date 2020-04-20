import React, {createContext} from 'react';
import getTheme, {lightTheme, darkTheme} from '../store/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext(darkTheme);
const { Provider } = ThemeContext;

const ThemeProvider = (props: ThemeProviderProps) => {
  return (
    <Provider value={darkTheme}>
      {props.children}
    </Provider>
  )
};

export { ThemeContext, ThemeProvider }