import React, { ReactElement } from 'react';

interface RadialGradientSelectorProps {
  isActive: boolean;
  onClick(): void;
}

const RadialGradientSelector = ({
  isActive,
  onClick
}: RadialGradientSelectorProps): ReactElement => (
  <button
    onClick={onClick}
    className={`c-fill-editor__type c-fill-editor__type--radial-gradient${
      isActive
      ? `${' '}c-fill-editor__type--active`
      : ''
    }`} />
)

export default RadialGradientSelector;