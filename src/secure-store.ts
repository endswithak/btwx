/* eslint-disable @typescript-eslint/explicit-function-return-type */
// github.com/reZach/secure-electron-store

import pathModule from 'path';

interface DefaultOptions {
  debug?: boolean;
  path?: string;
  filename?: string;
  extension?: string;
  reset?: boolean;
}

const defaultOptions: DefaultOptions = {
  debug: true,
  path: '',
  filename: 'data',
  extension: '.json',
  reset: false
}

// Electron specific; Must match mainIpc
export const readConfigRequest = 'ReadConfig-Request';
export const readConfigResponse = 'ReadConfig-Response';
export const writeConfigRequest = 'WriteConfig-Request';
export const writeConfigResponse = 'WriteConfig-Response';
export const deleteConfigRequest = 'DeleteConfig-Request';
export const deleteConfigResponse = 'DeleteConfig-Response';
export const useConfigInMainRequest = 'UseConfigInMain-Request';
export const useConfigInMainResponse = 'UseConfigInMain-Response';

export default class Store {
  options: DefaultOptions;
  validSendChannels: string[];
  validRecieveChannels: string[];
  initialFileData: any;
  initialDataParsed: boolean;
  initialFileDataParsed: boolean;
  fileData: any;
  mainLog: string;
  rendererLog: string;
  constructor(options?: DefaultOptions) {
    this.options = defaultOptions;

    if (typeof options !== undefined) {
      this.options = Object.assign(this.options, options);
    }

    // log related vars
    const logPrepend = '[secure-electron-store:';
    this.mainLog = `${logPrepend}main]=`;
    this.rendererLog = `${logPrepend}renderer]=`;

    // only run the following code in the renderer process
    // if no new path is set in options, we can determine its the renderer process
    if (typeof options === 'undefined' || options.path !== defaultOptions.path) {
      try {
        const arg = process.argv.filter(p => p.indexOf('storePath:') >= 0)[0];
        this.options.path = arg.substr(arg.indexOf(':') + 1);

        if (this.options.debug) {
          console.log(`${this.rendererLog} initializing. Parsed 'storePath' value: ${this.options.path}.`)
        }
      } catch(error) {
        `Could not find 'additionalArguments' value beginning with 'storePath:' in your BrowserWindow. Error: ${error}`;
      }
    }

    const rootPath = this.options.path;
    this.options.path = pathModule.join(rootPath, `${this.options.filename}${this.options.extension}`);
    this.validSendChannels = [readConfigRequest, writeConfigRequest, deleteConfigRequest, useConfigInMainRequest];
    this.validRecieveChannels = [readConfigResponse, writeConfigResponse, deleteConfigResponse, useConfigInMainResponse];

    // log on initialization
    if (this.options.debug) {
      if (typeof process === 'object' && process.argv.filter(p => p.indexOf('electron') >= 0).length === 0) {
        console.log(`${this.rendererLog} initialized store. Data file: ${this.options.path}`);
      } else {
        console.log(`${this.mainLog} initialized store. Data file: ${this.options.path}`);
      }
    }
  }

