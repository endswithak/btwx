import FileFormat from '@sketch-hq/sketch-file-format-ts';
import styled from 'styled-components';
import React, { useContext, ReactElement } from 'react';
import { ThemeContext } from './ThemeProvider';
import SidebarSectionRow from './SidebarSectionRow';

interface SketchImporterPageProps {
  page: FileFormat.Page;
  activePage: string;
  selectedArtboards: string[];
  setActivePage(activePage: string): void;
}

interface ButtonProps {
  isSelected: boolean;
  selectedArtboards: boolean;
}

const Button = styled.button<ButtonProps>`
  background: ${
    props => props.isSelected
    ? props.theme.background.z4
    : 'none'
  };
  color: ${
    props => props.isSelected
    ? props.theme.text.base
    : props.theme.text.lighter
  };
  .c-sketch-importer-page__selected-artboards-indicator {
    background: ${
      props => props.selectedArtboards
      ? props.theme.palette.primary
      : 'none'
    };
  }
  :hover {
    background: ${
      props => props.isSelected
      ? props.theme.background.z4
      : 'none'
    };
    color: ${
      props => props.isSelected
      ? props.theme.text.base
      : props.theme.text.base
    };
  }
`;

const SketchImporterPage = (props: SketchImporterPageProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { page, activePage, setActivePage, selectedArtboards } = props;

  const handleClick = () => {
    if (activePage !== page.do_objectID) {
      setActivePage(page.do_objectID);
    }
  }

  return (
    <SidebarSectionRow>
      <Button
        className='c-sketch-importer__page'
        theme={theme}
        isSelected={activePage === page.do_objectID}
        selectedArtboards={page.layers.some(layer => selectedArtboards.includes(layer.do_objectID))}
        onClick={handleClick}>
        <span className='c-sketch-importer-page__name'>{ page.name }</span>
        <span className='c-sketch-importer-page__selected-artboards-indicator' />
      </Button>
    </SidebarSectionRow>
  );
}

export default SketchImporterPage;