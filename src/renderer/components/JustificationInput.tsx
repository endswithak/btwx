/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayersJustificationThunk } from '../store/actions/layer';
import { getSelectedJustification } from '../store/selectors/layer';
import { setTextSettingsJustification } from '../store/actions/textSettings';
import { DEFAULT_JUSTIFICATION_OPTIONS } from '../constants';
import Form from './Form';
import ToggleButtonGroup from './ToggleButtonGroup';
import Icon from './Icon';

const JustificationInput = (): ReactElement => {
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const justificationValue = useSelector((state: RootState) => getSelectedJustification(state));
  const [justification, setJustification] = useState(justificationValue);
  const dispatch = useDispatch();

  // const isMac = remote.process.platform === 'darwin';

  // const getValueByIndex = (index: number): Btwx.Jusftification => {
  //   switch(index) {
  //     case 0:
  //       return 'left';
  //     case 1:
  //       return 'center';
  //     case 2:
  //       return 'right';
  //   }
  // }

  // const getIndexByValue = (value: Btwx.Jusftification): number => {
  //   switch(value) {
  //     case 'left':
  //       return 0;
  //     case 'center':
  //       return 1;
  //     case 'right':
  //       return 2;
  //   }
  // }

  // const buildTouchBar = (selectedItem: Btwx.Jusftification): void => {
  //   const { TouchBarSegmentedControl } = remote.TouchBar;
  //   const leftImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-justification-left.png`);
  //   const centerImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-justification-center.png`);
  //   const rightImage = remote.nativeImage.createFromPath(`${remote.app.getAppPath()}/src/assets/tb-justification-right.png`);
  //   const sidesSlider = new TouchBarSegmentedControl({
  //     segments: [{
  //       icon: leftImage
  //     },{
  //       icon: centerImage
  //     },{
  //       icon: rightImage
  //     }],
  //     mode: 'single',
  //     selectedIndex: getIndexByValue(selectedItem),
  //     change: (index): void => {
  //       const value = getValueByIndex(index);
  //       dispatch(setLayersJustification({layers: selected, justification: value}));
  //       setJustification(value);
  //       dispatch(setTextSettingsJustification({justification: value}));
  //     }
  //   });
  //   const newTouchBar = new remote.TouchBar({
  //     items: [sidesSlider]
  //   });
  //   remote.getCurrentWindow().setTouchBar(newTouchBar);
  // }

  useEffect(() => {
    setJustification(justificationValue);
  }, [justificationValue, selected]);

  const handleChange = (e: any): void => {
    if (e.target.value !== justification) {
      dispatch(setLayersJustificationThunk({layers: selected, justification: e.target.value as Btwx.Jusftification}));
      setJustification(e.target.value);
      dispatch(setTextSettingsJustification({justification: e.target.value as Btwx.Jusftification}));
    }
    // if (isMac) {
    //   buildTouchBar(e.target.value);
    // }
  };

  const options = DEFAULT_JUSTIFICATION_OPTIONS.map((option) => (
    <ToggleButtonGroup.Button
      key={option}
      value={option}>
      <Icon
        name={`justify-${option}`}
        size='small' />
    </ToggleButtonGroup.Button>
  ));

  return (
    <Form inline>
      <Form.Group controlId='control-justification'>
        <ToggleButtonGroup
          type='radio'
          name='justification'
          size='small'
          value={justification}
          onChange={handleChange}>
          { options }
        </ToggleButtonGroup>
        {/* <Form.Label>
          Alignment
        </Form.Label> */}
      </Form.Group>
    </Form>
  );
}

export default JustificationInput;