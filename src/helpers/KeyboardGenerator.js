export const KeyboardGenerator = buttons => {
  const elements = []
  const DEFAULT_FONT_COLOR = '#000000'
  const DEFAULT_IS_SILENT_ACTION = false

  const elementToKeyboardJSON = button => ({
    Columns: button.cols,
    Rows: 1,
    Silent: DEFAULT_IS_SILENT_ACTION,
    ActionType: 'reply',
    ActionBody: button.actionBody,
    Text: `<font color='${DEFAULT_FONT_COLOR}'>${button.text}</font>`,
    TextVAlign: 'middle',
    TextHAlign: 'center',
    TextSize: 'large',
  })

  buttons.forEach(button => elements.push(elementToKeyboardJSON(button)))

  return {
    Revision: 1,
    Type: 'keyboard',
    Buttons: elements,
  }
}
