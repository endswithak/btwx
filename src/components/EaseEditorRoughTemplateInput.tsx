import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RootState } from '../store/reducers';
import { setLayerRoughTweenTemplate } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

gsap.registerPlugin(CustomEase);

interface EaseEditorRoughTemplateInputProps {
  setInputInfo(inputInfo: { type: string; description: string }): void;
}

const EaseEditorRoughTemplateInput = (props: EaseEditorRoughTemplateInputProps): ReactElement => {
  const { setInputInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const templateValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough.template : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'rough' : true);
  const [template, setTemplate] = useState(templateValue);
  const dispatch = useDispatch();

  const handleStrengthChange = (e: any): void => {
    const target = e.target;
    setTemplate(target.value);
  };

  const handleStrengthSubmit = (e: any): void => {
    if (e.target.value !== 'none') {
      try {
        CustomEase.getSVGData(template, {width: 100, height: 100});
        dispatch(setLayerRoughTweenTemplate({id: id, template: template}));
        setTemplate(template);
      } catch(error) {
        setTemplate(templateValue);
      }
    }
  }

  const handleFocus = () => {
    setInputInfo({
      type: 'String',
      description: 'An ease that should be used as a template, like a general guide. The RoughEase will plot points that wander from that template. You can use this to influence the general shape of the RoughEase.'
    });
  }

  const handleBlur = () => {
    setInputInfo(null);
  }

  useEffect(() => {
    setTemplate(templateValue);
  }, [templateValue]);

  return (
    <SidebarInput
      value={template}
      disabled={disabled}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleStrengthChange}
      onSubmit={handleStrengthSubmit}
      submitOnBlur
      bottomLabel='Template' />
  );
}

export default EaseEditorRoughTemplateInput;