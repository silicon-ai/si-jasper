import {SiElement, html, svg} from '../core/si-element.js'

import {SiIconSet} from './si-iconset.js'

export class SiIcon extends SiElement {
  static get is() { return 'si-icon' }

  static get properties() {
    return {
      icon: String,
      size: Number
    }
  }

  cloneIcon() {
    let [prefix, icon] = this.icon.split(':')
    const iconSet = SiIconSet.registry[prefix]
    if (!iconSet) {
      throw new Error(`icon set '${prefix}' not loaded`)
    }
    return SiIconSet.registry[prefix].cloneIcon(icon)
  }

  render() {
    return html`
      <style>
      :host {
        display: inline-block;
        width: 24px;
        height: 24px;
        position: relative;
        vertical-align: middle;
        fill: currentColor;
        stroke: none;
      }

      svg {
        pointer-events: none;
        display: block;
        width: 100%;
        height: 100%;
      }
      </style>

      ${this.cloneIcon()}
    `
  }
}

SiIcon.define()
