import './si-array.js'

import {SiElement, html, css} from './si-element.js'
import {SiAsync} from './si-async.js'

export class SiSelector extends SiElement {

  static get is() { return 'si-selector' }

  static get properties() {
    return {
      multi: Boolean,
      items: Array,
      selection: {
        type: Array,
        value() { return [] }
      }
    }
  }

  constructor() {
    super()
    this._vector = []
  }

  ready() {
    if (this.selection.length > 0) {
      this.selection.forEach((index) => {
        this.select(index, true)
      })
    }
  }

  select(index, flag = true, notify = true) {
    console.log("select", index, flag, notify, this.items)
    if (typeof index !== 'number') {
      if (!this.items.includes(index)) return
      index = this.items.indexOf(index)
    }
    this.selectIndex(index, flag, notify)
  }

  selectItem(item, flag = true, notify = true) {
    const index = this.items.indexOf(item)
    if (index > -1) this.select(index, flag, notify)
  }

  selectIndex(index, flag = true, notify = true) {
    if (this._vector[index] === Boolean(flag)) return
    if (!this.multi) this.clearSelection()
    this._vector[index] = flag
    if (notify) this._dispatchChangeEvent()
  }

  isSelected(item, keyFun) {
    let index = -1
    if (typeof item === 'number') {
      index = item
    }
    else if (keyFun) {
      const items = this.items.map(keyFun)
      index = items.indexOf(keyFun(item))
    }
    else {
      index = this.items.indexOf(item)
    }
    if (index < 0) return false
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
    const selectedIndices = []
    this._vector.forEach((v, i) => { if (v) selectedIndices.push(i) })
    this.dispatchEvent(
      new CustomEvent('select', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          selection: [...this._vector],
          selectedItems: this.selectedItems,
          selectedIndices: selectedIndices
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
