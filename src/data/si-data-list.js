import {SiElement} from '../core/si-element.js'
import {SiAsync} from '../core/si-async.js'

export class SiDataList extends SiElement {
  static get is() { return 'si-data-list' }

  static get properties() {
    return {
      items: {
        type: Array,
        value() {
          return []
        }
      },
      debounceDuration: {
        type: Number,
        value: 50,
      }
    }
  }

  constructor() {
    super()
    this.items = []
    this._insert = []
    this._remove = []
  }

  async notifyDataChange(notify=true) {
    await SiAsync.debounce(this, this.debounceDuration)

    const insert = this._insert
    const remove = this._remove

    this._insert = []
    this._remove = []

    if (notify) {
      this.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          cancelable: true,
          detail: {
            insert: insert,
            remove: remove
          }
        })
      )
    }
  }

  setItems(items, notify=true) {
    this._remove = this.items.map((item, index) => [item, index])
    this._insert = items.map((item, index) => [item, index])
    this.items = items
    this.notifyDataChange(notify)
  }
  
  getItems() {
    return this.items
  }

  clearItems(notify=true) {
    this._remove = this.items.map((item, index) => [item, index])
    this.items = []
    this.notifyDataChange(notify)
  }

  getItemAt(index) {
    return this.items[index]
  }

  insertItem(item) {
    this.insertItemAt(this.items.length, item)
  }

  insertItemAt(index, item) {
    this.items.splice(index, 0, item)
    this._insert.push([item, index])
    this.notifyDataChange()
  }

  removeItem(item) {
    const index = this.items.indexOf(item)
    if (index > -1) {
      this.removeItemAt(index)
    }
    else {
      console.warn('item not found', item)
    }
  }

  removeItemAt(index) {
    if (index < this.items.length) {
      const [item] = this.items.splice(index, 1)
      this._remove.push([item, index])
      this.notifyDataChange()
    }
  }

  replaceItem(oldVal, newVal) {
    const index = this.items.indexOf(oldVal)
    if (index > -1) {
      this.replaceItemAt(index, newVal)
    }
    else {
      console.warn('item not found', oldVal)
    }
  }

  replaceItemAt(index, item) {
    if (index < this.items.length) {
      const [prev] = this.items.splice(index, 1, item)
      this._insert.push([item, index])
      this._remove.push([prev, index])
      this.notifyDataChange()
    }
  }

  sort(sorter) {
    if (!sorter) sorter = (a, b) => a > b ? 1 : 0
    this._remove = this.items.map((item, index) => [item, index])
    this.items.sort(sorter)
    this._insert = this.items.map((item, index) => [item, index])
    this.notifyDataChange()
  }

  filter(filter) {
    return this.items.filter(filter)
  }

  map(mapper) {
    return this.items.map(mapper)
  }

  reduce(...args) {
    return this.items.reduce(...args)
  }
}

SiDataList.define()
