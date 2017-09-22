'use babel';

import { CompositeDisposable } from 'atom';

const TAB_2 = 2;
const TAB_4 = 4;
const CALCULATE_LINE_MAX = 10;
const IS_TAB_4_RATIO = 0.8;
const INIT_DELAY = 2000;


function  getHeadWhiteSpacesLength(text = '') {
  return text.match(/^\s*/)[0].length;
}

function getTabLength(editor) {
  const lines = editor.getBuffer().getLines().filter(line => line && line[0] === ' ');
  const len = Math.min(lines.length, CALCULATE_LINE_MAX);
  let tab2Count = 0;
  let tab4Count = 0;
  for(let i = 0; i < len; ++i) {
    const whiteSpacesLength = getHeadWhiteSpacesLength(lines[i]);
    if (whiteSpacesLength === 0) {
      continue;
    }
    if (whiteSpacesLength % TAB_4 === 0) {
      tab4Count++;
    }
    if (whiteSpacesLength % TAB_2 === 0) {
      tab2Count++;
    }
  }
  if (tab4Count >= tab2Count * IS_TAB_4_RATIO) {
    return TAB_4;
  }
  return TAB_2;
}

function setTabLength(editor, tabLength) {
  editor.setTabLength(tabLength);
}

function updateEditorTabLength(editor) {
  const tabLength = getTabLength(editor);
  editor.setTabLength(tabLength);
  setTabLength(editor, tabLength);
}

function updateAllEditorsTabLength() {
  atom.workspace.getTextEditors().forEach((editor) => {
    updateEditorTabLength(editor)
  });
}

function setActiveEditorTabLength(tabLength) {
  setTabLength(atom.workspace.getActiveTextEditor(), tabLength);
}

export default {
  subscriptions: null,

  activate(state) {
    this.init();
    this.addListeners();
    this.addCommands();
  },

  init() {
    setTimeout(() => {
      updateAllEditorsTabLength();
    }, INIT_DELAY);
  },

  addListeners() {
    atom.workspace.onDidAddTextEditor((editor) => {
      setTimeout(() => {
        updateEditorTabLength(editor.textEditor);
      }, INIT_DELAY);
    });
  },

  addCommands() {
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'tabber:auto-all': () => {
        updateAllEditorsTabLength();
      },
      'tabber:tab4': () => {
        setActiveEditorTabLength(4);
      },
      'tabber:tab2': () => {
        setActiveEditorTabLength(2);
      }
    }));
  },

  deactivate() {
    this.subscriptions.dispose()
  },

};
