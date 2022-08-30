import {SiElement, render} from '../core/si-element.js'

const __registry = { }

export class SiIconSet extends SiElement {
  static get is() { return 'si-iconset' }
  static get properties() {
    return {
      name: String,
      size: Number
    }
  }

  static get registry() {
    return __registry
  }

  ready() {
    SiIconSet.registry[this.name] = this
  }

  render() {
    this.style.display = 'none'
  }

  static register(name, size, icons) {
    let iconSet = document.createElement('si-iconset')
    iconSet.name = name
    iconSet.size = size || 24
    render(icons, iconSet)
    document.head.appendChild(iconSet)
    return iconSet
  }

  cloneIcon(name) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  
    svg.setAttribute('viewBox', `0 0 ${this.size} ${this.size}`)
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false');

    svg.style.cssText = 'pointer-events: none; display: block; width: 100%; height: 100%;'

    const master = this.shadowRoot.getElementById(name)
    if (!master) {
      console.warn(`no icon for '${name}' found in iconset`)
      return svg
    }

    let icon = master.cloneNode(true)
    icon.removeAttribute('id')
    svg.appendChild(icon)

    return svg
  }

  applyIcon(element, name) {
    let icon = this.cloneIcon(name)

    this.removeIcon(element)

    let root = element.shadowRoot || element

    root.insertBefore(icon, root.childNodes[0])
    element._svgIcon = icon
  }

  removeIcon(element) {
    if (element._svgIcon && element._svgIcon.parentNode) {
      element._svgIcon.parentNode.removeChild(element._svgIcon)
      element._svgIcon = null
    }
  }
}

SiIconSet.define()
