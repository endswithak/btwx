const { contextBridge, ipcRenderer, desktopCapturer, clipboard } = require('electron');

contextBridge.exposeInMainWorld('api', {
  overwriteRegisteredBinding: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('overwriteRegisteredBinding', params).then((overwrite) => {
        resolve(overwrite);
      });
    });
  },
  checkIfSessionImageExists: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('checkIfSessionImageExists', params).then((exists) => {
        resolve(exists);
      });
    });
  },
  readClipboardText: () => {
    return clipboard.readText();
  },
  writeClipboardText: (text) => {
    clipboard.writeText(text);
  },
  readClipboardImage: () => {
    return clipboard.readImage().toDataURL();
  },
  readClipboardImageSize: () => {
    return clipboard.readImage().getSize();
  },
  readClipboardFormats: () => {
    return clipboard.availableFormats();
  },
  saveInstance: () => {
    ipcRenderer.send('saveInstance');
  },
  saveInstanceAs: () => {
    ipcRenderer.send('saveInstanceAs');
  },
  setDocumentRepresentedFilename: (params) => {
    ipcRenderer.send('setDocumentRepresentedFilename', params);
  },
  openDroppedDocument: (params) => {
    ipcRenderer.send('openDroppedDocument', params);
  },
  resetPreviewTweeningEvent: (params) => {
    ipcRenderer.send('resetPreviewTweeningEvent', params);
  },
  setPreviewTweening: (params) => {
    ipcRenderer.send('setPreviewTweening', params);
  },
  setDocumentPreviewTweening: (params) => {
    ipcRenderer.send('setDocumentPreviewTweening', params);
  },
  setDocumentActiveArtboard: (params) => {
    ipcRenderer.send('setDocumentActiveArtboard', params);
  },
  setDocumentTimelineGuidePosition: (params) => {
    ipcRenderer.send('setDocumentTimelineGuidePosition', params);
  },
  openContextMenu: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('openContextMenu', params).then(() => {
        resolve(null);
      });
    });
  },
  openBoolContextMenu: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('openBoolContextMenu', params).then(() => {
        resolve(null);
      });
    });
  },
  openEventContextMenu: (params) => {
    ipcRenderer.send('openEventContextMenu', params);
  },
  buildDefaultContextMenu: (params) =>  {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('buildDefaultContextMenu', params).then(() => {
        resolve(null);
      });
    });
  },
  buildDefaultApplicationMenu: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('buildDefaultApplicationMenu', params).then(() => {
        resolve(null);
      });
    });
  },
  buildInputApplicationMenu: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('buildInputApplicationMenu', params).then(() => {
        resolve(null);
      });
    });
  },
  setApplicationMenu: (params) =>  {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('setApplicationMenu', params).then(() => {
        resolve(null);
      });
    });
  },
  buildLayerContextMenu: (params) =>  {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('buildLayerContextMenu', params).then(() => {
        resolve(null);
      });
    });
  },
  buildEventContextMenu: (params) =>  {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('buildEventContextMenu', params).then(() => {
        resolve(null);
      });
    });
  },
  buildArtboardPresetContextMenu: (params) =>  {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('buildArtboardPresetContextMenu', params).then(() => {
        resolve(null);
      });
    });
  },
  openTweenLayerContextMenu: (params) => {
    ipcRenderer.send('openTweenLayerContextMenu', params);
  },
  openTweenContextMenu: (params) => {
    ipcRenderer.send('openTweenContextMenu', params);
  },
  openPreferences: () => {
    ipcRenderer.send('openPreferences');
  },
  initPastingLayers: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('initPastingLayers', params).then(() => {
        resolve(null);
      });
    });
  },
  newInstance: () => {
    ipcRenderer.send('newInstance');
  },
  openInstance: () => {
    ipcRenderer.send('openInstance');
  },
  getElectronStore: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('getElectronStore', params).then((value) => {
        resolve(value);
      });
    });
  },
  setElectronStore: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('setElectronStore', params).then(() => {
        resolve(null);
      });
    });
  },
  resizePreview: (params) => {
    ipcRenderer.send('resizePreview', params);
  },
  buildPreviewRecordingTouchBar: (params) => {
    ipcRenderer.send('buildPreviewRecordingTouchBar', params);
  },
  buildPreviewTouchBar: (params) => {
    ipcRenderer.send('buildPreviewTouchBar', params);
  },
  setPreviewRecordingStopped: (params) => {
    ipcRenderer.send('setPreviewRecordingStopped', params);
  },
  openPreview: (params) => {
    ipcRenderer.send('openPreview', params);
  },
  openPreviewDeviceContextMenu: (params) => {
    ipcRenderer.send('openPreviewDeviceContextMenu', params);
  },
  setDocumentRecordingStopped: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('setDocumentRecordingStopped', params).then(() => {
        resolve(null);
      });
    });
  },
  getPreviewWindowSize: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('getPreviewWindowSize', params).then((windowSize) => {
        resolve(windowSize);
      });
    });
  },
  hidePreviewTrafficLights: (params) => {
    ipcRenderer.send('hidePreviewTrafficLights', params);
  },
  showPreviewTrafficLights: (params) => {
    ipcRenderer.send('showPreviewTrafficLights', params);
  },
  setDocumentRecordingStarted: (params) => {
    ipcRenderer.send('setDocumentRecordingStarted', params);
  },
  // buildRecordingTouchBar: (params) => {
  //   ipcRenderer.send('buildRecordingTouchBar', params);
  // },
  setPreviewWindowSize: (params) => {
    ipcRenderer.send('setPreviewWindowSize', params);
  },
  getPreviewMediaSource: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('getPreviewMediaSource', params).then((mediaSourceId) => {
        resolve(mediaSourceId);
      });
    });
  },
  getDesktopCapturerSources: (params) => {
    return new Promise((resolve, reject) => {
      desktopCapturer.getSources({ types: ['window', 'screen'] }).then((sources) => {
        resolve(sources);
      });
    });
  },
  maximizeDocument: (params) => {
    ipcRenderer.send('maximizeDocument', params);
  },
  setDocumentEdited: (params) => {
    ipcRenderer.send('setDocumentEdited', params);
  },
  buildEmptySelectionTouchBar: (params) => {
    ipcRenderer.send('buildEmptySelectionTouchBar', params);
  },
  buildSelectionTouchBar: (params) => {
    ipcRenderer.send('buildSelectionTouchBar', params);
  },
  clearTouchBar: (params) => {
    ipcRenderer.send('clearTouchBar', params);
  },
  buildDocumentRecordingTouchBar: (params) => {
    ipcRenderer.send('buildDocumentRecordingTouchBar', params);
  },
  hydratePreviewSessionImages: (params) => {
    ipcRenderer.send('hydratePreviewSessionImages', params);
  },
  hydratePreviewLayers: (params) => {
    ipcRenderer.send('hydratePreviewLayers', params);
  },
  setPreviewActiveArtboard: (params) => {
    ipcRenderer.send('setPreviewActiveArtboard', params);
  },
  setPreviewEventDrawerEvent: (params) => {
    ipcRenderer.send('setPreviewEventDrawerEvent', params);
  },
  stickPreview: (params) => {
    ipcRenderer.send('stickPreview', params);
  },
  unStickPreview: (params) => {
    ipcRenderer.send('unStickPreview', params);
  },
  insertImage: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('insertImage', params).then((imageData) => {
        resolve(imageData);
      });
    });
  },
  initPasteWithoutArtboardAlert: (params) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke('initPasteWithoutArtboardAlert', params).then(() => {
        resolve(null);
      });
    });
  },
  setNativeTheme: (params) => {
    ipcRenderer.send('setNativeTheme', params);
  }
})