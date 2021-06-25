import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { enableGroupsHorizontalScroll, disableGroupsHorizontalScroll, enableGroupsVerticalScroll, disableGroupsVerticalScroll } from '../store/actions/layer';
import { getSelectedScrollHeight, getSelectedScrollTop, selectedScrollEnabled } from '../store/selectors/layer';
import SidebarSectionLabel from './SidebarSectionLabel';
import SidebarSectionRow from './SidebarSectionRow';
import SidebarSectionColumn from './SidebarSectionColumn';
import Form from './Form';
import MathFormGroup from './MathFormGroup';

const VerticalScrollInput = (): ReactElement => {
  const topControlRef = useRef<HTMLInputElement>(null);
  const heightControlRef = useRef<HTMLInputElement>(null);
  const selected = useSelector((state: RootState) => state.layer.present.selected);
  const disabled = useSelector((state: RootState) => !selectedScrollEnabled(state));
  const scrollHeightValue = useSelector((state: RootState) => getSelectedScrollHeight(state));
  const scrollTopValue = useSelector((state: RootState) => getSelectedScrollTop(state));
  const [scrollHeight, setScrollHeight] = useState(scrollHeightValue);
  const [scrollTop, setScrollTop] = useState(scrollTopValue);
  const dispatch = useDispatch();

  useEffect(() => {
    setScrollHeight(scrollHeightValue);
  }, [scrollHeightValue, selected]);

  useEffect(() => {
    setScrollTop(scrollTopValue);
  }, [scrollTopValue, selected]);

  const handleScrollTopSubmitSuccess = (evaluation: any): void => {
    // dispatch(setLayersHeightThunk({layers: selected, height: evaluation}));
  }

  return (
    <SidebarSectionRow>
      <SidebarSectionColumn width='33.33%'>
        <SidebarSectionLabel text='Vertical' />
      </SidebarSectionColumn>
      <SidebarSectionColumn width='33.33%'>
        <Form>
          <Form.Group controlId='control-scroll-height'>
            <Form.Control
              disabled={disabled}
              ref={heightControlRef}
              as='input'
              value={scrollHeight}
              size='small'
              type='text'
              readOnly
              right={<Form.Text>H</Form.Text>}
              rightReadOnly />
          </Form.Group>
        </Form>
      </SidebarSectionColumn>
      <SidebarSectionColumn width='33.33%'>
        <MathFormGroup
          ref={topControlRef}
          controlId='control-scroll-top'
          value={scrollTop}
          size='small'
          right={<Form.Text>Y</Form.Text>}
          onSubmitSuccess={handleScrollTopSubmitSuccess}
          submitOnBlur
          canvasAutoFocus
          disabled={disabled} />
      </SidebarSectionColumn>
    </SidebarSectionRow>
  );
}

export default VerticalScrollInput;