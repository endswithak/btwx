/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useContext } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerTweenPower } from '../store/actions/layer';
import { DEFAULT_EASE_CURVES } from '../constants';
import { ThemeContext } from './ThemeProvider';

gsap.registerPlugin(CustomEase);

interface ButtonProps {
  isActive?: boolean;
}

const Button = styled.button<ButtonProps>`
  background: ${props => props.isActive ? props.theme.palette.primary : props.theme.name === 'dark' ? props.theme.background.z3 : props.theme.background.z0};
  box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z4 : props.theme.background.z5};
  svg {
    stroke: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.light};
  }
  :focus {
    box-shadow: 0 0 0 1px ${props => props.theme.palette.primary} inset;
  }
  :hover {
    box-shadow: 0 0 0 1px ${props => props.theme.name === 'dark' ? props.theme.background.z5 : props.theme.background.z6};
    :focus {
      box-shadow: 0 0 0 1px ${props => props.theme.palette.primary} inset;
    }
    svg {
      stroke: ${props => props.isActive ? props.theme.text.onPrimary : props.theme.text.base};
    }
  }
`;

const EaseEditorPowerInput = (): ReactElement => {
  const theme = useContext(ThemeContext);
  const easeId = useSelector((state: RootState) => state.easeEditor.tween ? state.easeEditor.tween : null);
  const easeValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease : null);
  const powerValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].power : null);
  const dispatch = useDispatch();

  const handleClick = (power: any): void => {
    dispatch(setLayerTweenPower({id: easeId, power: power}))
  }

  return (
    <div className='c-ease-editor-body__powers'>
      {
        Object.keys((DEFAULT_EASE_CURVES as any)[easeValue]).map((key, index) => (
          <div
            key={index}
            className='c-ease-editor-body__power'>
            <Button
              theme={theme}
              isActive={key === powerValue}
              onClick={() => handleClick(key)}>
              <svg
                viewBox='0 0 64 64'
                width='64px'
                height='64px'
                style={{
                  strokeWidth: 1,
                  fill: 'none',
                  overflow: 'visible'
                }}>
                <path d={CustomEase.getSVGData((DEFAULT_EASE_CURVES as any)[easeValue][key], {width: 64, height: 64})} />
              </svg>
            </Button>
            <span style={{
              color: theme.text.light
            }}>
              { key }
            </span>
          </div>
        ))
      }
    </div>
  );
}

export default EaseEditorPowerInput;