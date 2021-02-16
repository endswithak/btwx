import React, { ReactElement } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase, SlowMo } from 'gsap/EasePack';
import { CustomBounce } from 'gsap/CustomBounce';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { closeEaseEditor } from '../store/actions/easeEditor';
import Icon from './Icon';
import Button from './Button';
import ToggleButtonGroup from './ToggleButtonGroup';

gsap.registerPlugin(CustomEase, RoughEase, SlowMo, CustomBounce);

interface EaseEditorMainHeadProps {
  tab: Btwx.EaseEditorTab;
  setTab(tab: Btwx.EaseEditorTab): void;
}

const EaseEditorMainHead = (props: EaseEditorMainHeadProps): ReactElement => {
  const { tab, setTab } = props;
  const isTextTween = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].prop === 'text' : null);
  const isScrambleTextTween = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].prop === 'text' && state.layer.present.tweens.byId[state.easeEditor.tween].text.scramble : null);
  const easeValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease : null);
  const powerValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].power : null);
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    setTab(e.target.value);
  }

  return (
    <div className='c-ease-editor-main__section c-ease-editor-main__section--head'>
      <div className='c-ease-editor__tabs'>
        {
          isTextTween
          ? <ToggleButtonGroup
              type='radio'
              name='ease-editor-tab'
              value={tab}
              size='large'
              onChange={handleChange}>
              <ToggleButtonGroup.Button value='ease'>
                <Icon
                  name={`ease-${easeValue}-${easeValue !== 'customBounce' && easeValue !== 'steps' && easeValue !== 'slow' && easeValue !== 'rough' ? powerValue : 'out'}`} />
              </ToggleButtonGroup.Button>
              <ToggleButtonGroup.Button value='text'>
                <Icon
                  name={isScrambleTextTween ? 'scramble-text' : 'text'} />
              </ToggleButtonGroup.Button>
            </ToggleButtonGroup>
          : null
        }
      </div>
      <Button
        onClick={() => dispatch(closeEaseEditor())}
        size='large'>
        <Icon
          name='close' />
      </Button>
    </div>
  );
}

export default EaseEditorMainHead;