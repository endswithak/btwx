/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { ReactElement, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { closeArtboardPresetEditor } from '../store/actions/artboardPresetEditor';
import { addArtboardPresetThunk, updateArtboardPresetThunk, setArtboardPresetDevicePlatformThunk } from '../store/actions/artboardPresets';
import { setCanvasFocusing } from '../store/actions/canvasSettings';
import Form from './Form';
import Button from './Button';

const ArtboardPresetEditor = (): ReactElement => {
  const editorRef = useRef(null);
  const nameControlRef = useRef(null);
  const widthControlRef = useRef(null);
  const heightControlRef = useRef(null);
  const artboardPresetEditor = useSelector((state: RootState) => state.artboardPresetEditor);
  // const platformType = useSelector((state: RootState) => state.documentSettings.artboardPresets.platform);
  const exists = useSelector((state: RootState) => state.artboardPresets.allIds.includes(state.artboardPresetEditor.id));
  // const canvasFocusing = useSelector((state: RootState) => state.canvasSettings.focusing);
  const [name, setName] = useState(artboardPresetEditor.type);
  const [width, setWidth] = useState(artboardPresetEditor.width);
  const [height, setHeight] = useState(artboardPresetEditor.height);
  const dispatch = useDispatch();

  const handleNameChange = (e: any): void => {
    setName(e.target.value);
  };

  const handleWidthChange = (e: any): void => {
    setWidth(e.target.value);
  };

  const handleHeightChange = (e: any): void => {
    setHeight(e.target.value);
  };

  const handleKeyDown = (e: any): void => {
    if (e.key === 'Escape') {
      dispatch(closeArtboardPresetEditor());
    }
  };

  const handleMouseDown = (e: any): void => {
    if (!editorRef.current.contains(e.target)) {
      dispatch(closeArtboardPresetEditor());
    }
  };

  const handleSave = (): void => {
    if (exists) {
      dispatch(updateArtboardPresetThunk({
        id: artboardPresetEditor.id,
        type: name.replace(/\s/g, '').length > 0 ? name : 'Custom',
        width: width,
        height: height
      }));
    } else {
      dispatch(addArtboardPresetThunk({
        id: artboardPresetEditor.id,
        type: name.replace(/\s/g, '').length > 0 ? name : 'Custom',
        width: width,
        height: height
      }));
    }
    dispatch(setArtboardPresetDevicePlatformThunk({
      platform: 'Custom'
    }));
    dispatch(closeArtboardPresetEditor());
  }

  useEffect(() => {
    dispatch(setCanvasFocusing({focusing: false}));
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    if (nameControlRef.current) {
      nameControlRef.current.focus();
      nameControlRef.current.select();
    }
    return () => {
      dispatch(setCanvasFocusing({focusing: true}));
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    }
  }, []);

  return (
    <div
      className='c-artboard-preset-editor'
      ref={editorRef}>
      <div className='c-artboard-preset-editor__aside'>
        <div className='c-artboard-preset-editor__icon'>
          <div className='c-artboard-preset-editor-icon__plane c-artboard-preset-editor-icon__plane--bg' />
          <div className='c-artboard-preset-editor-icon__plane c-artboard-preset-editor-icon__plane--fg' />
        </div>
        <p className='c-artboard-preset-editor__head'>
          Custom Preset
        </p>
        <p className='c-artboard-preset-editor__body'>
          Create custom presets for your frequently used artboard sizes.
        </p>
      </div>
      <div className='c-artboard-preset-editor__main'>
        <Form onSubmit={handleSave}>
          <Form.Group controlId='control-ape-name'>
            <Form.Control
              ref={nameControlRef}
              as='input'
              value={name}
              size='small'
              type='text'
              onChange={handleNameChange}
              required />
            <Form.Label>
              Name
            </Form.Label>
          </Form.Group>
          <Form.Row>
            <Form.Group controlId='control-ape-width'>
              <Form.Control
                ref={widthControlRef}
                as='input'
                value={width}
                size='small'
                type='text'
                onChange={handleWidthChange}
                // right={<Form.Text>px</Form.Text>}
                // rightReadOnly
                required />
              <Form.Label>
                Width
              </Form.Label>
            </Form.Group>
            <Form.Group controlId='control-ape-height'>
              <Form.Control
                ref={heightControlRef}
                as='input'
                value={height}
                size='small'
                type='text'
                onChange={handleHeightChange}
                // right={<Form.Text>px</Form.Text>}
                // rightReadOnly
                required />
              <Form.Label>
                Height
              </Form.Label>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Button
              onClick={() => dispatch(closeArtboardPresetEditor())}
              block>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='primary'
              block>
              Save
            </Button>
          </Form.Row>
        </Form>
      </div>
    </div>
  );
}

export default ArtboardPresetEditor;