import {SiElement, html, css} from '../core/si-element.js'
import {shadowStyles} from './si-styles.js'

import './si-icons.js'
import './si-icon-button.js'
import './si-flexbox.js'
import './si-listbox.js'
import './si-item.js'
import { SiAsync } from '../core/si-async.js'


export class SiListAssign extends SiElement {
  static get is() { return 'si-list-assign' }

  static get properties() {
    return {
      source: {
        type: Array,
        value() { return [] },
        observer: '_update'
      },
      target: {
        type: Array,
        value() { return [] },
        observer: '_update'
      },
      left: {
        type: Array,
        value() { return [] }
      },
      right: {
        type: Array,
        value() { return [] }
      },
      itemRenderer: {
        type: Function,
        value() {
          return (item) => html`${item}`
        }
      }
    }
  }

  async _update() {
    await SiAsync.debounce(this)
    console.log("_update", this.source, this.target)
    this.left = this.source.filter((item) => !this.target.includes(item))
    this.right = [...this.target]
  }

  renderItem(item) {
    return this.itemRenderer(item)
  }

  _onAssign(ev) {
    const oldItems = this.targetList.items.map(_ => _.data)
    const newItems = this.sourceList.selector.selectedItems
      .map(_ => _.data)
      .filter(_ => !oldItems.includes(_))

    this.right = [...oldItems, ...newItems]
    this.left = this.source.filter((item) => !this.right.includes(item))

    console.log('_onAssign::selectedItems', newItems)
    this.sourceList.selector.clearSelection()
    this.targetList.selector.selectIndex(this.right.indexOf(newItems[0]))

    this.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      cancelable: true,
      detail: {
        selectedItems: this.right
      }
    }))
  }

  get sourceList() {
    return this.$['source-list']
  }
  get targetList() {
    return this.$['target-list']
  }

  _onUnassign(ev) {
    const selectedItems = this.targetList.selector.selectedItems
    const toRemove = selectedItems.map(_ => _.data)
    console.log('_onUnassign::selectedItems', selectedItems)

    this.right = this.right.filter((item) => !toRemove.includes(item))
    this.left = this.source.filter((item) => !this.right.includes(item))

    this.targetList.selector.clearSelection()
    this.sourceList.selector.selectIndex(this.left.indexOf(toRemove[0]))

    this.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      cancelable: true,
      detail: {
        selectedItems: this.right
      }
    }))
  }

  static get styles() {
    return css`
    :host {
      background: var(--primary-dark-background);
      display: block;
      color: var(--primary-dark-foreground);
      position: relative;
      height: inherit;
    }

    ::-webkit-scrollbar {
      width: 12px;
      background: var(--primary-dark-background);
    }
    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.3); 
    }
    ::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.8); 
      background: var(--secondary-dark-background);
    }
 
    #control {
      min-width: 25px;
      background: var(--tertiary-dark-background);
    }
    
    si-listbox {
      height: 100%;
      overflow: auto;
    }

    ${shadowStyles}
    `
  }

  render() {
    return html`
    <si-hbox style="height: 100%; position: relative;">
      <si-listbox flex id="source-list" class="shadow-elevation-1">
        ${this.left.map((item) => this.renderItem(item))}
      </si-listbox>
      <si-vbox id="control">
        <div flex></div>
        <si-icon-button icon="icons:chevron-right" @click=${this._onAssign.bind(this)}></si-icon-button>
        <si-icon-button icon="icons:chevron-left" @click=${this._onUnassign.bind(this)}></si-icon-button>
        <div flex></div>
      </si-vbox>
      <si-listbox flex id="target-list" class="shadow-elevation-1">
        ${this.right.map((item) => this.renderItem(item))}
      </si-listbox>
    </si-hbox>
    `
  }
}

SiListAssign.define()

