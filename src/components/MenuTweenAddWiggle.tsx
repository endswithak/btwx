/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { getLayerDescendants } from '../store/selectors/layer';
import { addLayerTween } from '../store/actions/layer';
import { titleCase } from '../utils';
import { canToggleSelectedFillOrStroke, selectedStrokeEnabled, getDestinationEquivalent, getEquivalentTweenProps } from '../store/selectors/layer';
import {
  ARTBOARDS_PER_PROJECT, TWEEN_PROPS_MAP, DEFAULT_TWEEN_DURATION, DEFAULT_TWEEN_DELAY,
  DEFAULT_TWEEN_EASE, DEFAULT_TWEEN_POWER, DEFAULT_SCRAMBLE_TEXT_TWEEN_CHARACTERS, DEFAULT_SCRAMBLE_TEXT_TWEEN_DELIMITER,
  DEFAULT_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY, DEFAULT_SCRAMBLE_TEXT_TWEEN_SPEED, DEFAULT_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT,
  DEFAULT_CUSTOM_BOUNCE_TWEEN_END_AT_START, DEFAULT_CUSTOM_BOUNCE_TWEEN_SQUASH, DEFAULT_CUSTOM_BOUNCE_TWEEN_STRENGTH,
  DEFAULT_CUSTOM_WIGGLE_TWEEN_TYPE, DEFAULT_CUSTOM_WIGGLE_TWEEN_WIGGLES, DEFAULT_STEPS_TWEEN_STEPS, DEFAULT_ROUGH_TWEEN_CLAMP,
  DEFAULT_ROUGH_TWEEN_POINTS, DEFAULT_ROUGH_TWEEN_RANDOMIZE, DEFAULT_ROUGH_TWEEN_STRENGTH, DEFAULT_ROUGH_TWEEN_TAPER,
  DEFAULT_ROUGH_TWEEN_TEMPLATE, DEFAULT_SLOW_TWEEN_LINEAR_POWER, DEFAULT_SLOW_TWEEN_LINEAR_RATIO, DEFAULT_SLOW_TWEEN_LINEAR_YOYO_MODE,
  DEFAULT_TEXT_TWEEN_DELIMITER, DEFAULT_TEXT_TWEEN_SPEED, DEFAULT_TEXT_TWEEN_DIFF, DEFAULT_TEXT_TWEEN_SCRAMBLE, DEFAULT_ROUGH_TWEEN_REF,
  DEFAULT_SCRAMBLE_TEXT_TWEEN_CUSTOM_CHARACTERS, CUSTOM_WIGGLE_TWEEN_STRENGTH_MAP
} from '../constants';

export const MENU_ITEM_ID = 'tweenAddWiggle';

interface MenuTweenAddWiggleProps {
  setAddWiggle(addWiggle: any): void;
}

