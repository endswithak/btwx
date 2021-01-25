import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { RoughEase } from 'gsap/EasePack';
import { RootState } from '../store/reducers';
import { setLayerRoughTweenTemplate } from '../store/actions/layer';
import SidebarInput from './SidebarInput';

gsap.registerPlugin(CustomEase, RoughEase);

interface EaseEditorRoughTemplateInputProps {
  setParamInfo(paramInfo: Btwx.ParamInfo): void;
}

const EaseEditorRoughTemplateInput = (props: EaseEditorRoughTemplateInputProps): ReactElement => {
  const { setParamInfo } = props;
  const id = useSelector((state: RootState) => state.easeEditor.tween);
  const templateValue = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough.template : null);
  const disabled = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].ease !== 'rough' : true);
  const roughTween = useSelector((state: RootState) => state.easeEditor.tween ? state.layer.present.tweens.byId[state.easeEditor.tween].rough : null);
  const [template, setTemplate] = useState(templateValue);
  const dispatch = useDispatch();

  const handleTemplateChange = (e: any): void => {
    const target = e.target;
    setTemplate(target.value);
  };

  const handleTemplateSubmit = (e: any): void => {
    let newTemplate = template;
    if (newTemplate.length === 0) {
      newTemplate = 'none';
    }
    if (newTemplate !== templateValue) {
      try {
        const ref = CustomEase.getSVGData(`rough({clamp: ${roughTween.clamp}, points: ${roughTween.points}, randomize: ${roughTween.randomize}, strength: ${roughTween.strength}, taper: ${roughTween.taper}, template: ${newTemplate}})`, {width: 400, height: 400});
        CustomEase.getSVGData(newTemplate, {width: 100, height: 100});
        dispatch(setLayerRoughTweenTemplate({id: id, template: newTemplate, ref: ref}));
        setTemplate(newTemplate);
      } catch(error) {
        setTemplate(templateValue);
      }
    }
  }

  const handleFocus = (): void => {
    setParamInfo({
      type: 'String',
      description: 'An ease that should be used as a template, like a general guide. The RoughEase will plot points that wander from that template. You can use this to influence the general shape of the RoughEase.'
    });
  }

  const handleBlur = (): void => {
    setParamInfo(null);
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
      onChange={handleTemplateChange}
      onSubmit={handleTemplateSubmit}
      submitOnBlur
      manualCanvasFocus
      bottomLabel='Template' />
  );
}

export default EaseEditorRoughTemplateInput;