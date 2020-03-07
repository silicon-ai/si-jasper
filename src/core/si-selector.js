import '../core/si-boot.js'

import {SiElement, html, css} from '../core/si-element.js'
import {SiAsync} from '../core/si-async.js'

class SiSelector extends SiElement {

  static get is() { return 'si-selector' }

  static get properties() {
    return {
      multi: Boolean,
      items: Array,
    }
  }

  constructor() {
    super()
    this._vector = []
  }

  select(index, flag = true) {
    console.log("si-selector::select", index, flag)
    if (typeof index !== 'number') {
      if (!this.items.includes(index)) return
      index = this.items.indexOf(index)
    }
    this.selectIndex(index, flag)
  }

  selectItem(item, flag = true) {
    const index = this.items.indexOf(item)
    if (index > -1) this.select(index, flag)
  }

  selectIndex(index, flag = true) {
    console.log('si-selector::selectIndex', index, flag, this._vector)
    if (this._vector[index] === Boolean(flag)) return
    if (!this.multi) this.clearSelection()
    this._vector[index] = flag
    this._dispatchChangeEvent()
  }

  isSelected(item) {
    const index = typeof item === 'number' ? item : this.items.indexOf(item)
    return Boolean(this._vector[index])
  }

  clearSelection(notify=true) {
    for (const i in this._vector) this._vector[i] = false
    if (notify) this._dispatchChangeEvent()
  }

  selectAll(notify=true) {
    for (const i in this.items) this._vector[i] = true
    if (notify) this._dispatchChangeEvent()
  }

  get selectedItems() {
    return this.selected.map((i) => this.items[i])
  }

  get selected() {
    return this._vector.reduce((a, v, i) => v ? a.concat([i]) : a, [])
  }

  async _dispatchChangeEvent() {
    await SiAsync.debounce(this)
    console.log('si-selector::_dispatchChangeEvent')
    this.dispatchEvent(
      new CustomEvent('select', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          selection: [...this._vector],
          selectedItems: this.selectedItems
        }
      })
    )
  }

  static get styles() {
    return css`
      :host { display: none }
    `
  }
}

SiSelector.define()
