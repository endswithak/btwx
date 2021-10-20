![icon](assets/icons/128x128.png)

# btwx

Product Designer animation and prototyping tool.

## How It Works

Events and tweens are the bread and butter of btwx. Events can be added to any layer aside from groups and have four main properties: trigger layer, event listener, origin, and destination. When the event listener (e.g. click, double click, drag) is initiated on the trigger layer, any layers with the same name and type shared between the origin and destination will animate from the origin layer state to the destination layer state.

Comprising each event are layer property tweens (e.g. x, y, width, height), which are automatically added when any origin layer property does not match its’ corresponding destination layer property. Tweens can be customized in a multitude of ways depending on the property. The most basic options include duration, delay, ease, repeat, and repeat yoyo. When layer properties match, wiggle tweens can be added. Wiggle tweens work just like regular tweens but with an added strength option. In general, the larger the difference between the property and the strength, the stronger the wiggle.

![Adding Event](screenshots/btwx-0.png)

Adding Event

![Events](screenshots/btwx-1.png)

Events

![Tweens](screenshots/btwx-2.png)

Tweens

![Tween Handles](screenshots/btwx-3.png)

Tween Handles

![Ease Selector](screenshots/btwx-4.png)

Ease Selector

![Ease Options](screenshots/btwx-5.png)

Ease Options

![Wiggle Tween](screenshots/btwx-6.png)

Wiggle Tween

![Text Tween](screenshots/btwx-7.png)

Text Tween

![Scramble Text Tween](screenshots/btwx-8.png)

Scramble Text Tween

![Group Merged Tweens](screenshots/btwx-9.png)

Group Merged Tweens

![Group Scroll](screenshots/btwx-10.png)

Group Scroll

![Preview](screenshots/btwx-11.png)

Preview

![Preview Frame](screenshots/btwx-12.png)

Preview Frame

![Screen Recording](screenshots/btwx-13.png)

Screen Recording

![Search](screenshots/btwx-14.png)

Search

![Preferences](screenshots/btwx-15.png)

Preferences

![Key Bindings](screenshots/btwx-16.png)

Key Bindings

![Light Theme](screenshots/btwx-17.png)

Light Theme

## Supported Event Listeners

- Mouse down
- Mouse up
- Mouse drag
- Mouse enter
- Mouse leave
- Click
- Double click
- Right click

## Supported Tween Properties

- X
- Y
- Rotation
- Width
- Height
- Scale X (horizontal flip)
- Scale Y (vertical flip)
- Shape
  - With gsap morph svg plugin
- Fill
  - Color
  - Gradient
    - Origin
      - X
      - Y
    - Destination
      - X
      - Y
- Stroke
  - Color
  - Gradient
    - Origin
      - X
      - Y
    - Destination
      - X
      - Y
- Stroke width
- Dash offset
- Dash array
  - Width
  - Gap
- Shadow
  - Color
  - Blur
  - Offset
    - X
    - Y
- Opacity
- Blur
- Font size
- Font weight
- Letterspacing
- Leading
- Text
  - With gsap text and scramble text plugins

## Other Features

- Basic vector editing with boolean and mask support
- Smart snap and measure
- Device frames
  - iPhone
  - Apple Watch
  - iPad
- Screen recording
- Auto save
- Sketch support - [Plugin](https://github.com/endswithak/btwx-sketch-plugin)
- Custom key bindings

## Getting Started

- [Download btwx](../../releases/v1.3.0-beta) (Only tested on macOS)
- Open btwx
- Add two or more artboards with child layers of the same name and type
- Add event to child layer
- Edit and preview event

## Built with

- [ERB](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
- [GSAP](https://greensock.com/)
- [paper.js](https://github.com/paperjs/paper.js)