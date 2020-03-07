import {SiElement, html, css} from '../core/si-element.js'

import '../core/si-selector.js'
import './si-checkbox.js'

class SiFacet extends SiElement {
  static get is() { return "si-facet" }
  static get properties() {
    return {
      buckets: {
        type: Array,
        observer: '_bucketsChanged'
      },
      format: {
        type: Function,
        value() { return (_ => _.key) }
      },
      items: {
        type: Array,
        value() {
          return []
        }
      },
      selected: Array,
      selection: {
        type: Array,
        value() { return [ ] }
      }
    }
  }

  _bucketsChanged(newItems, oldItems) {
    console.log('_bucketsChanged', newItems, oldItems)
    const notFound = [ ]
    const toSelect = [ ]
    this.selection.forEach((item) => {
      const found = newItems.find(_ => _.key == item.key)
      if (found)
        toSelect.push(found)
      else
        notFound.push(item)
    })
    const items = newItems.concat(notFound)
    this.items = items
    toSelect.concat(notFound).forEach((item) => {
      this.$.selector.selectIndex(items.indexOf(item))
    })
  }

  _toggleSelection(i, checked) {
    this.$.selector.select(i, checked)
    this.selection = (this.selected || []).slice()
  }

  _isSelected(item) {
    return this.$.selector.isSelected(item)
  }

  _onSelect(ev) {
    console.log('_onSelect', ev.detail)
    this.selected = ev.detail.selectedItems
    this.selection = this.selected.slice()
    ev.stopPropagation()
    this.dispatchEvent(
      new CustomEvent('select', {
        bubbles: true,
        detail: this.selection
      })
    )
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .si-badge {
        vertical-align: middle;
        display: inline-block;
        height: 16px;
        border-radius: 20px;
        font-weight: 600;
        background: #667;
        color: white;
        font-size: 11px;
        box-sizing: border-box;
        padding: 2px 4px;
      }
    `
  }

  render() {
    return html`
      <si-selector id="selector"
        items=${this.items}
        @select=${this._onSelect.bind(this)}
        multi toggle>
      </si-selector>

      <slot name="header"></slot>

      ${this.items.map((item, i) => html`
        <si-hbox>
          <div flex>
            <si-checkbox
              ?checked=${this._isSelected(item)}
              on-change=${(ev) => this._toggleSelection(i, ev.detail.checked)}>
              ${this.format(item)}
            </si-checkbox>
          </div>
          <div class="si-badge">${item.doc_count}</div>
        </si-hbox>
      `)}
    `
  }
}

SiFacet.define()
