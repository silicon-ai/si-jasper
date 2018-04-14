import {SiElement, html} from '../core/si-element.js'

import '../core/si-selector.js'

export class SiListBox extends SiElement {
  static get is() { return 'si-listbox' }

  static get properties() {
    return {
      selection: Array,
      multi: Boolean,
    }
  }

  ready() {
    super.ready()

    this.addEventListener('mousedown', (ev) => {
      const items = this.items
      let target = ev.target
      while (target && target.parentNode !== this) target = target.parentNode
      if (!target) return // scroll bar activates mouse down
      const index = items.indexOf(target)
      this.selector.select(index, true)
    })

    this.selector.items = new Proxy(this, {
      get(target, key) { return target.items[key] }
    })
  }

  get items() {
    return Array.from(this.children)
  }

  get selector() {
    return this.shadowRoot.getElementById('selector')
  }

  select(index, flag = true) {
    this.selector.select(index, flag)
  }

  focusItemAt(index) {
    [...this.querySelectorAll('[focused]')].forEach((n) => n.removeAttribute('focused'))
    this.children[index].setAttribute('focused', '')
  }

  _onSelectorSelect(ev) {
    ev.detail.selection.forEach((v, i) => {
      if (this.items[i]) {
        if (v) {
          this.items[i].setAttribute('selected', '')
        } else {
          this.items[i].removeAttribute('selected')
        }
      }
    })
  }

  render() {
    return html`
      <style>
        :host {
          background: #FFF;
          display: flex;
          flex-direction: column;
        }

        ::slotted([selected]) {
          background-color: var(--listbox-selected-background-color, #EEF);
          font-weight: var(--listbox-selected-font-weight, bold);
        }
        ::slotted([focused]) {
          background-color: rgba(0, 0, 0, 0.1);
        }
      </style>

      <si-selector
        id="selector"
        items=${this.items}
        on-select=${this._onSelectorSelect.bind(this)}>
      </si-selector>

      <slot></slot>
    `
  }
}

SiListBox.define()
