// github.com/reZach/secure-electron-context-menu

interface DefaultOptions {
  templateAttributeName: string;
  payloadAttributeName: string;
  idAttributeName: string;
}

const defaultOptions: DefaultOptions = {
  templateAttributeName: 'cm-template',
  payloadAttributeName: 'cm-payload',
  idAttributeName: 'cm-id'
}

const contextMenuRequest = 'ContextMenu-Request';
const contextMenuResponse = 'ContextMenu-Response';
const contextMenuClicked = 'ContextMenu-Clicked';

class ContextMenu {
  options: DefaultOptions;
  id: string;
  selectedElement: Element;
  selectedElementAttributes: any;
  contextMenuParams: any;
  stagedInternalFnMap: any;
  internalFnMap: any;
  cleanedTemplates: any;
  constructor(options?: DefaultOptions) {
    this.options = defaultOptions;
    this.selectedElement = null;
    this.selectedElementAttributes = {};
    this.contextMenuParams = {};
    this.stagedInternalFnMap = {};
    this.internalFnMap = {};
    this.cleanedTemplates = {};

    // merge any options the user passed in
    if (typeof options !== 'undefined') {
      this.options = Object.assign(this.options, options);
    }
  }
  preloadBindings(ipcRenderer: any) {
    const createIpcBindings = () => {
      this.id = "";
      ipcRenderer.on(contextMenuRequest, (event: any, args: any) => {
        // reset
        let templateToSend = null;
        this.selectedElement = null;
        this.selectedElementAttributes = {};
        this.contextMenuParams = args.params;

        // grab element where user clicked
        this.selectedElement = document.elementFromPoint(args.params.x, args.params.y);
        if (this.selectedElement !== null) {
          const contextMenuTemplate = this.selectedElement.getAttribute(this.options.templateAttributeName);
          if (contextMenuTemplate !== '' && contextMenuTemplate !== null) {
            // save all attr values for later use...
            // when we call the callback defined for this context menu item
            const attributes = this.selectedElement.attributes;
            for (let i = 0; i < attributes.length; i++) {
              if (attributes[i].name.indexOf(this.options.payloadAttributeName) >= 0) {
                this.selectedElementAttributes[attributes[i].name.replace(`${this.options.payloadAttributeName}-`, '')] = attributes[i].value;
              } else if (attributes[i].name.indexOf(this.options.idAttributeName) >= 0) {
                this.id = attributes[i].value;
              }
            }
            templateToSend = contextMenuTemplate
          }
        }

        // send the request to main process
        // so menu can be built
        ipcRenderer.send(contextMenuResponse, {
          id: this.id,
          params: args.params,
          template: templateToSend
        });
      });

      ipcRenderer.on(contextMenuClicked, (event: any, args: any) => {
        if (typeof this.internalFnMap[args.id] !== 'undefined') {
          const payload = {
            params: this.contextMenuParams,
            attributes: this.selectedElementAttributes
          };
          this.internalFnMap[args.id](payload);
        }
      });
    }
    createIpcBindings();

    return {
      onReceive: (menuActionId: any, func: any, id: any): void => {
        if (typeof id !== 'undefined') {
          this.internalFnMap[menuActionId] = func;
        } else {
          this.internalFnMap[`${id}__${menuActionId}`] = func;
        }
      },
      clearRendererBindings: () => {
        this.stagedInternalFnMap = {};
        this.internalFnMap = {};
        this.contextMenuParams = {};
        ipcRenderer.removeAllListeners(contextMenuRequest);
        ipcRenderer.removeAllListeners(contextMenuClicked);
        createIpcBindings();
      }
    }
  }

  mainBindings(ipcMain: any, browserWindow: any, Menu: any, isDevelopment: boolean, templates: any): void {
    // anytime the user right clicks the browser window,
    // send where they clicked to the renderer process
    browserWindow.webContents.on('context-menu', (event: any, params: any) => {
      browserWindow.webContents.send(contextMenuRequest, { params });
    });

    ipcMain.on(contextMenuResponse, (IpcMainEvent: any, args: any) => {
      // id prepend; if we have list of common elements,
      // certain bindings may not work because each element would have
      // registered for the same event name. In these cases, prepend each
      // menu item with the unique id passed, so that each individual component
      // can respond properly to context menu action
      const idPrepend = args.id ? `${args.id}__` : '';
      const cleanedTemplatesKey = `${idPrepend}${args.template}`;

      let generateContextMenu: any;
      if (args.template === null || typeof this.cleanedTemplates[cleanedTemplatesKey] === 'undefined') {
        // build context menu based on templates
        generateContextMenu = templates[args.template] ? cloneDeep(templates[args.template]) : [];
        if (isDevelopment) {
          generateContextMenu.push({
            label: 'Inspect Element',
            click: () => {
              browserWindow.inspectElement(args.params.x, args.params.y);
            }
          });
        }
        if (args.template !== null) {
          // for any items without role or click event
          // create one so we can tie back the click to the code
          for(let i = 0; i < generateContextMenu.length; i++) {
            if (typeof generateContextMenu[i]['click'] === 'undefined') {
              generateContextMenu[i].click = function(event: any, window: any, webContents: any): void {
                browserWindow.webContents.send(contextMenuClicked, {
                  id: `${idPrepend}${(generateContextMenu[i].id || generateContextMenu[i].label)}`
                });
              }
            }
          }
        }
        // save this cleaned template, to re-use
        this.cleanedTemplates[cleanedTemplatesKey] = generateContextMenu;
      }
      generateContextMenu = this.cleanedTemplates[cleanedTemplatesKey];

      Menu.buildFromTemplate(generateContextMenu).popup(browserWindow);
    });
  }

  clearMainBindings(ipcMain: any): void {
    this.cleanedTemplates = {};
    ipcMain.removeAllListeners(contextMenuResponse);
  }
}

const contextMenu = new ContextMenu();
export default contextMenu;