  preloadBindings(ipcRenderer: any, fs: any) {
    const { debug, path } = this.options;

    // initially read the file contents
    try {
      this.initialFileData = fs.readFileSync(path);
    } catch(error) {
      if (error.code === 'ENOENT') {
        const defaultData = JSON.stringify({});
        this.initialFileData = {};
        this.initialDataParsed = true;
        fs.writeFileSync(path, defaultData);
      } else {
        throw `${this.rendererLog} encountered error '${error}' when trying to read file '${path}'. Probobly corrupted.`;
      }
    }
    return {
      path,
      initial: () => {
        if (this.initialDataParsed) {
          return this.initialFileData;
        }
        if (debug) {
          console.log(`${this.rendererLog} reading data from file '${path}' into the initial property.`);
        }
        try {
          this.initialFileData = JSON.parse(this.initialFileData);
        } catch(error) {
          throw `${this.rendererLog} encountered error '${error}' when trying to read file '${path}'. Probobly corrupted`;
        }
        this.initialFileDataParsed = true;
        return this.initialFileData;
      },
      send: (channel: string, key: any, value: any) => {
        if (this.validSendChannels.includes(channel)) {
          switch(channel) {
            case readConfigRequest: {
              if (debug) {
                console.log(`${this.rendererLog} requesting to read '${key}' from file.`);
              }
              ipcRenderer.send(channel, {
                key
              });
              break;
            }
            case writeConfigRequest: {
              if (debug) {
                console.log(`${this.rendererLog} requesting to write ${key}:${value} to file.`);
              }
              ipcRenderer.send(channel, {
                key,
                value
              });
              break;
            }
            case deleteConfigRequest: {
              if (debug) {
                console.log(`${this.rendererLog} requesting to delete file.`);
              }
              ipcRenderer.send(channel, {});
              break;
            }
            case useConfigInMainRequest: {
              if (debug) {
                console.log(`${this.rendererLog} requesting to use store in electron main process.`);
              }
              ipcRenderer.send(channel, {});
              break;
            }
            default:
              break;
          }
        }
      },
      onReceive: (channel: string, func: any) => {
        if (this.validRecieveChannels.includes(channel)) {
          ipcRenderer.on(channel, (event: any, args: any) => {
            if (debug) {
              switch(channel) {
                case readConfigResponse: {
                  console.log(`${this.rendererLog} recieved value: '${args.value}', for key: '${args.key}'.`);
                  break;
                }
                case writeConfigResponse: {
                  console.log(`${this.rendererLog} ${!args.success ? 'un-' : ''}successfully wrote '${args.key}' to file.`);
                  break;
                }
                case deleteConfigResponse: {
                  console.log(`${this.rendererLog} ${!args.success ? 'un-' : ''}successfully deleted file.`);
                  break;
                }
                case useConfigInMainResponse: {
                  console.log(`${this.rendererLog} ${!args.success ? 'un-' : ''}successfully read store from main process.`);
                  break;
                }
                default:
                  break;
              }
            }
            func(args);
          });
        }
      },
      clearRendererBindings: () => {
        if (debug) {
          console.log(`${this.rendererLog} clearing all ipcRenderer listeners.`);
        }
        for(let i = 0; i < this.validRecieveChannels.length; i++) {
          ipcRenderer.removeAllListeners(this.validRecieveChannels[i]);
        }
      }
    }
  }