const MenuTweenAddWiggle = (props: MenuTweenAddWiggleProps): ReactElement => {
  const { setAddWiggle } = props;
  const [menuItemTemplate, setMenuItemTemplate] = useState<any>(null);
  const event = useSelector((state: RootState) => state.eventDrawer.event ? state.layer.present.events.byId[state.eventDrawer.event] : null);
  const destinationChildren = useSelector((state: RootState) => event ? getLayerDescendants(state.layer.present, event.destinationArtboard) : null);
  const tweenLayerHover = useSelector((state: RootState) => state.eventDrawer.tweenLayerHover);
  const tweenLayerHoverItem = useSelector((state: RootState) => tweenLayerHover ? state.layer.present.byId[tweenLayerHover] : null);
  const equivalentLayerItem = useSelector((state: RootState) => tweenLayerHover && destinationChildren && destinationChildren.length > 0 ? getDestinationEquivalent(state.layer.present, tweenLayerHover, destinationChildren) : null);
  const equivalentTweenProps = tweenLayerHoverItem && equivalentLayerItem ? getEquivalentTweenProps(tweenLayerHoverItem, equivalentLayerItem) : null;
  const dispatch = useDispatch();

  const getPossibleProps = () => {
    const contextProps = ['opacity'];
    const transformProps = ['rotation'];
    const strokeOptionsProps = ['strokeWidth', 'dashOffset', 'dashArrayWidth', 'dashArrayGap'];
    const fillProps = ['fill', ...(tweenLayerHoverItem.style.fill.fillType === 'gradient' ? ['fillGradientOriginX', 'fillGradientOriginY', 'fillGradientDestinationX', 'fillGradientDestinationY'] : [])];
    const strokeProps = ['stroke', ...(tweenLayerHoverItem.style.fill.fillType === 'gradient' ? ['strokeGradientOriginX', 'strokeGradientOriginY', 'strokeGradientDestinationX', 'strokeGradientDestinationY'] : [])];
    const shadowProps = ['shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'shadowBlur'];
    const textProps = ['fontSize', 'letterSpacing', 'lineHeight', 'oblique', 'text'];
    const positionProps = (() => {
      switch(tweenLayerHoverItem.type) {
        case 'Shape': {
          switch((tweenLayerHoverItem as Btwx.Shape).shapeType) {
            case 'Line':
              return ['fromX', 'fromY', 'toX', 'toY'];
            default:
              return ['x', 'y'];
          }
        }
        case 'Image': {
          return ['x', 'y'];
        }
        case 'Group':
        case 'Text': {
          return ['pointX', 'pointY'];
        }
      }
    })();
    const sizeProps = (() => {
      switch(tweenLayerHoverItem.type) {
        case 'Shape': {
          if ((tweenLayerHoverItem as Btwx.Shape).shapeType !== (equivalentLayerItem as Btwx.Shape).shapeType) {
            return ['shape'];
          } else {
            return ['width', 'height'];
          }
        }
        case 'Image': {
          return ['width', 'height'];
        }
        case 'Artboard':
        case 'Group':
        case 'Text': {
          return [];
        }
      }
    })();
    switch(tweenLayerHoverItem.type) {
      case 'Artboard':
        return [...fillProps];
      case 'Shape':
        return [...sizeProps, ...contextProps, ...transformProps, ...strokeOptionsProps, ...fillProps, ...strokeProps, ...shadowProps, ...positionProps];
      case 'Text':
        return [...contextProps, ...transformProps, ...strokeOptionsProps, ...fillProps, ...strokeProps, ...shadowProps, ...positionProps, ...textProps];
      case 'Image':
        return [...sizeProps, ...contextProps, ...transformProps, ...strokeOptionsProps, ...strokeProps, ...shadowProps, ...positionProps];
    }
  }

  const buildSubMenu = () => {
    if (tweenLayerHoverItem && equivalentLayerItem) {
      const possibleProps = getPossibleProps();
      return Object.keys(equivalentTweenProps).reduce((result, current) => {
        if (!equivalentTweenProps[current] && possibleProps.includes(current)) {
          result = [...result, {
            label: titleCase(current),
            click: {
              id: MENU_ITEM_ID,
              params: {
                layer: tweenLayerHover,
                destinationLayer: equivalentLayerItem.id,
                prop: current,
                event: event.id,
                ease: 'customWiggle',
                power: DEFAULT_TWEEN_POWER,
                duration: DEFAULT_TWEEN_DURATION,
                delay: DEFAULT_TWEEN_DELAY,
                frozen: false,
                text: {
                  delimiter: DEFAULT_TEXT_TWEEN_DELIMITER,
                  speed: DEFAULT_TEXT_TWEEN_SPEED,
                  diff: DEFAULT_TEXT_TWEEN_DIFF,
                  scramble: DEFAULT_TEXT_TWEEN_SCRAMBLE
                },
                scrambleText: {
                  characters: DEFAULT_SCRAMBLE_TEXT_TWEEN_CHARACTERS,
                  customCharacters: DEFAULT_SCRAMBLE_TEXT_TWEEN_CUSTOM_CHARACTERS,
                  revealDelay: DEFAULT_SCRAMBLE_TEXT_TWEEN_REVEAL_DELAY,
                  speed: DEFAULT_SCRAMBLE_TEXT_TWEEN_SPEED,
                  delimiter: DEFAULT_SCRAMBLE_TEXT_TWEEN_DELIMITER,
                  rightToLeft: DEFAULT_SCRAMBLE_TEXT_TWEEN_RIGHT_TO_LEFT
                },
                customBounce: {
                  strength: DEFAULT_CUSTOM_BOUNCE_TWEEN_STRENGTH,
                  endAtStart: DEFAULT_CUSTOM_BOUNCE_TWEEN_END_AT_START,
                  squash: DEFAULT_CUSTOM_BOUNCE_TWEEN_SQUASH
                },
                customWiggle: {
                  strength: CUSTOM_WIGGLE_TWEEN_STRENGTH_MAP[current],
                  wiggles: DEFAULT_CUSTOM_WIGGLE_TWEEN_WIGGLES,
                  type: DEFAULT_CUSTOM_WIGGLE_TWEEN_TYPE
                },
                steps: {
                  steps: DEFAULT_STEPS_TWEEN_STEPS
                },
                rough: {
                  clamp: DEFAULT_ROUGH_TWEEN_CLAMP,
                  points: DEFAULT_ROUGH_TWEEN_POINTS,
                  randomize: DEFAULT_ROUGH_TWEEN_RANDOMIZE,
                  strength: DEFAULT_ROUGH_TWEEN_STRENGTH,
                  taper: DEFAULT_ROUGH_TWEEN_TAPER,
                  template: DEFAULT_ROUGH_TWEEN_TEMPLATE,
                  ref: DEFAULT_ROUGH_TWEEN_REF
                },
                slow: {
                  linearRatio: DEFAULT_SLOW_TWEEN_LINEAR_RATIO,
                  power: DEFAULT_SLOW_TWEEN_LINEAR_POWER,
                  yoyoMode: DEFAULT_SLOW_TWEEN_LINEAR_YOYO_MODE
                }
              }
            }
          }];
        }
        return result;
      }, []);
    } else {
      return [];
    }
  }

  useEffect(() => {
    setMenuItemTemplate({
      label: 'Add Wiggle...',
      submenu: buildSubMenu()
    });
    (window as any)[MENU_ITEM_ID] = (params: any) => {
      dispatch(addLayerTween(params));
    }
  }, []);

  useEffect(() => {
    if (menuItemTemplate) {
      setMenuItemTemplate({
        ...menuItemTemplate,
        submenu: buildSubMenu()
      });
    }
  }, [tweenLayerHover, equivalentTweenProps]);

  useEffect(() => {
    if (menuItemTemplate) {
      setAddWiggle(menuItemTemplate);
    }
  }, [menuItemTemplate]);

  return null;
}

export default MenuTweenAddWiggle;