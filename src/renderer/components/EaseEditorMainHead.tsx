import React, { ReactElement } from 'react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase, SlowMo } from 'gsap/EasePack';
import { CustomBounce } from 'gsap/CustomBounce';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { closeEaseEditor } from '../store/actions/easeEditor';
import { allTextTweensSelected, getSelectedTextTweensScramble, getSelectedTweensEase, getSelectedTweensPower } from '../store/selectors/layer';
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
  const allTextTweens = useSelector((state: RootState) => allTextTweensSelected(state));
  const allScrambleTextTweens = useSelector((state: RootState) => {
    const scramble = getSelectedTextTweensScramble(state);
    return scramble && scramble !== 'multi';
  });
  const easeValue = useSelector((state: RootState) => getSelectedTweensEase(state));
  const powerValue = useSelector((state: RootState) => getSelectedTweensPower(state));
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    setTab(e.target.value);
  }

  const getEaseIcon = () => {
    if (easeValue === 'multi') {
      return `ease-power1-out`;
    } else {
      return `ease-${easeValue}-${(easeValue !== 'customWiggle' && easeValue !== 'customBounce' && easeValue !== 'steps' && easeValue !== 'slow' && easeValue !== 'rough') ? powerValue !== 'multi' ? powerValue : 'out' : 'out'}`;
    }
  }

  return (
    <div className='c-ease-editor-main__section c-ease-editor-main__section--head'>
      <div className='c-ease-editor__tabs'>
        {
          allTextTweens
          ? <ToggleButtonGroup
              type='radio'
              name='ease-editor-tab'
              value={tab}
              size='large'
              onChange={handleChange}>
              <ToggleButtonGroup.Button value='ease'>
                <Icon
                  name={getEaseIcon()} />
              </ToggleButtonGroup.Button>
              <ToggleButtonGroup.Button value='text'>
                <Icon
                  name={allScrambleTextTweens ? 'scramble-text' : 'text'} />
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