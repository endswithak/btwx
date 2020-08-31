import FileFormat from '@sketch-hq/sketch-file-format-ts';
import styled from 'styled-components';
import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';

interface SketchImporterActionsProps {
  selectedArtboards: string[];
  handleImport(): void;
  handleCancel(): void;
}

const CancelButton = styled.button`
  background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5} inset;
  color: ${props => props.theme.text.lighter};
  :hover {
    background: ${props => props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
    box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6} inset;
    color: ${props => props.theme.text.base};
  }
`;

const ImportButton = styled.button`
  background: ${props => props.theme.palette.primary};
  color: ${props => props.theme.text.onPrimary};
  :hover {
    background: ${props => props.theme.palette.primaryHover};
    color: ${props => props.theme.text.onPrimary};
    :disabled {
      background: ${props => props.theme.palette.primary};
    }
  }
  :disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const SketchImporterActions = (props: SketchImporterActionsProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { selectedArtboards, handleImport, handleCancel } = props;

  return (
    <div
      className='c-sketch-importer__actions'
      style={{
        background: theme.name === 'dark' ? theme.background.z1 : theme.background.z2,
        boxShadow: `0 1px 0 0 ${theme.name === 'dark' ? theme.background.z4 : theme.background.z5} inset`
      }}>
      <CancelButton
        theme={theme}
        onClick={handleCancel}>
        Cancel
      </CancelButton>
      <ImportButton
        theme={theme}
        disabled={selectedArtboards.length === 0}
        onClick={handleImport}>
        Import
      </ImportButton>
    </div>
  );
}

export default SketchImporterActions;