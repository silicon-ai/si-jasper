import {SiElement, html, css} from '../core/si-element.js'
import {layoutStyles, shadowStyles} from './si-styles.js'
import {SiAsync} from '../core/si-async.js'

import './si-icons.js'
import './si-icon.js'

class SiDropdownMenu extends SiElement {
  static get is() { return 'si-dropdown-menu' }
  static get properties() {
    return {
      label: String,
      placeholder: String,
      selected: {
        type: Number,
        observer(val, old) {
          if (val === undefined || val === -1) this.clearSelection()
        }
      },
      selectedItem: Object,
      _value: Object
    }
  }

  ready() {
    this._buffer = []
    if (this.selected !== null && this.selected !== undefined) {
      const listbox = this.querySelector('si-listbox')
      if (this.selected == -1) {
        listbox.clearSelection()
      }
      else {
        listbox.selection = [this.selected]
        //listbox.select(this.selected)
      }
    }
  }

  get items() {
    return [...this.querySelectorAll('*')].filter((n) =>
      n.label !== undefined || n.hasAttribute('label') || !Boolean(n.children.length)
    )
  }

  select(index, flag = true) {
    const listbox = this.querySelector('si-listbox')
    listbox.clearSelection()
    listbox.select(index, flag)
  }

  clearSelection() {
    this.$.input.value = ''
    this.value = undefined
    const listbox = this.querySelector('si-listbox')
    listbox.clearSelection()
  }

  _onFocus(ev) {
    this.$.dropdown.setAttribute('open', '')
  }

  async _onBlur(ev) {
    await SiAsync.yieldThen
    this.$.dropdown.removeAttribute('open')
  }

  _onSelect(ev) {
    console.log('_onSelect', ev)
    ev.stopPropagation()
    this.$.dropdown.removeAttribute('open')
    this._clearFocused()
    const item = ev.detail.selectedItems[0]
    if (item !== undefined) this._setSelectedItem(item)
  }

  _setSelectedItem(item) {
    const value = item.label || item.getAttribute('label') || item.textContent.trim()
    this.$.input.value = value
    this.selectedItem = item
    const index = Array.from(item.parentNode.children).indexOf(item)
    this.dispatchEvent(
      new CustomEvent('select', {
        bubbles: true,
        detail: { value, item, index }
      })
    )
  }

  get value() {
    return this.$.input.value
  }

  set value(value) {
    this._value = value
  }

  async _onKeyDown(ev) {
    if (ev.key == 'Escape') {
      this.$.input.blur()
      return
    }

    if (ev.key.length > 1 || ev.ctrlKey) return
    ev.preventDefault()

    this._buffer.push(ev.key.toLowerCase())

    const items = this.items
    const match = this._buffer.join('').toLowerCase()
    const values = items.map(n => n.textContent.trim())

    const [found] = values.filter((v) => {
      let frag = v.substring(0, match.length).toLowerCase()
      return frag === match
    })

    if (found) {
      items.forEach((n) => n.removeAttribute('focused'))
      items[values.indexOf(found)].setAttribute('focused', '')
      items[values.indexOf(found)].scrollIntoView()
    }

    await SiAsync.debounce(this, 500)
    this._buffer = []
  }

  _clearFocused() {
    this.items.forEach((n) => n.removeAttribute('focused'))
  }

  _onIconClick(ev) {
    this.$.input.focus()
    ev.stopPropagation()
  }

  static get styles() {
    return [layoutStyles, shadowStyles, css`
      :host {
        position: relative;
        display: inline-block;
      }

      #dropdown {
        display: none;
        box-sizing: border-box;
      }

      #dropdown[open] {
        display: block;
        position: absolute;
        left: 5px;
        right: 5px;
        z-index: 9;
      }

      #input {
        cursor: pointer !important;
      }

      #input > si-icon {
        height: inherit;
        align-self: center;
      }
    `]
  }

  render() {
    return html`
      <si-input id="input"
        tabindex="0"
        placeholder=${this.label || this.placeholder}
        readonly=${true}
        autocomplete="off"
        autocorrect="off"
        autocapitalize="none"
        @blur=${this._onBlur.bind(this)}
        @focus=${this._onFocus.bind(this)}
        .value=${this._value}
        @keydown=${this._onKeyDown.bind(this)}>
        <slot name="label" slot="label"></slot>
        <si-icon
          slot="suffix"
          @click=${this._onIconClick.bind(this)}
          icon="icons:arrow-drop-down">
        </si-icon>
      </si-input>
      <div id="dropdown" class="shadow-elevation-2" @select=${this._onSelect.bind(this)}>
        <slot></slot>
      </div>
    `
  }
}

SiDropdownMenu.define()
