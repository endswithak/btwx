import paper from 'paper';

[...Array(33).keys()].forEach((scope, index) => {
  new paper.PaperScope();
});

export const uiPaperScope = paper.PaperScope.get(0);
// export const pagePaperScope = paper.PaperScope.get(1);
export const paperPreview = new paper.PaperScope();

// export const paperMain = new paper.PaperScope();
// export const paperPreview = new paper.PaperScope();