  mainBindings(ipcMain: any, browserWindow: any, fs: any, mainProcessCallback: any = undefined) {
    const { debug, path, reset } = this.options;

    // Clears and deletes each file
    const resetFiles = function() {
      // clear contents
      if (debug) {
        console.log(`${this.mainLog} clearing all files.`);
      }
      fs.writeFileSync(path, '');
      // delete file
      if (debug) {
        console.log(`${this.mainLog} unlinking data files.`);
      }
      fs.unlinkSync(path);
      // reset cached file data
      if (debug) {
        console.log(`${this.mainLog} clearing local variables.`);
      }
      this.fileData = undefined;
    }.bind(this);

    if (reset) {
      if (debug) {
        console.log(`${this.mainLog} reseting all files because property 'reset' was set to true when configuring store.`);
      }
      try {
        resetFiles();
      } catch(error) {
        console.log(`${this.mainLog} could not reset files, please resolve error '${error}' and try again.`);
      }
    }

    // deletes files if requested
    ipcMain.on(deleteConfigRequest, (IpcMainEvent: any, args: any) => {
      if (debug) {
        console.log(`${this.mainLog} recieved a request to delete data files.`);
      }
      let success = true;
      try {
        resetFiles();
      } catch(error) {
        console.log(`${this.mainLog} failed to reset data due to error: '${error}'. Please resolve error and try again.`);
        success = false;
      }
      browserWindow.webContents.send(deleteConfigResponse, {
        success
      });
    });

    // anytime the renderer requests to read file
    ipcMain.on(readConfigRequest, (IpcMainEvent: any, args: any) => {
      if (debug) {
        console.log(`${this.mainLog} recieved a request to read the key '${args.key}' from the given file '${path}'.`);
      }
      fs.readFile(path, (error: any, data: any) => {
        if (error) {
          if (error.code === 'ENOENT') {
            if (debug) {
              console.log(`${this.mainLog} did not find data file when trying to read the key '${args.key}'. Creating an empty data file.`);
            }
            const defaultData = JSON.parse({});
            fs.writeFileSync(path, defaultData);
            browserWindow.webContents.send(readConfigResponse, {
              success: false,
              key: args.key,
              value: undefined
            });
            return;
          } else {
            throw `${this.mainLog} encountered error '${error}' when trying to read file '${path}'. Probobly corrupted.`;
          }
        }
        let dataToRead = data;
        try {
          dataToRead = JSON.parse(dataToRead);
        } catch(error2) {
          throw `${this.mainLog} encountered error '${error2}' when trying to read file '${path}'. Probobly corrupted.`;
        }
        this.fileData = dataToRead;
        if (debug) {
          console.log(`${this.mainLog} read the key '${args.key}' from file '${dataToRead[args.key]}'.`);
        }
        browserWindow.webContents.send(readConfigResponse, {
          success: true,
          key: args.key,
          value: dataToRead[args.key]
        });
      });
    });

    // anytime the renderer requests to write file
    ipcMain.on(writeConfigRequest, (IpcMainEvent: any, args: any) => {

      // wrapper function since we call it twice below
      const writeToFile = function() {
        if (typeof args.key !== 'undefined' && typeof args.value !== 'undefined') {
          this.fileData[args.key] = args.value;
        }
        let dataToWrite = this.fileData;
        try {
          dataToWrite = JSON.parse(dataToWrite);
        } catch(error) {
          throw `${this.mainLog} encountered error '${error}' when trying to write file '${path}'.`;
        }
        fs.writeFile(path, dataToWrite, (error: any) => {
          if (debug) {
            console.log(`${this.mainLog} wrote '${args.key}':'${args.value}' to file '${path}'.`);
          }
          browserWindow.webContents.send(writeConfigResponse, {
            success: !error,
            key: args.key
          });
        });
      }.bind(this);

      // if no fileData saved yet,
      // pull latest from file
      if (typeof this.fileData === 'undefined') {
        fs.readFile(path, (error: any, data: any) => {
          if (error) {
            // file does not exist
            // create file and give it empty/default value
            if (error.code === 'ENOENT') {
              this.fileData = {};
              writeToFile();
              return;
            } else {
              throw `${this.mainLog} encountered error '${error}' when trying to read file '${path}'. Probobly corrupted.`;
            }
          }
          // get file contents
          let dataInFile = data;
          try {
            if (typeof data !== 'undefined') {
              dataInFile = JSON.parse(dataInFile);
            }
          } catch(error2) {
            throw `${this.mainLog} encountered error '${error}' when trying to read file '${path}'. Probobly corrupted.`;
          }
          this.fileData = dataInFile;
          writeToFile();
        });
      } else {
        writeToFile();
      }
    });

    // anytime main process need to use store
    ipcMain.on(useConfigInMainRequest, (IpcMainEvent: any, args: any) => {
      if (debug) {
        console.log(`${this.mainLog} recieved a request to read store in electron main process.`);
      }

      // if use wants to store values in main processs,
      // the user can request a callback from main process
      // when "useConfigInMainRequest" request is recieved

      // be sure your "mainProcessCallback" func is "const" in main process
      // otherwise it wont work
      if (typeof mainProcessCallback !== 'undefined') {
        let dataInFile: any = {};
        fs.readFile(path, (error: any, data: any) => {
          if (error) {
            // file does not exist
            // create file and give it empty/default value
            if (error.code === 'ENOENT') {
              if (debug) {
                console.log(`${this.mainLog} did not find file when trying to read from main process.`);
              }
              mainProcessCallback(false, dataInFile);
              browserWindow.webContents.send(useConfigInMainResponse, {
                success: false
              });
              return;
            }
          }
          dataInFile = data;
          try {
            dataInFile = JSON.parse(dataInFile);
          } catch(error2) {
            throw `${this.mainLog} encountered error '${error}' when trying to read file '${path}'. Probobly corrupted.`;
          }
          if (debug) {
            console.log(`${this.mainLog} read the store from the main process successfully.`);
          }
          mainProcessCallback(true, dataInFile);
          browserWindow.webContents.send(useConfigInMainResponse, {
            success: true
          });
          return;
        });
      } else {
        throw `${this.mainLog} failed to take action when recieveing a request to use the store in the main electron process.`;
      }
    });
  }

  mainInitialStore(fs: any) {
    const { debug, path } = this.options;
    let data;
    try {
      data = fs.readFileSync(path);
    } catch(error) {
      if (error.code === 'ENOENT') {
        if (debug) {
          console.log(`${this.mainLog} did not find data when trying to read ${args.key}. Creating new file.`);
        }
        const defaultData = JSON.parse({});
        fs.writeFileSync(path, defaultData);
        return defaultData;
      } else {
        throw `${this.mainLog} encountered error '${error}' when trying to read file '${path}'. Probobly corrupted.`;
      }
    }
    let dataToRead = data;
    try {
      dataToRead = JSON.parse(dataToRead);
    } catch(error2) {
      throw `${this.mainLog} encountered error '${error2}' when trying to read file '${path}'. Probobly corrupted.`;
    }
    return dataToRead;
  }

  clearMainBindings(ipcMain: any) {
    ipcMain.removeAllListeners(readConfigRequest);
    ipcMain.removeAllListeners(writeConfigRequest);
    ipcMain.removeAllListeners(deleteConfigRequest);
    ipcMain.removeAllListeners(useConfigInMainRequest);
  }
}