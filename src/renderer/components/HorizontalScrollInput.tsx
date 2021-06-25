import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableGroupsHorizontalScroll, disableGroupsHorizontalScroll, enableGroupsVerticalScroll, disableGroupsVerticalScroll } from '../store/actions/layer';
import { getSelectedScrollWidth, getSelectedScrollLeft, selectedScrollEnabled } from '../store/selectors/layer';
import SidebarSectionLabel from './SidebarSectionLabel';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const HorizontalScrollInput = (): ReactElement => {
  const leftControlRef = useRef<HTMLInputElement>(null);
  const widthControlRef = useRef<HTMLInputElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const disabled = useSelector((state: RootState) => !selectedScrollEnabled(state));
  const scrollWidthValue = useSelector((state: RootState) => getSelectedScrollWidth(state));
  const scrollLeftValue = useSelector((state: RootState) => getSelectedScrollLeft(state));
  const [scrollWidth, setScrollWidth] = useState(scrollWidthValue);
  const [scrollLeft, setScrollLeft] = useState(scrollLeftValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setScrollWidth(scrollWidthValue);
  }, [scrollWidthValue, selected]);

  useEffect(() => {
    setScrollLeft(scrollLeftValue);
  }, [scrollLeftValue, selected]);

  const handleScrollLeftSubmitSuccess = (evaluation: any): void => {
    // dispatch(setLayersHeightThunk({layers: selected, height: evaluation}));
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width='33.33%'>
        <SidebarSectionLabel text='Horizontal' />
      </SidebarSectionColumn>
      <SidebarSectionColumn width='33.33%'>
        <Form>
          <Form.Group controlId='control-scroll-width'>
            <Form.Control
              disabled={disabled}
              ref={widthControlRef}
              as='input'
              value={scrollWidth}
              size='small'
              type='text'
              readOnly
              right={<Form.Text>W</Form.Text>}
              rightReadOnly />
          </Form.Group>
        </Form>
      </SidebarSectionColumn>
      <SidebarSectionColumn width='33.33%'>
        <MathFormGroup
          ref={leftControlRef}
          controlId='control-scroll-left'
          value={scrollLeft}
          size='small'
          right={<Form.Text>X</Form.Text>}
          onSubmitSuccess={handleScrollLeftSubmitSuccess}
          submitOnBlur
          canvasAutoFocus
          disabled={disabled} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default HorizontalScrollInput;