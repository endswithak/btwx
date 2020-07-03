import React, {createContext} from 'react';
import getTheme, {lightTheme, darkTheme} from '../store/theme';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';

interface ThemeProviderProps {
  children: React.ReactNode;
  theme: em.ThemeName;
}

const ThemeContext = createContext(darkTheme);
const { Provider } = ThemeContext;

const ThemeProvider = (props: ThemeProviderProps) => {
  const { children, theme } = props;
  return (
    <Provider value={getTheme(theme)}>
      {children}
    </Provider>
  )
};

const mapStateToProps = (state: RootState) => {
  const { theme } = state;
  return { theme: theme.theme };
};

export default connect(
  mapStateToProps
)(ThemeProvider);

export { ThemeContext };