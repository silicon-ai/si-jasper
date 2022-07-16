import { SiAsync } from '../core/si-async.js'
import {SiElement, html, css} from '../core/si-element.js'

import '../view/si-tabs.js'
import '../view/si-tab.js'

export class SiEditor extends SiElement {
  static get is() { return 'si-editor' }
  static get properties() {
    return {
      language: String,
      models: {
        type: Object,
        value() { return {} }
      },
      tabs: {
        type: Array,
        value() { return [] }
      }
    }
  }
  static get styles() {
    return css`
    @import "node_modules/monaco-editor/min/vs/editor/editor.main.css";

    :host {
      width: 100%;
      display: block;
      position: relative;
    }

    #content {
      position: absolute;
      margin-top: 35px;
      bottom: 0px;
      top: 0px;
      left: 0px;
      right: 0px;
    }

    si-tabs {
      min-height: 35px;
      background: #334;
      color: white;
      margin-left: 0px;
    }

    si-tab {
      padding: 10px;
      height: 35px;
    }

    si-tab[selected] {
      height: 35px;
      padding: 10px;
      background: #252535;
    }
    `
  }

  async ready() {
    super.ready()
    this.tabs = []
    this.models = {}

    await SiAsync.yieldThen

    let content = this.$['content']
    monaco.editor.defineTheme('si-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [{ background: '333344' }],
      colors: {
        'editor.background': '#252535',
        'editor.lineHighlightBackground': '#252535',
        'dropdown.background': '#333344'
      }
    })

    this.editor = monaco.editor.create(content, {
      value: "",
      language: this.language,
      theme: 'si-dark'
    })

    window.addEventListener("resize", () => {
      this.editor.layout()
    })
  }

  hasModel(name) {
    return name in this.models
  }

  layout() {
    this.editor.layout()
  }

  openTab(name, content) {
    let newModel = monaco.editor.createModel(content, this.language, name)
    let oldModel = this.editor.getModel()
    this.models[oldModel.uri] = oldModel
    this.models[newModel.uri] = newModel
    this.editor.setModel(newModel)
    this.tabs = [...this.tabs, {name: name, content: content, model: newModel}]
    this.$['tabs'].selected = this.tabs.length - 1
  }

  switchTab(id) {
    let model = this.models[id]
    if (model == null) {
      console.log(`Unknown model ${id}`)
      return
    }
    this.editor.setModel(model)
  }

  setValue(content) {
    this.editor.setValue(content)
  }

  getValue() {
    return this.editor.getValue()
  }

  blur() {
    this.editor.blur()
    super.blur()
  }

  focus() {
    super.focus()
    this.editor.focus()
  }

  _onClickTab(ev) {
    let tabs = this.$['tabs']
    let target = ev.target
    while (target && target.parentNode !== tabs) target = target.parentNode
    tabs.selected = target.index
    this.switchTab(target.name)
  }

  render() {
    return html`
      <si-tabs id="tabs" .showSlide=${false}>
      ${this.tabs.map((item, index) => html`
        <si-tab
          @click=${this._onClickTab.bind(this)}
          .index=${index}
          .name=${item.name}>${item.name}</si-tab>
      `)}
      </si-tabs>
      <div id="content"></div>
    `
  }
}

SiEditor.define()