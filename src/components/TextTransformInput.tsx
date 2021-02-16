/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { remote } from 'electron';
import { RootState } from '../store/reducers';
import { DEFAULT_TEXT_TRANSFORM_OPTIONS } from '../constants';
import { setLayersTextTransformThunk } from '../store/actions/layer';
import { getSelectedTextTransform } from '../store/selectors/layer';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const TextTransformInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const textTransformValue = useSelector((state: RootState) => getSelectedTextTransform(state));
  const [textTransform, setTextTransform] = useState(textTransformValue);
  const dispatch = useDispatch();

  // const isMac = remote.process.platform === 'darwin';

  // const getValueByIndex = (index: number): Btwx.TextTransform => {
  //   switch(index) {
  //     case 0:
  //       return 'none';
  //     case 1:
  //       return 'uppercase';
  //     case 2:
  //       return 'lowercase';
  //   }
  // }

  // const getIndexByValue = (value: Btwx.TextTransform): number => {
  //   switch(value) {
  //     case 'none':
  //       return 0;
  //     case 'uppercase':
  //       return 1;
  //     case 'lowercase':
  //       return 2;
  //   }
  // }

  // const buildTouchBar = (selectedItem: Btwx.TextTransform): void => {
  //   const { TouchBarSegmentedControl } = remote.TouchBar;
  //   const noneImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-text-transform-none.png`);
  //   const uppercaseImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-text-transform-uppercase.png`);
  //   const lowercaseImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-text-transform-lowercase.png`);
  //   const sidesSlider = new TouchBarSegmentedControl({
  //     segments: [{
  //       icon: noneImage
  //     },{
  //       icon: lowercaseImage
  //     },{
  //       icon: uppercaseImage
  //     }],
  //     mode: 'single',
  //     selectedIndex: getIndexByValue(selectedItem),
  //     change: (index): void => {
  //       const value = getValueByIndex(index);
  //       dispatch(setLayersTextTransformThunk({layers: selected, textTransform: value}));
  //       setTextTransform(value);
  //     }
  //   });
  //   const newTouchBar = new remote.TouchBar({
  //     items: [sidesSlider]
  //   });
  //   remote.getCurrentWindow().setTouchBar(newTouchBar);
  // }

  useEffect(() => {
    setTextTransform(textTransformValue);
  }, [textTransformValue, selected]);

  const handleChange = (e: any): void => {
    if (e.target.value !== textTransform) {
      dispatch(setLayersTextTransformThunk({layers: selected, textTransform: e.target.value as Btwx.TextTransform}));
      setTextTransform(e.target.value);
    }
    // if (isMac) {
    //   buildTouchBar(e.target.value);
    // }
  };

  const options = DEFAULT_TEXT_TRANSFORM_OPTIONS.map((option) => (
    <ToggleButtonGroup.Button
      key={option}
      value={option}>
      <Icon
        name={`text-transform-${option}`}
        size='small' />
    </ToggleButtonGroup.Button>
  ));

  return (
    <Form inline>
      <Form.Group controlId='control-text-transform'>
        <ToggleButtonGroup
          type='radio'
          name='text-transform'
          size='small'
          value={textTransform}
          onChange={handleChange}>
          { options }
        </ToggleButtonGroup>
        <Form.Label>
          Transform
        </Form.Label>
      </Form.Group>
    </Form>
  );
}

export default TextTransformInput;