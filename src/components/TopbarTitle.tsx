import { remote } from 'electron';
import React, { ReactElement, useContext } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface TopbarTitleProps {
  title: string;
  unsavedEdits: boolean;
}

const Title = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  top: 0;
  width: 100%;
  pointer-events: none;
  z-index: 99999999999;
  height: ${remote.process.platform === 'darwin' ? 22 : 30}px;
  color: ${props => props.theme.text.base};
  font-family: 'Space Mono';
  line-height: ${remote.process.platform === 'darwin' ? 22 : 30}px;
  .c-topbar-title__unsaved-indicator {
    color: ${props => props.theme.text.lighter};
    margin-left: ${props => props.theme.unit}px;
  }
`;

const TopbarTitle = (props: TopbarTitleProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { title, unsavedEdits } = props;

  return (
    <Title
      className='c-topbar-title'
      theme={theme}>
      <span>
        <span className='c-topbar-title__title'>{title}</span>
        {
          unsavedEdits
          ? <span className='c-topbar-title__unsaved-indicator'>(unsaved changes)</span>
          : null
        }
      </span>
    </Title>
  );
}

const mapStateToProps = (state: RootState): {
  unsavedEdits: boolean;
  title: string;
} => {
  const { layer, documentSettings } = state;
  const unsavedEdits = layer.present.edit !== documentSettings.edit;
  const title = documentSettings.name;
  return { unsavedEdits, title };
};

export default connect(
  mapStateToProps
)(TopbarTitle);