import FileFormat from '@sketch-hq/sketch-file-format-ts';
import React, { useContext, ReactElement } from 'react';
import styled from 'styled-components';
import { ThemeContext } from './ThemeProvider';

interface SketchImporterArtboardProps {
  artboard: FileFormat.Artboard;
  selectedArtboards: string[];
  setSelectedArtboards(selectedArtboards: string[]): void;
}

interface ButtonProps {
  isSelected: boolean;
}

const Button = styled.button<ButtonProps>`
  background: ${
    props => props.isSelected
    ? props.theme.palette.primary
    : 'none'
  };
  color: ${
    props => props.isSelected
    ? props.theme.text.onPrimary
    : props.theme.text.base
  };
  .c-sketch-importer-artboard__size {
    color: ${
      props => props.isSelected
      ? props.theme.text.onPrimary
      : props.theme.text.lighter
    };
  }
  :hover {
    background: ${
      props => props.isSelected
      ? props.theme.palette.primaryHover
      : 'none'
    };
    box-shadow: ${
      props => props.isSelected
      ? 'none'
      : `0 0 0 1px ${props.theme.background.z4} inset`
    };
    color: ${
      props => props.isSelected
      ? props.theme.text.onPrimary
      : props.theme.text.base
    };
    .c-sketch-importer-artboard__size {
      color: ${
        props => props.isSelected
        ? props.theme.text.onPrimary
        : props.theme.text.light
      };
    }
  }
`;

const SketchImporterArtboard = (props: SketchImporterArtboardProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { artboard, selectedArtboards, setSelectedArtboards } = props;

  const handleClick = (e: any) => {
    const shiftModifier = e.nativeEvent.shiftKey;
    const artboardSelected = selectedArtboards.includes(artboard.do_objectID);
    let newSelection: string[];
    if (shiftModifier) {
      if (artboardSelected) {
        newSelection = selectedArtboards.filter(id => id !== artboard.do_objectID);
      } else {
        newSelection = [...selectedArtboards, artboard.do_objectID];
      }
    } else {
      newSelection = [artboard.do_objectID];
    }
    setSelectedArtboards(newSelection);
  }

  return (
    <Button
      theme={theme}
      className='c-sketch-importer__artboard'
      onClick={handleClick}
      isSelected={selectedArtboards.includes(artboard.do_objectID)}>
      <span className='c-sketch-importer-artboard__name'>
        { artboard.name }
      </span>
      <span className='c-sketch-importer-artboard__size'>
        { artboard.frame.width }x{ artboard.frame.height }
      </span>
    </Button>
  );
}

export default SketchImporterArtboard;