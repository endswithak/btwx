import React, { ReactElement } from 'react';

interface LinearGradientSelectorProps {
  isActive: boolean;
  onClick(): void;
}

const LinearGradientSelector = ({
  isActive,
  onClick
}: LinearGradientSelectorProps): ReactElement => (
  <button
    onClick={onClick}
    className={`c-fill-editor__type c-fill-editor__type--linear-gradient${
      isActive
      ? `${' '}c-fill-editor__type--active`
      : ''
    }`} />
);

export default LinearGradientSelector;