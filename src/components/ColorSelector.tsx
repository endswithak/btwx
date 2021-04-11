import React, { ReactElement } from 'react';

interface ColorSelectorProps {
  isActive: boolean;
  onClick(): void;
}

const ColorSelector = ({
  isActive,
  onClick
}: ColorSelectorProps): ReactElement => (
  <button
    onClick={onClick}
    className={`c-fill-editor__type c-fill-editor__type--color${
      isActive
      ? `${' '}c-fill-editor__type--active`
      : ''
    }`} />
);

export default ColorSelector;