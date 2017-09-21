'use babel';

// import TabberView from './tabber-view';
import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.commands.add('atom-text-editor', {
      'tabber:tab4': () => {
        this.setTabLength(4)
      },
      'tabber:tab2': () => {
        this.setTabLength(2)
      }
    }));
  },
  deactivate() {
    this.subscriptions.dispose()
  },

  setTabLength(num) {
    editors = atom.workspace.getTextEditors();
    // editor.setTabLength(num);
    editors.forEach((editor) => {
      editor.setTabLength(num);
    })
  }
};
