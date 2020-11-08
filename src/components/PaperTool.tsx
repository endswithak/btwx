/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, ReactElement, useState } from 'react';
import { paperMain } from '../canvas';

export interface PaperToolProps {
  tool?: paper.Tool;
  keyDownEvent?: paper.KeyEvent;
  keyUpEvent?: paper.KeyEvent;
  moveEvent?: paper.ToolEvent;
  downEvent?: paper.ToolEvent;
  dragEvent?: paper.ToolEvent;
  upEvent?: paper.ToolEvent;
}

const PaperToolWrap = (Component: any) => {
  const PaperTool = (): ReactElement => {
    const [tool, setTool] = useState<paper.Tool>(null);
    const [keyDownEvent, setKeyDownEvent] = useState<paper.KeyEvent>(null);
    const [keyUpEvent, setKeyUpEvent] = useState<paper.KeyEvent>(null);
    const [moveEvent, setMoveEvent] = useState<paper.ToolEvent>(null);
    const [downEvent, setDownEvent] = useState<paper.ToolEvent>(null);
    const [dragEvent, setDragEvent] = useState<paper.ToolEvent>(null);
    const [upEvent, setUpEvent] = useState<paper.ToolEvent>(null);

    const handleKeyDown = (e: paper.KeyEvent): void => {
      setKeyDownEvent(e);
    }

    const handleKeyUp = (e: paper.KeyEvent): void => {
      setKeyUpEvent(e);
    }

    const handleMouseMove = (e: paper.ToolEvent): void => {
      setMoveEvent(e);
    }

    const handleDownEvent = (e: paper.ToolEvent): void => {
      setDownEvent(e);
    }

    const handleDragEvent = (e: paper.ToolEvent): void => {
      setDragEvent(e);
    }

    const handleUpEvent = (e: paper.ToolEvent): void => {
      setUpEvent(e);
    }

    useEffect(() => {
      const newTool = new paperMain.Tool();
      newTool.minDistance = 1;
      newTool.onKeyDown = handleKeyDown;
      newTool.onKeyUp = handleKeyUp;
      newTool.onMouseMove = handleMouseMove;
      newTool.onMouseDown = handleDownEvent;
      newTool.onMouseDrag = handleDragEvent;
      newTool.onMouseUp = handleUpEvent;
      setTool(newTool);
      paperMain.tool = null;
    }, []);

    return (
      <Component
        tool={tool}
        keyDownEvent={keyDownEvent}
        keyUpEvent={keyUpEvent}
        moveEvent={moveEvent}
        downEvent={downEvent}
        dragEvent={dragEvent}
        upEvent={upEvent} />
    );
  }
  return PaperTool;
}

export default PaperToolWrap;