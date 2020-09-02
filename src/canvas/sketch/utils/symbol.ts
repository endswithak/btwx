import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface GetSymbolMaster {
  symbolId: string;
  symbols: FileFormat.SymbolMaster[];
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

export const getSymbolMaster = ({ symbolId, symbols, overrides, symbolPath }: GetSymbolMaster): FileFormat.SymbolMaster => {
  const originalSymbol = symbols.find((symbolMaster) => {
    return symbolMaster.symbolID === symbolId;
  });
  const overrideSymbol = overrides ? overrides.find((override) => {
    return `${symbolPath}_symbolID`.includes(override.overrideName);
  }) : null;
  if (overrideSymbol) {
    return symbols.find((symbolMaster) => {
      return symbolMaster.symbolID === overrideSymbol.value;
    });
  } else {
    return originalSymbol;
  }
};

interface GetSymbolPath {
  symbolPath: string;
  layer: FileFormat.AnyLayer;
}

export const getSymbolPath = ({ symbolPath, layer }: GetSymbolPath): string => {
  if (layer._class !== 'group') {
    return symbolPath ? `${symbolPath}/${layer.do_objectID}` : layer.do_objectID;
  } else {
    return symbolPath;
  }
};

interface GetCompiledOverrides {
  overrides: FileFormat.OverrideValue[];
  layer: FileFormat.AnyLayer;
}

export const getCompiledOverrides = ({ overrides, layer }: GetCompiledOverrides): FileFormat.OverrideValue[] => {
  if (layer._class === 'symbolInstance') {
    return overrides ? [...overrides, ...layer.overrideValues] : layer.overrideValues;
  } else {
    return overrides;
  }
};