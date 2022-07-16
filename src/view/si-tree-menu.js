import {SiElement, html, css} from '../core/si-element.js'

import '../core/si-ajax.js'
import './si-expander.js'
import './si-icon.js'
import './si-icons.js'

class SiTreeMenu extends SiElement {
  static get is() { return 'si-tree-menu' }

  static get properties() {
    return {
      rootItem: {
        type: Object,
        value() {
          return { children: [] }
        }
      },
      selectedItem: Object,
      nodeRenderer: {
        type: Function,
        value() {
          return (node) => html`${node.label}`
        }
      }
    }
  }

  _onTreeClick(ev) {
    console.log('si-tree-menu::_onTreeClick', ev.target, ev.currentTarget)

    if (!ev.target.item) return
    const selected = Array.from(this.shadowRoot.querySelectorAll('.tree-item[selected]'))
    selected.forEach((item) => item.removeAttribute('selected'))

    ev.target.parentNode.setAttribute('selected', '')

    let item = ev.target.item
    this.selectedItem = item

    this.dispatchEvent(new CustomEvent('tree-select', {
      bubbles: true,
      detail: item
    }))
  }

  renderNode(node) {
    return this.nodeRenderer(node)
  }

  renderTree(node) {
    return html`
      <si-expander>
        <si-hbox slot="head" class="tree-label">
          <si-icon icon="icons:arrow-drop-down"></si-icon>
          <div .item=${node} flex>${this.renderNode(node)}</div>
        </si-hbox>
        ${node.children.map((item) => {
          if (item.children.length > 0) {
            return this.renderTree(item)
          }
          else {
            return html`
              <si-hbox class="tree-item">
                <div flex .item=${item}>${this.renderNode(item)}</div>
              </si-hbox>
            `
          }
        })}
      </si-expander>
    `
  }

  static get styles() {
    return css`
      .badge {
        align-self: center;
        vertical-align: middle;
        display: inline-block;
        height: 16px;
        line-height: 14px;
        border-radius: 20px;
        font-weight: 600;
        background: var(--primary-dark-background);
        color: var(--primary-dark-foreground);
        font-size: 11px;
        box-sizing: border-box;
        padding: 2px 4px;
      }

      .tree-item {
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        background: var(--secondary-background);
        padding-left: 5px;
        padding-right: 5px;
      }
      .tree-item:hover, .tree-label:hover {
        filter: brightness(90%);
      }

      .tree-item[selected] {
        background-color: var(--secondary-dark-background);
        color: var(--primary-dark-foreground);
      }

      .tree-label {
        cursor: pointer;
        font-variant: small-caps;
        transition: all 0.3s ease-in-out;
        background: var(--secondary-background);
        padding-left: 5px;
      }

      si-expander si-icon {
        transform: rotate(-90deg);
      }

      si-expander[opened] > si-hbox > si-icon {
        transform: rotate(0deg);
      }
    `
  }

  render() {
    return html`
      <div style="margin-right: 10px" @click=${this._onTreeClick.bind(this)}>
        ${this.rootItem.children.map((item) => this.renderTree(item))}
      </div>
    `
  }
}

SiTreeMenu.define()
