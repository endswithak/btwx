import { ArtboardPresetEditorTypes } from './artboardPresetEditor';
import { ArtboardToolTypes } from './artboardTool';
import { CanvasSettingsTypes } from './canvasSettings';
import { ColorEditorTypes } from './colorEditor';
import { ContextMenuTypes } from './contextMenu';
import { DocumentSettingsTypes } from './documentSettings';
import { ViewSettingsTypes } from './viewSettings';
import { EaseEditorTypes } from './easeEditor';
import { GradientEditorTypes } from './gradientEditor';
import { LayerTypes } from './layer';
import { PreviewTypes } from './preview';
import { RightSidebarTypes } from './rightSidebar';
import { ShapeToolTypes } from './shapeTool';
import { TextEditorTypes } from './textEditor';
import { TextSettingsTypes } from './textSettings';
import { TextToolTypes } from './textTool';
import { EventDrawerTypes } from './eventDrawer';
import { FontFamilySelectorTypes } from './fontFamilySelector';
import { KeyBindingsTypes } from './keyBindings';
import { PreferencesTypes } from './preferences';
import { ArtboardPresetsTypes } from './artboardPresets';
import { SessionTypes } from './session';

export type RootAction = ArtboardPresetEditorTypes |
                         ArtboardPresetsTypes |
                         ArtboardToolTypes |
                         CanvasSettingsTypes |
                         ColorEditorTypes |
                         ContextMenuTypes |
                         DocumentSettingsTypes |
                         EaseEditorTypes |
                         GradientEditorTypes |
                         LayerTypes |
                         PreviewTypes |
                         RightSidebarTypes |
                         ShapeToolTypes |
                         TextEditorTypes |
                         TextSettingsTypes |
                         TextToolTypes |
                         EventDrawerTypes |
                         ViewSettingsTypes |
                         FontFamilySelectorTypes |
                         KeyBindingsTypes |
                         PreferencesTypes |
                         SessionTypes;