import { ArtboardPresetEditorTypes } from './artboardPresetEditor';
import { ArtboardToolTypes } from './artboardTool';
import { CanvasSettingsTypes } from './canvasSettings';
import { ColorEditorTypes } from './colorEditor';
import { ContextMenuTypes } from './contextMenu';
import { DocumentSettingsTypes } from './documentSettings';
import { ViewSettingsTypes } from './viewSettings';
import { EaseEditorTypes } from './easeEditor';
import { GradientEditorTypes } from './gradientEditor';
import { InsertKnobTypes } from './insertKnob';
import { LayerTypes } from './layer';
import { PreviewTypes } from './preview';
import { RightSidebarTypes } from './rightSidebar';
import { ShapeToolTypes } from './shapeTool';
import { TextEditorTypes } from './textEditor';
import { TextSettingsTypes } from './textSettings';
import { TextToolTypes } from './textTool';
import { TweenDrawerTypes } from './tweenDrawer';
import { SelectionTypes } from './selection';

export type RootAction = ArtboardPresetEditorTypes |
                         ArtboardToolTypes |
                         CanvasSettingsTypes |
                         ColorEditorTypes |
                         ContextMenuTypes |
                         DocumentSettingsTypes |
                         EaseEditorTypes |
                         GradientEditorTypes |
                         InsertKnobTypes |
                         LayerTypes |
                         PreviewTypes |
                         RightSidebarTypes |
                         ShapeToolTypes |
                         TextEditorTypes |
                         TextSettingsTypes |
                         TextToolTypes |
                         TweenDrawerTypes |
                         ViewSettingsTypes |
                         SelectionTypes;