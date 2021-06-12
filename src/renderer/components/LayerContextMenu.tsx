import React, { useEffect, ReactElement, useState } from 'react';
import MenuLayerAddEvent from './MenuLayerAddEvent';
import MenuEditSelectAll from './MenuEditSelectAll';
import MenuEditSelectAllArtboards from './MenuEditSelectAllArtboards';
import MenuEditCopyLayers from './MenuEditCopyLayers';
import MenuEditPasteLayers from './MenuEditPasteLayers';
import MenuEditPasteOverSelection from './MenuEditPasteOverSelection';
import MenuEditDuplicate from './MenuEditDuplicate';
import MenuEditDelete from './MenuEditDelete';
import MenuArrangeBringForward from './MenuArrangeBringForward';
import MenuArrangeSendBackward from './MenuArrangeSendBackward';
import MenuArrangeGroup from './MenuArrangeGroup';
import MenuArrangeUngroup from './MenuArrangeUngroup';
import MenuEditRename from './MenuEditRename';
import MenuLayerMaskUseAsMask from './MenuLayerMaskUseAsMask';
import MenuLayerMaskIgnoreUnderlyingMask from './MenuLayerMaskIgnoreUnderlyingMask';
import MenuLayerImageReplace from './MenuLayerImageReplace';

interface LayerContextMenuProps {
  setLayerContextMenu(layerContextMenu: any[] | null): void;
}

const LayerContextMenu = (props: LayerContextMenuProps): ReactElement => {
  const { setLayerContextMenu } = props;
  const [addEvent, setAddEvent] = useState(undefined);
  const [selectAll, setSelectAll] = useState(undefined);
  const [selectAllArtboards, setSelectAllArtboards] = useState(undefined);
  const [copyLayers, setCopyLayers] = useState(undefined);
  const [pasteLayers, setPasteLayers] = useState(undefined);
  const [pasteOverSelection, setPasteOverSelection] = useState(undefined);
  const [duplicate, setDuplicate] = useState(undefined);
  const [deleteLayers, setDeleteLayers] = useState(undefined);
  const [bringForward, setBringForward] = useState(undefined);
  const [sendBackward, setSendBackward] = useState(undefined);
  const [group, setGroup] = useState(undefined);
  const [ungroup, setUngroup] = useState(undefined);
  const [rename, setRename] = useState(undefined);
  const [useAsMask, setUseAsMask] = useState(undefined);
  const [ignoreUnderlyingMask, setIgnoreUnderlyingMask] = useState(undefined);
  const [replaceImage, setReplaceImage] = useState(undefined);

  useEffect(() => {
    if (addEvent && selectAll && selectAllArtboards && copyLayers && pasteLayers && pasteOverSelection && duplicate && deleteLayers && bringForward && sendBackward && group && ungroup && rename && useAsMask && ignoreUnderlyingMask && replaceImage) {
      setLayerContextMenu([
        addEvent,
        { type: 'separator' },
        selectAll,
        selectAllArtboards,
        copyLayers,
        pasteLayers,
        pasteOverSelection,
        duplicate,
        { type: 'separator' },
        deleteLayers,
        { type: 'separator' },
        bringForward,
        sendBackward,
        { type: 'separator' },
        group,
        ungroup,
        rename,
        { type: 'separator' },
        useAsMask,
        ignoreUnderlyingMask,
        { type: 'separator' },
        replaceImage
      ]);
    }
  }, [addEvent, selectAll, selectAllArtboards, copyLayers, pasteLayers, pasteOverSelection, duplicate, deleteLayers, bringForward, sendBackward, group, ungroup, rename, useAsMask, ignoreUnderlyingMask, replaceImage]);

  return (
    <>
      <MenuLayerAddEvent
        setAddEvent={setAddEvent} />
      <MenuEditSelectAll
        setSelectAll={setSelectAll} />
      <MenuEditSelectAllArtboards
        setSelectAllArtboards={setSelectAllArtboards} />
      <MenuEditCopyLayers
        setCopyLayers={setCopyLayers} />
      <MenuEditPasteLayers
        setPasteLayers={setPasteLayers} />
      <MenuEditPasteOverSelection
        setPasteOverSelection={setPasteOverSelection} />
      <MenuEditDuplicate
        setDuplicate={setDuplicate} />
      <MenuEditDelete
        setDeleteLayers={setDeleteLayers} />
      <MenuArrangeBringForward
        setBringForward={setBringForward} />
      <MenuArrangeSendBackward
        setSendBackward={setSendBackward} />
      <MenuArrangeGroup
        setGroup={setGroup} />
      <MenuArrangeUngroup
        setUngroup={setUngroup} />
      <MenuEditRename
        setRename={setRename} />
      <MenuLayerMaskUseAsMask
        setUseAsMask={setUseAsMask} />
      <MenuLayerMaskIgnoreUnderlyingMask
        setIgnoreUnderlyingMask={setIgnoreUnderlyingMask} />
      <MenuLayerImageReplace
        setReplace={setReplaceImage} />
    </>
  );
}

export default LayerContextMenu;