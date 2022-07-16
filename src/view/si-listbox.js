import {SiElement, html, css} from '../core/si-element.js'

import {SiSelector} from '../core/si-selector.js'

class SiListBox extends SiElement {
  static get is() { return 'si-listbox' }

  static get properties() {
    return {
      selection: {
        type: Array,
        observer(newVal, oldVal) {
          this.selector.selection = newVal
        }
      },
      multi: Boolean,
    }
  }

  constructor() {
    super()
    this._selector = new SiSelector()
  }

  ready() {
    super.ready()
    this.shadowRoot.appendChild(this._selector)

    this.addEventListener('mousedown', (ev) => {
      const items = this.items
      let target = ev.target
      while (target && target.parentNode != this)
        target = target.parentNode
      if (!target) return // scroll bar activates mouse down
      const index = items.indexOf(target)
      this.selector.select(index, true)
    })

    this.selector.items = new Proxy(this, {
      get(target, key) { return target.items[key] }
    })

    this.selector.addEventListener('select', this._onSelectorSelect.bind(this))

    this.items.forEach((item, i) => {
      if (item.hasAttribute('selected')) this.select(i, true)
    })
  }

  get items() {
    return Array.from(this.querySelectorAll('si-item'))
  }

  get selector() {
    return this._selector
    //return this.shadowRoot.getElementById('selector')
  }

  select(index, flag = true) {
    this.selector.select(index, flag)
  }

  clearSelection(notify = true) {
    if (!notify) {
      this.items.forEach((item) => item.removeAttribute('selected'))
    }
    this.selector.clearSelection(notify)
  }

  focusItemAt(index) {
    [...this.querySelectorAll('[focused]')].forEach((n) => n.removeAttribute('focused'))
    this.children[index].setAttribute('focused', '')
  }

  _onSelectorSelect(ev) {
    this.items.forEach((item, i) => {
      const v = ev.detail.selection[i]
      if (item) {
        if (v) {
          item.setAttribute('selected', '')
        }
        else if (item.hasAttribute('selected')) {
          item.removeAttribute('selected')
        }
      }
    })
  }

  static get styles() {
    return css`
      :host {
        background-color: var(--listbox-background, #FFF);
      }

      ::slotted(*) {
        background-color: var(--listbox-background, #FFF);
      }
      ::slotted([selected]) {
        color: var(--listbox-selected-color, black);
        background-color: var(--listbox-selected-background-color, #EEF);
        font-weight: var(--listbox-selected-font-weight, bold);
      }
      ::slotted([focused]) {
        background-color: rgba(0, 0, 0, 0.1);
      }
    `
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

SiListBox.define()
