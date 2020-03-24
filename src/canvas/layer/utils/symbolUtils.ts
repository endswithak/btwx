import FileFormat from '@sketch-hq/sketch-file-format-ts';

interface GetSymbolMaster {
  instanceId: string;
  symbolId: string;
  symbols: FileFormat.SymbolMaster[];
  overrides?: FileFormat.OverrideValue[];
}

export const getSymbolMaster = ({ instanceId, symbolId, symbols, overrides }: GetSymbolMaster): FileFormat.SymbolMaster => {
  const originalSymbol = symbols.find((symbolMaster) => {
    return symbolMaster.symbolID === symbolId;
  });
  const overrideSymbol = overrides ? overrides.find((override) => {
    return override.overrideName.includes(`${instanceId}_symbolID`);
  }) : null;
  if (overrideSymbol) {
    return symbols.find((symbolMaster) => {
      return symbolMaster.symbolID === overrideSymbol.value;
    });
  } else {
    return originalSymbol;
  }
};