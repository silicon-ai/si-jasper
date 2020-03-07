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
      selected: {
        type: Number,
        observer(val, old) {
          console.log('selectedItem::observer', this, val, old)
          if (val === undefined || val === -1) this.clearSelection()
        }
      },
      selectedItem: {
        type: Object,
      }
    }
  }

  ready() {
    this._buffer = []
  }

  get items() {
    return [...this.querySelectorAll('*')].filter((n) =>
      n.label !== undefined || n.hasAttribute('label') || !Boolean(n.children.length)
    )
  }

  clearSelection() {
    this.$.input.value = ''
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
    this._setSelectedItem(item)
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

    const [found] = values.filter((v) =>
      v.substr(0, match.length).toLowerCase() == match
    )

    if (found) {
      items.forEach((n) => n.removeAttribute('focused'))
      items[values.indexOf(found)].setAttribute('focused', '')
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
    return css`
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
        top: 32px;
        left: 5px;
        right: 5px;
        z-index: 9;
      }

      #input, #container {
        cursor: pointer !important;
      }

      ${layoutStyles}
      ${shadowStyles}
    `
  }

  render() {
    return html`
      <div id="container" class="layout horizontal">
        <si-input class="flex" id="input"
          tabindex="0"
          placeholder$="${this.label}"
          readonly=${true}
          autocomplete="off"
          autocorrect="off"
          autocapitalize="none"
          on-blur=${this._onBlur.bind(this)}
          on-focus=${this._onFocus.bind(this)}
          on-keydown=${this._onKeyDown.bind(this)}>
          <si-icon
            slot="suffix"
            on-click=${this._onIconClick.bind(this)}
            icon="icons:arrow-drop-down">
          </si-icon>
        </si-input>
      </div>
      <div id="dropdown" class="shadow-elevation-2" on-select=${this._onSelect.bind(this)}>
        <slot name="dropdown-content"></slot>
      </div>
    `
  }
}

SiDropdownMenu.define()
