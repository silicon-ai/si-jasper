import {SiElement, html, css} from '../core/si-element.js'


class SiGrid extends SiElement {
  static get is() { return 'si-grid' }
  static get properties() {
    return {
      items: Array,
    }
  }

  get columns() {
    return Array.from(this.querySelectorAll('si-grid-column'))
  }

  static get styles() {
    return css`
      :host {
        display: table;
        background: white;
      }
    `
  }
  render() {
    return html`
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

  static get styles() {
    return css`
      :host {
        display: table-cell;
      }
    `
  }

  render() {
    return html`
      <slot></slot>
    `
  }
}

SiGridColumn.define()
