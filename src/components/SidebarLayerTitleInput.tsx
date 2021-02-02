import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLayerName } from '../store/actions/layer';
import { setEditing } from '../store/actions/leftSidebar';
import { RootState } from '../store/reducers';
import Form from './Form';

interface SidebarLayerTitleInputProps {
  id: string;
}

const SidebarLayerTitleInput = (props: SidebarLayerTitleInputProps): ReactElement => {
  const formControlRef = useRef(null);
  const { id } = props;
  const nameValue = useSelector((state: RootState) => state.layer.present.byId[id].name);
  const [name, setNameInput] = useState(nameValue);
  const dispatch = useDispatch();

  const handleMouseDown = (event: any): void => {
    if (event.target !== formControlRef.current) {
      if (formControlRef.current) {
        formControlRef.current.blur();
      }
    }
  }

  const handleSubmit = (e: any): void => {
    if (name.replace(/\s/g, '').length > 0 && name !== nameValue) {
      dispatch(setLayerName({id: id, name: name}));
    }
    dispatch(setEditing({editing: null}));
  }

  const handleChange = (e: any): void => {
    setNameInput(e.target.value);
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    if (formControlRef.current) {
      formControlRef.current.focus();
      formControlRef.current.select();
    }
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    }
  }, []);

  return (
    <Form
      inline
      onSubmit={handleSubmit}
      submitOnBlur
      canvasAutoFocus>
      <Form.Group controlId={`control-${id}-name`}>
        <Form.Control
          ref={formControlRef}
          as='input'
          value={name}
          size='small'
          type='text'
          onChange={handleChange} />
      </Form.Group>
    </Form>
  );
}

export default SidebarLayerTitleInput;