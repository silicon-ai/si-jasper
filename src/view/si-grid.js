import {SiElement, html} from '../core/si-element.js'
import {layoutStyles, shadowStyles} from './si-styles.js'


export class SiGrid extends SiElement {
  static get is() { return 'si-grid' }
  static get properties() {
    return {
      items: Array,
    }
  }
  ready() {
    super.ready()
  }

  get columns() {
    return Array.from(this.querySelectorAll('si-grid-column'))
  }

  render() {
    return html`
      <style>
      :host {
        display: table;
        background: white;
      }
      </style>

      <thead>
        <tr><slot></slot></tr>
      </thead>
      <tbody>
        ${this.items.map((item) => html`
          <tr>
            ${this.columns.map((col, x) => html`
              <td>${col.cellRenderer(item)}</td>
            `)}
          </tr>
        `)}
      </tbody>
    `
  }
}

SiGrid.define()


class SiGridColumn extends SiElement {
  static get is() { return 'si-grid-column' }
  static get properties() {
    return {
      cellRenderer: {
        type: Function
      }
    }
  }
  ready() {
    super.ready()
  }
  render() {
    return html`
      <style>
        :host {
          display: table-cell;
        }
      </style>
      <slot></slot>
    `
  }
}

SiGridColumn.define()
