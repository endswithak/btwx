import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface GetSymbolMaster {
  layerId: string;
  symbolId: string;
  symbols: FileFormat.SymbolMaster[];
  overrides?: FileFormat.OverrideValue[];
  symbolPath?: string;
}

export const getSymbolMaster = ({ layerId, symbolId, symbols, overrides, symbolPath }: GetSymbolMaster): FileFormat.SymbolMaster => {
  const originalSymbol = symbols.find((symbolMaster) => {
    return symbolMaster.symbolID === symbolId;
  });
  const overrideSymbol = overrides ? overrides.find((override) => {
    const overridePath = symbolPath ? `${symbolPath}/${layerId}_symbolID` : `${layerId}_symbolID`;
    return overridePath.includes(override.overrideName);
  }) : null;
  if (overrideSymbol) {
    return symbols.find((symbolMaster) => {
      return symbolMaster.symbolID === overrideSymbol.value;
    });
  } else {
    return originalSymbol;
  }
};