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
  const { TouchBarButton, TouchBarGroup, TouchBarColorPicker } = remote.TouchBar;
  const themeContext = useContext(ThemeContext);
  const [menuType, setTouchbarType] = useState(null);
  const focusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  // color editor
  const colorEditor = useSelector((state: RootState) => state.colorEditor);
  const colorEditorHexValue: string | 'multi' = useSelector((state: RootState) => {
    if (state.colorEditor.isOpen) {
      switch(state.colorEditor.prop) {
        case 'fill':
          return getSelectedFillHex(state);
        case 'stroke':
          return getSelectedStrokeHex(state);
        case 'shadow':
          return getSelectedShadowHex(state);
      }
    } else {
      return null;
    }
  });
  const debounceColorEditorChange = useCallback(
    debounce(({layers, color, prop}: { layers: any[]; color: any; prop: any }) => {
      const c = tinyColor(color);
      const hsl = c.toHsl();
      const hsv = c.toHsv();
      switch(prop) {
        case 'fill':
          dispatch(setLayersFillColor({layers: layers, fillColor: {
            h: hsl.h,
            s: hsl.s,
            l: hsl.l,
            v: hsv.v
          }}));
          break;
        case 'stroke':
          dispatch(setLayersStrokeColor({layers: layers, strokeColor: {
            h: hsl.h,
            s: hsl.s,
            l: hsl.l,
            v: hsv.v
          }}));
          break;
        case 'shadow':
          dispatch(setLayersShadowColor({layers: layers, shadowColor: {
            h: hsl.h,
            s: hsl.s,
            l: hsl.l,
            v: hsv.v
          }}));
          break;
      }
    }, 150),
    []
  );
  const debounceGradientEditorChange = useCallback(
    debounce(({layers, color, prop, stopIndex}: { layers: any[]; color: any; prop: any; stopIndex: any }) => {
      const c = tinyColor(color);
      const hsl = c.toHsl();
      const hsv = c.toHsv();
      dispatch(setLayersGradientStopColor({
        layers: layers,
        stopIndex: stopIndex,
        prop: prop,
        color: {
          h: hsl.h,
          s: hsl.s,
          l: hsl.l,
          v: hsv.v
        }
      }));
    }, 150),
    []
  );
  const gradientEditor = useSelector((state: RootState) => state.gradientEditor);
  const gradientValue = useSelector((state: RootState) => state.gradientEditor.isOpen ? state.layer.present.byId[state.layer.present.selected[0]].style[state.gradientEditor.prop].gradient : null);
  const activeStopIndex = useSelector((state: RootState) => state.gradientEditor.isOpen ? state.layer.present.byId[state.layer.present.selected[0]].style[state.gradientEditor.prop].gradient.activeStopIndex : null);
  const activeStopValue = useSelector((state: RootState) => state.gradientEditor.isOpen ? state.layer.present.byId[state.layer.present.selected[0]].style[state.gradientEditor.prop].gradient.stops.find((stop, index) => index === gradientValue.activeStopIndex) : null);
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
  // fill
  const fill = useSelector((state: RootState) => getSelectedFillHex(state));
  //
  const theme = useSelector((state: RootState) => state.viewSettings.theme);
  const dispatch = useDispatch();

  const isMac = remote.process.platform === 'darwin';

  const activeBG = themeContext.palette.primary;

  const buildInsertGroup = () => {
    const artboardImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-artboard.png`);
    const artboardButton = new TouchBarButton({
      icon: artboardImage,
      accessibilityLabel: 'Artboard',
      backgroundColor: isArtboardToolActive ? activeBG : null,
      click: () => dispatch(toggleArtboardToolThunk())
    });
    const rectangleImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-square.png`);
    const rectangleButton = hasActiveArtboard ? [new TouchBarButton({
      icon: rectangleImage,
      accessibilityLabel: 'Rectangle',
      backgroundColor: isRectangleToolActive ? activeBG : null,
      click: () => dispatch(toggleShapeToolThunk('Rectangle'))
    })] : [];
    const ellipseImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-ellipse.png`);
    const ellipseButton = hasActiveArtboard ? [new TouchBarButton({
      icon: ellipseImage,
      accessibilityLabel: 'Ellipse',
      backgroundColor: isEllipseToolActive ? activeBG : null,
      click: () => dispatch(toggleShapeToolThunk('Ellipse'))
    })] : [];
    const textImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-text.png`);
    const textButton = hasActiveArtboard ? [new TouchBarButton({
      icon: textImage,
      accessibilityLabel: 'Text',
      backgroundColor: isTextToolActive ? activeBG : null,
      click: () => dispatch(toggleTextToolThunk())
    })] : [];
    const imageImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-image-${theme}.png`);
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
    const insertTouchBar = new remote.TouchBar({
      items: [
        artboardButton,
        ...rectangleButton,
        ...ellipseButton,
        ...textButton,
        ...imageButton
      ]
    });
    return new TouchBarGroup({
      items: insertTouchBar
    });
  }

  const buildDistributeGroup = () => {
    // distribute horizontally
    const distributeHorizontallyImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-distribute-horizontally.png`);
    const distributeHorizontallyButton = canDistribute ? [new TouchBarButton({
      icon: distributeHorizontallyImage,
      accessibilityLabel: 'Distribute Horizontally',
      click: () => dispatch(distributeSelectedHorizontallyThunk())
    })] : [];
    // distribute vertically
    const distributeVerticallyImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-distribute-vertically.png`);
    const distributeVerticallyButton = canDistribute ? [new TouchBarButton({
      icon: distributeVerticallyImage,
      accessibilityLabel: 'Distribute Vertically',
      click: () => dispatch(distributeSelectedVerticallyThunk())
    })] : [];
    const insertTouchBar = new remote.TouchBar({
      items: [...distributeHorizontallyButton, ...distributeVerticallyButton]
    });
    return canDistribute ? [new TouchBarGroup({
      items: insertTouchBar
    })] : [];
  }

  const buildMoveGroup = () => {
    // forward
    const moveForwardImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-move-forward.png`);
    const moveForwardButton = canMoveForward ? [new TouchBarButton({
      icon: moveForwardImage,
      accessibilityLabel: 'Bring Forward',
      click: () => dispatch(bringSelectedForwardThunk())
    })] : [];
    // backward
    const moveBackwardImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-move-backward.png`);
    const moveBackwardButton = canMoveBackward ? [new TouchBarButton({
      icon: moveBackwardImage,
      accessibilityLabel: 'Send Backward',
      click: () => dispatch(sendSelectedBackwardThunk())
    })] : [];
    const moveTouchBar = new remote.TouchBar({
      items: [...moveForwardButton, ...moveBackwardButton]
    });
    return canMoveForward || canMoveBackward ? [new TouchBarGroup({
      items: moveTouchBar
    })] : [];
  }

  const buildGroupGroup = () => {
    // group
    const groupImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-group.png`);
    const groupButton = canGroup ? [new TouchBarButton({
      icon: groupImage,
      accessibilityLabel: 'Group',
      click: () => dispatch(groupSelectedThunk())
    })] : [];
    // ungroup
    const ungroupImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-ungroup.png`);
    const ungroupButton = canUngroup ? [new TouchBarButton({
      icon: ungroupImage,
      accessibilityLabel: 'Ungroup',
      click: () => dispatch(ungroupSelectedThunk())
    })] : [];
    const groupTouchBar = new remote.TouchBar({
      items: [...groupButton, ...ungroupButton]
    });
    return canGroup || canUngroup ? [new TouchBarGroup({
      items: groupTouchBar
    })] : [];
  }

  const buildAlignGroup = () => {
    // left
    const alignLeftImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-left.png`);
    const alignLeftButton = canAlignLeft ? [new TouchBarButton({
      icon: alignLeftImage,
      accessibilityLabel: 'Align Left',
      click: () => dispatch(alignSelectedToLeftThunk())
    })] : [];
    // center
    const alignCenterImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-center.png`);
    const alignCenterButton = canAlignCenter ? [new TouchBarButton({
      icon: alignCenterImage,
      accessibilityLabel: 'Align Center',
      click: () => dispatch(alignSelectedToCenterThunk())
    })] : [];
    // right
    const alignRightImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-right.png`);
    const alignRightButton = canAlignRight ? [new TouchBarButton({
      icon: alignRightImage,
      accessibilityLabel: 'Align Right',
      click: () => dispatch(alignSelectedToRightThunk())
    })] : [];
    // top
    const alignTopImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-top.png`);
    const alignTopButton = canAlignTop ? [new TouchBarButton({
      icon: alignTopImage,
      accessibilityLabel: 'Align Top',
      click: () => dispatch(alignSelectedToTopThunk())
    })] : [];
    // middle
    const alignMiddleImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-middle.png`);
    const alignMiddleButton = canAlignMiddle ? [new TouchBarButton({
      icon: alignMiddleImage,
      accessibilityLabel: 'Align Middle',
      click: () => dispatch(alignSelectedToMiddleThunk())
    })] : [];
    // bottom
    const alignBottomImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-align-bottom.png`);
    const alignBottomButton = canAlignBottom ? [new TouchBarButton({
      icon: alignBottomImage,
      accessibilityLabel: 'Align Bottom',
      click: () => dispatch(alignSelectedToBottomThunk())
    })] : [];
    const insertTouchBar = new remote.TouchBar({
      items: [
        ...alignLeftButton, ...alignCenterButton, ...alignRightButton,
        ...alignTopButton, ...alignMiddleButton, ...alignBottomButton
      ]
    });
    return canAlignLeft || canAlignCenter || canAlignRight || canAlignTop || canAlignMiddle || canAlignBottom ? [new TouchBarGroup({
      items: insertTouchBar
    })] : [];
  }

  const buildZoomGroup = () => {
    const zoomOutImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-zoom-out.png`);
    const zoomOutButton = canZoomOut ? [new TouchBarButton({
      icon: zoomOutImage,
      accessibilityLabel: 'Zoom Out',
      click: () => dispatch(zoomOutThunk())
    })] : [];
    const zoomInImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-zoom-in.png`);
    const zoomInButton = new TouchBarButton({
      icon: zoomInImage,
      accessibilityLabel: 'Zoom In',
      click: () => dispatch(zoomInThunk())
    });
    const zoomTouchBar = new remote.TouchBar({
      items: [...zoomOutButton, zoomInButton]
    });
    return new TouchBarGroup({
      items: zoomTouchBar
    });
  }

  const buildEmptySelectionTouchBar = () => {
    remote.getCurrentWindow().setTouchBar(
      new remote.TouchBar({
        items: [buildInsertGroup(), buildZoomGroup()]
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
        items: [...distributeTouchBar, ...alignTouchBar, ...groupTouchBar, ...moveTouchBar]
      })
    );
  }

  const buildColorPickerTouchBar = () => {
    const colorPicker = new TouchBarColorPicker({
      selectedColor: colorEditorHexValue !== 'multi' ? `#${colorEditorHexValue}` : null,
      change: (color) => {
        debounceColorEditorChange({layers: selected, color: color, prop: colorEditor.prop});
      }
    });
    const colorEditorTouchBar = new remote.TouchBar({
      items: [colorPicker]
    });
    remote.getCurrentWindow().setTouchBar(colorEditorTouchBar);
  }

  const buildGradientColorPickerTouchBar = () => {
    const colorPicker = new TouchBarColorPicker({
      selectedColor: activeStopValue ? tinyColor({h: activeStopValue.color.h, s: activeStopValue.color.s, l: activeStopValue.color.l, v: activeStopValue.color.v, a: activeStopValue.color.a}).toHexString() : null,
      change: (color) => {
        debounceGradientEditorChange({layers: selected, color: color, prop: gradientEditor.prop, stopIndex: activeStopIndex});
      }
    });
    const gradientEditorTouchBar = new remote.TouchBar({
      items: [colorPicker]
    });
    remote.getCurrentWindow().setTouchBar(gradientEditorTouchBar);
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

  useEffect(() => {
    if (isMac && focusing && colorEditor.isOpen) {
      buildColorPickerTouchBar();
    } else {
      if (selected.length === 0) {
        buildEmptySelectionTouchBar();
      } else {
        buildEmptySelectionTouchBar();
      }
    }
  }, [colorEditor.isOpen]);

  useEffect(() => {
    if (isMac && focusing && gradientEditor.isOpen) {
      buildGradientColorPickerTouchBar();
    } else {
      if (selected.length === 0) {
        buildEmptySelectionTouchBar();
      } else {
        buildEmptySelectionTouchBar();
      }
    }
  }, [gradientEditor.isOpen, activeStopIndex]);

  return (
    <></>
  )
}

export default Touchbar;