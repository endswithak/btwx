import React, { useState, useEffect, forwardRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface DragHandleProps {
  type: 'x' | 'y';
  side?: 'left' | 'right' | 'top' | 'bottom';
  bounds?: string;
  style?: any;
  onDrag?(draggable: Draggable.Vars): void;
  onRelease?(draggable: Draggable.Vars): void;
}

const DragHandle = forwardRef(function DragHandle({
  type,
  bounds,
  side,
  style,
  onDrag,
  onRelease
}: DragHandleProps, ref: any) {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    Draggable.create(ref.current, {
      type: type,
      zIndexBoost: false,
      bounds: bounds,
      cursor: type === 'x' ? 'col-resize' : 'row-resize',
      onPress: function() {
        setDragging(true);
      },
      onDrag: function() {
        if (onDrag) {
          onDrag(this);
        }
      },
      onRelease: function() {
        if (onRelease) {
          onRelease(this);
        }
        setDragging(false);
      }
    });
    return () => {
      if (Draggable.get(ref.current)) {
        Draggable.get(ref.current).kill();
      }
    }
  }, []);

  return (
    <div
      ref={ref}
      style={style}
      className={`c-drag-handle${
        dragging
        ? `${' '}c-drag-handle--dragging`
        : ''
      }${
        type
        ? `${' '}c-drag-handle--${type}`
        : ''
      }${
        side
        ? `${' '}c-drag-handle--${side}`
        : ''
      }`} />
  );
});

export default DragHandle;