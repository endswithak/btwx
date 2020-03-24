import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface GetBooleanOperation {
  operation: FileFormat.BooleanOperation;
}

export const getBooleanOperation = ({ operation }: GetBooleanOperation): string | null => {
  switch(operation) {
    case -1:
      return 'exclude';
    case 0:
      return 'unite';
    case 1:
      return 'subtract';
    case 2:
      return 'intersect';
    case 3:
      return 'exclude';
  }
};

interface ApplyBooleanOperation {
  operation: FileFormat.BooleanOperation;
  a: paper.PathItem;
  b: paper.PathItem;
  insert?: boolean;
}

export const applyBooleanOperation = ({ a, b, operation, insert }: ApplyBooleanOperation): paper.PathItem => {
  const booleanOperation = getBooleanOperation({operation});
  switch(booleanOperation) {
    case 'normal':
      return b;
    case 'unite':
      return a.unite(b, {insert});
    case 'subtract':
      return a.subtract(b, {insert});
    case 'intersect':
      return a.intersect(b, {insert});
    case 'exclude':
      return a.exclude(b, {insert});
  }
};

interface GetNestedPathItem {
  layer: paper.PathItem | paper.Layer;
}

export const getNestedPathItem = ({ layer }: GetNestedPathItem): paper.PathItem => {
  switch(layer.className) {
    case 'Path':
    case 'CompoundPath':
      return layer as paper.PathItem;
    case 'Layer': {
      let lastChild = layer.lastChild;
      while(lastChild.className === 'Layer') {
        lastChild = lastChild.lastChild;
      }
      return lastChild as paper.PathItem;
    }
  }
};