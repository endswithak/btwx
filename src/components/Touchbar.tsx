/* eslint-disable @typescript-eslint/no-use-before-define */
import { remote } from 'electron';
import sharp from 'sharp';
import tinyColor from 'tinycolor2';
import debounce from 'lodash.debounce';
import React, { ReactElement, useEffect, useState, useContext, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { toggleArtboardToolThunk } from '../store/actions/artboardTool';
import { toggleShapeToolThunk } from '../store/actions/shapeTool';
import { toggleTextToolThunk } from '../store/actions/textTool';
import { addImageThunk, groupSelectedThunk, ungroupSelectedThunk } from '../store/actions/layer';
import { zoomInThunk } from '../store/actions/zoomTool';
import { zoomOutThunk } from '../store/actions/zoomTool';
import { alignSelectedToLeftThunk, alignSelectedToCenterThunk, alignSelectedToRightThunk, alignSelectedToTopThunk, alignSelectedToMiddleThunk, alignSelectedToBottomThunk, distributeSelectedHorizontallyThunk, distributeSelectedVerticallyThunk, sendSelectedBackwardThunk, bringSelectedForwardThunk, setLayersFillColor, setLayersStrokeColor, setLayersShadowColor, setLayersGradientStopColor } from '../store/actions/layer';
import { getSelectedLeft, getSelectedCenter, getSelectedRight, getSelectedTop, getSelectedMiddle, getSelectedBottom, canSendSelectedBackward, canBringSelectedForward, canGroupSelected, canUngroupSelected, getSelectedFillHex, getSelectedStrokeHex, getSelectedShadowHex } from '../store/selectors/layer';
import { ThemeContext } from './ThemeProvider';

const Touchbar = (): ReactElement => {
  const { TouchBarButton, TouchBarGroup, TouchBarColorPicker, TouchBarSpacer } = remote.TouchBar;
  // const themeContext = useContext(ThemeContext);
  // const [menuType, setTouchbarType] = useState(null);
  const focusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  // zoom
  const canZoomOut = useSelector((state: RootState) => state.documentSettings.zoom !== 0.01);
  // insert
  const isArtboardToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Artboard');
  const isShapeToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape');
  const isRectangleToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Rectangle');
  const isEllipseToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Shape' && state.shapeTool.shapeType === 'Ellipse');
  const isTextToolActive = useSelector((state: RootState) => state.canvasSettings.activeTool === 'Text');
  const hasActiveArtboard: boolean = useSelector((state: RootState) => state.layer.present.activeArtboard !== null);
  // align distribute
  const canAlignLeft = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedLeft(state) === 'multi'));
  const canAlignCenter = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedCenter(state) === 'multi'));
  const canAlignRight = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedRight(state) === 'multi'));
  const canAlignTop = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedTop(state) === 'multi'));
  const canAlignMiddle = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedMiddle(state) === 'multi'));
  const canAlignBottom = useSelector((state: RootState) => state.canvasSettings.focusing && (state.layer.present.selected.length >= 2 && getSelectedBottom(state) === 'multi'));
  const canDistribute = useSelector((state: RootState) => state.canvasSettings.focusing && state.layer.present.selected.length >= 3);
  // move
  const canMoveBackward = useSelector((state: RootState) => canSendSelectedBackward(state));
  const canMoveForward = useSelector((state: RootState) => canBringSelectedForward(state));
  // group
  const canGroup = useSelector((state: RootState) => canGroupSelected(state) && state.canvasSettings.focusing);
  const canUngroup = useSelector((state: RootState) => canUngroupSelected(state));
  //
  const theme = useSelector((state: RootState) => state.preferences.theme);
  const dispatch = useDispatch();

  const isMac = remote.process.platform === 'darwin';

  const activeBG = '#777';

  const buildInsertGroup = () => {
    // images
    const artboardImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-artboard.png`);
    const rectangleImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-square.png`);
    const ellipseImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-ellipse.png`);
    const textImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-text.png`);
    const imageImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-image-${theme}.png`);
    // artboard
    const artboardButton = new TouchBarButton({
      icon: artboardImage,
      accessibilityLabel: 'Artboard',
      backgroundColor: isArtboardToolActive ? activeBG : null,
      click: () => dispatch(toggleArtboardToolThunk())
    });
    // rect
    const rectangleButton = hasActiveArtboard ? [new TouchBarButton({
      icon: rectangleImage,
      accessibilityLabel: 'Rectangle',
      backgroundColor: isRectangleToolActive ? activeBG : null,
      click: () => dispatch(toggleShapeToolThunk('Rectangle'))
    })] : [];
    // ellipse
    const ellipseButton = hasActiveArtboard ? [new TouchBarButton({
      icon: ellipseImage,
      accessibilityLabel: 'Ellipse',
      backgroundColor: isEllipseToolActive ? activeBG : null,
      click: () => dispatch(toggleShapeToolThunk('Ellipse'))
    })] : [];
    // text
    const textButton = hasActiveArtboard ? [new TouchBarButton({
      icon: textImage,
      accessibilityLabel: 'Text',
      backgroundColor: isTextToolActive ? activeBG : null,
      click: () => dispatch(toggleTextToolThunk())
    })] : [];
    // image
    const imageButton = hasActiveArtboard ? [new TouchBarButton({
      icon: imageImage,
      accessibilityLabel: 'Image',
      click: () => {
        remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
          filters: [
            { name: 'Images', extensions: ['jpg', 'png'] }
          ],
          properties: ['openFile']
        }).then(result => {
          if (result.filePaths.length > 0 && !result.canceled) {
            sharp(result.filePaths[0]).toBuffer({ resolveWithObject: true }).then(({ data, info }) => {
              dispatch(addImageThunk({
                layer: {
                  frame: {
                    x: 0,
                    y: 0,
                    width: info.width,
                    height: info.height,
                    innerWidth: info.width,
                    innerHeight: info.height
                  },
                  originalDimensions: {
                    width: info.width,
                    height: info.height
                  }
                },
                buffer: data
              }));
            });
          }
        });
      }
    })] : [];
    // touchbar
    const insertTouchBar = new remote.TouchBar({
      items: [
        artboardButton,
        ...rectangleButton,
        ...ellipseButton,
        ...textButton,
        ...imageButton
      ]
    });
    // group
    return new TouchBarGroup({
      items: insertTouchBar
    });
  }

  const buildDistributeGroup = () => {
    // images
    const distributeHorizontallyImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-distribute-horizontally.png`);
    const distributeVerticallyImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-distribute-vertically.png`);
    // distribute horizontally
    const distributeHorizontallyButton = canDistribute ? [new TouchBarButton({
      icon: distributeHorizontallyImage,
      accessibilityLabel: 'Distribute Horizontally',
      click: () => dispatch(distributeSelectedHorizontallyThunk())
    })] : [];
    // distribute vertically
    const distributeVerticallyButton = canDistribute ? [new TouchBarButton({
      icon: distributeVerticallyImage,
      accessibilityLabel: 'Distribute Vertically',
      click: () => dispatch(distributeSelectedVerticallyThunk())
    })] : [];
    // touchbar
    const insertTouchBar = new remote.TouchBar({
      items: [...distributeHorizontallyButton, ...distributeVerticallyButton]
    });
    // group
    return canDistribute ? [new TouchBarGroup({
      items: insertTouchBar
    })] : [];
  }

  const buildMoveGroup = () => {
    // images
    const moveForwardImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-move-forward.png`);
    const moveBackwardImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-move-backward.png`);
    // forward
    const moveForwardButton = canMoveForward ? [new TouchBarButton({
      icon: moveForwardImage,
      accessibilityLabel: 'Bring Forward',
      click: () => dispatch(bringSelectedForwardThunk())
    })] : [];
    // backward
    const moveBackwardButton = canMoveBackward ? [new TouchBarButton({
      icon: moveBackwardImage,
      accessibilityLabel: 'Send Backward',
      click: () => dispatch(sendSelectedBackwardThunk())
    })] : [];
    // touchbar
    const moveTouchBar = new remote.TouchBar({
      items: [...moveForwardButton, ...moveBackwardButton]
    });
    // group
    return canMoveForward || canMoveBackward ? [new TouchBarGroup({
      items: moveTouchBar
    })] : [];
  }

  const buildGroupGroup = () => {
    // images
    const groupImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-group.png`);
    const ungroupImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-ungroup.png`);
    // group
    const groupButton = canGroup ? [new TouchBarButton({
      icon: groupImage,
      accessibilityLabel: 'Group',
      click: () => dispatch(groupSelectedThunk())
    })] : [];
    // ungroup
    const ungroupButton = canUngroup ? [new TouchBarButton({
      icon: ungroupImage,
      accessibilityLabel: 'Ungroup',
      click: () => dispatch(ungroupSelectedThunk())
    })] : [];
    // touchbar
    const groupTouchBar = new remote.TouchBar({
      items: [...groupButton, ...ungroupButton]
    });
    // group
    return canGroup || canUngroup ? [new TouchBarGroup({
      items: groupTouchBar
    })] : [];
  }

  const buildAlignGroup = () => {
    // images
    const alignLeftImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-left.png`);
    const alignCenterImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-center.png`);
    const alignRightImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-right.png`);
    const alignTopImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-top.png`);
    const alignMiddleImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-middle.png`);
    const alignBottomImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-bottom.png`);
    // left
    const alignLeftButton = canAlignLeft ? [new TouchBarButton({
      icon: alignLeftImage,
      accessibilityLabel: 'Align Left',
      click: () => dispatch(alignSelectedToLeftThunk())
    })] : [];
    // center
    const alignCenterButton = canAlignCenter ? [new TouchBarButton({
      icon: alignCenterImage,
      accessibilityLabel: 'Align Center',
      click: () => dispatch(alignSelectedToCenterThunk())
    })] : [];
    // right
    const alignRightButton = canAlignRight ? [new TouchBarButton({
      icon: alignRightImage,
      accessibilityLabel: 'Align Right',
      click: () => dispatch(alignSelectedToRightThunk())
    })] : [];
    // top
    const alignTopButton = canAlignTop ? [new TouchBarButton({
      icon: alignTopImage,
      accessibilityLabel: 'Align Top',
      click: () => dispatch(alignSelectedToTopThunk())
    })] : [];
    // middle
    const alignMiddleButton = canAlignMiddle ? [new TouchBarButton({
      icon: alignMiddleImage,
      accessibilityLabel: 'Align Middle',
      click: () => dispatch(alignSelectedToMiddleThunk())
    })] : [];
    // bottom
    const alignBottomButton = canAlignBottom ? [new TouchBarButton({
      icon: alignBottomImage,
      accessibilityLabel: 'Align Bottom',
      click: () => dispatch(alignSelectedToBottomThunk())
    })] : [];
    // touchbar
    const insertTouchBar = new remote.TouchBar({
      items: [
        ...alignLeftButton, ...alignCenterButton, ...alignRightButton,
        ...alignTopButton, ...alignMiddleButton, ...alignBottomButton
      ]
    });
    // group
    return canAlignLeft || canAlignCenter || canAlignRight || canAlignTop || canAlignMiddle || canAlignBottom ? [new TouchBarGroup({
      items: insertTouchBar
    })] : [];
  }

  const buildZoomGroup = () => {
    // images
    const zoomOutImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-zoom-out.png`);
    const zoomInImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-zoom-in.png`);
    // zoom out
    const zoomOutButton = canZoomOut ? [new TouchBarButton({
      icon: zoomOutImage,
      accessibilityLabel: 'Zoom Out',
      click: () => dispatch(zoomOutThunk())
    })] : [];
    // zoom in
    const zoomInButton = new TouchBarButton({
      icon: zoomInImage,
      accessibilityLabel: 'Zoom In',
      click: () => dispatch(zoomInThunk())
    });
    // touchbar
    const zoomTouchBar = new remote.TouchBar({
      items: [...zoomOutButton, zoomInButton]
    });
    // group
    return new TouchBarGroup({
      items: zoomTouchBar
    });
  }

  const buildEmptySelectionTouchBar = () => {
    remote.getCurrentWindow().setTouchBar(
      new remote.TouchBar({
        items: [
          buildInsertGroup(),
          new TouchBarSpacer({size: 'large'}),
          buildZoomGroup()
        ]
      })
    );
  }

  const buildSelectionTouchBar = () => {
    const alignTouchBar = buildAlignGroup();
    const distributeTouchBar = buildDistributeGroup();
    const groupTouchBar = buildGroupGroup();
    const moveTouchBar = buildMoveGroup();
    remote.getCurrentWindow().setTouchBar(
      new remote.TouchBar({
        items: [
          ...distributeTouchBar,
          ...alignTouchBar,
          ...groupTouchBar,
          ...moveTouchBar
        ]
      })
    );
  }

  useEffect(() => {
    if (isMac && focusing && selected.length === 0) {
      buildEmptySelectionTouchBar();
    }
  }, [selected, focusing, isArtboardToolActive, theme, hasActiveArtboard, isRectangleToolActive, isEllipseToolActive, isShapeToolActive, isTextToolActive]);

  useEffect(() => {
    if (isMac && focusing && selected.length >= 1) {
      buildSelectionTouchBar();
    }
  }, [selected, canAlignLeft, canAlignCenter, canAlignRight, canAlignTop, canAlignMiddle, canAlignBottom, canDistribute, canGroupSelected, canUngroupSelected, canBringSelectedForward, canSendSelectedBackward]);

  return (
    <></>
  )
}

export default Touchbar;