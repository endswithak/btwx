import React, { ReactElement, useEffect } from 'react';
import { clipboard } from 'electron';
import { connect } from 'react-redux';
import { RootState } from '../store/reducers';
import { canPasteSVG } from '../store/selectors/layer';
import { setMenuItems } from '../utils';

interface MenuEditProps {
  canSelectAll?: boolean;
  canSelectAllArtboards?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  focusing?: boolean;
  selectedLength?: number;
  canPasteAsSVG?: boolean;
  clipboardType?: em.ClipboardType;
}

const MenuEdit = (props: MenuEditProps): ReactElement => {
  const { canSelectAll, canSelectAllArtboards, canUndo, canRedo, focusing, selectedLength, canPasteAsSVG, clipboardType } = props;

  useEffect(() => {
    setMenuItems({
      editUndo: {
        id: 'editUndo',
        enabled: focusing && canUndo
      },
      editRedo: {
        id: 'editRedo',
        enabled: focusing && canRedo
      },
      editCut: {
        id: 'editCut',
        enabled: focusing && selectedLength > 0
      },
      editDelete: {
        id: 'editDelete',
        enabled: focusing && selectedLength > 0
      },
      editDuplicate: {
        id: 'editDuplicate',
        enabled: focusing && selectedLength > 0
      },
      editSelectAll: {
        id: 'editSelectAll',
        enabled: focusing && canSelectAll
      },
      editSelectAllArtboards: {
        id: 'editSelectAllArtboards',
        enabled: focusing && canSelectAllArtboards
      },
      editCopy: {
        id: 'editCopy',
        enabled: focusing && selectedLength > 0
      },
      editCopySVG: {
        id: 'editCopySVG',
        enabled: focusing && selectedLength > 0
      },
      editCopyStyle: {
        id: 'editCopyStyle',
        enabled: focusing && selectedLength === 1
      },
      editPaste: {
        id: 'editPaste',
        enabled: focusing && clipboardType === 'layers'
      },
      editPasteOverSelection: {
        id: 'editPasteOverSelection',
        enabled: focusing && clipboardType === 'layers' && selectedLength > 0
      },
      editPasteStyle: {
        id: 'editPasteStyle',
        enabled: focusing && clipboardType === 'style' && selectedLength > 0
      },
      editPasteSVG: {
        id: 'editPasteSVG',
        enabled: focusing && canPasteAsSVG
      }
    });
  }, [canUndo, canRedo, focusing, selectedLength, canPasteAsSVG, clipboardType]);

  return (
    <></>
  );
}

const mapStateToProps = (state: RootState): {
  canSelectAll: boolean;
  canSelectAllArtboards: boolean;
  canUndo: boolean;
  canRedo: boolean;
  focusing: boolean;
  selectedLength: number;
  canPasteAsSVG: boolean;
  clipboardType: em.ClipboardType;
} => {
  const { canvasSettings, layer } = state;
  const canUndo = layer.past.length > 0;
  const canRedo = layer.future.length > 0;
  const canSelectAll = layer.present.allIds.length > 1;
  const canSelectAllArtboards = layer.present.allArtboardIds.length > 0;
  const focusing = canvasSettings.focusing;
  const selectedLength = layer.present.selected.length;
  const canPasteAsSVG = canPasteSVG();
  const clipboardType: em.ClipboardType = ((): em.ClipboardType => {
    try {
      const text = clipboard.readText();
      const parsedText: em.ClipboardLayers = JSON.parse(text);
      return parsedText.type ? parsedText.type : null;
    } catch (error) {
      return null;
    }
  })();
  return { canSelectAll, canSelectAllArtboards, canUndo, canRedo, focusing, selectedLength, canPasteAsSVG, clipboardType };
};

export default connect(
  mapStateToProps
)(MenuEdit);