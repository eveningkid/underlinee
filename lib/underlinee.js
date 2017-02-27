'use babel'

import { CompositeDisposable } from 'atom'

export default {
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'underlinee:generate-comment': () => this.insertComment()
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  /**
   * Get the options we need to generate a comment from a selected text.
   * @param {String} selection - Selected text
   * @return {Object} Comment options
   */
  getCommentOptionsForSelection(selection) {
    const nbOfCharactersToDelete = selection.indexOf(' ')
    const commentStyle = selection.substr(0, nbOfCharactersToDelete)

    return {
      nbOfCharactersToDelete,
      commentStyle,
    }
  },

  /**
   * Return selected text from the current instance of an editor.
   * @param {TextEditor} editor - TextEditor instance
   * @return {String} Selected text
   */
  getSelectedText(editor) {
    let selection = editor.getSelectedText()

    // If there's no selected text yet,
    // we manually select the entire line
    if (!selection.length) {
      editor.moveToBeginningOfLine()
      editor.selectToEndOfLine()
      selection = editor.getSelectedText()
    }

    // Trim the selected text
    return selection.trim()
  },

  /**
   * Generate comment when given an editor instance.
   * @param {TextEditor} editor - TextEditor instance
   * @return {String} Generated comment
   */
  generateComment(editor) {
    const selection = this.getSelectedText(editor)

    const {
      nbOfCharactersToDelete,
      commentStyle,
    } = this.getCommentOptionsForSelection(selection)

    const decorator = '='.repeat((selection.length - 1) - nbOfCharactersToDelete)

    return `${commentStyle} ${decorator}`
  },

  /**
   * Insert according comment to the active text editor instance.
   */
  insertComment() {
    let editor

    if (editor = atom.workspace.getActiveTextEditor()) {
      const comment = this.generateComment(editor)

      editor.insertNewlineBelow()
      editor.insertText(comment)
    }
  }
}
