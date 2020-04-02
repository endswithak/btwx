interface SetFramePosition {
  x: number;
  y: number;
  container: paper.Layer | paper.Group;
  absolute?: boolean;
}

export const setFramePosition = ({ x, y, container, absolute }: SetFramePosition): void => {
  if (absolute) {
    container.position.x = x;
    container.position.y = y;
  } else {
    container.position.x += x;
    container.position.y += y;
  }
};

interface SetFrameRotation {
  rotation: number;
  container: paper.Layer | paper.Group;
}

export const setFrameRotation = ({ rotation, container }: SetFrameRotation): void => {
  container.rotate(-1 * rotation);
};

interface SetFrameScale {
  isFlippedHorizontal: boolean;
  isFlippedVertical: boolean;
  container: paper.Layer | paper.Group;
}

export const setFrameScale = ({ isFlippedHorizontal, isFlippedVertical, container }: SetFrameScale): void => {
  container.scale(isFlippedHorizontal ? -1 : 1, isFlippedVertical ? -1 : 1);
};