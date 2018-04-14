import {SiElement, html} from '../core/si-element.js'
import {SiAsync} from '../core/si-async.js'

export class SiTabs extends SiElement {
  static get is() { return 'si-tabs' }

  static get properties() {
    return { }
  }

  ready() {
    super.ready()
    this.slide = this.shadowRoot.querySelector('#slide')

    this.setAttribute('tabindex', '0')

    /*
    this.addEventListener('keydown', (ev) => {
      switch (ev.key) {
        case 'ArrowLeft':
          this._focusNext()
          break
        case 'ArrowRight':
          this._focusPrevious()
          break
        default:
          this._focusActivate()
          break
      }
    })
    */

    this.tabs.forEach((tab) => {
      tab.setAttribute('tabindex', '-1')
      tab.setAttribute('role', 'tab')
      tab.addEventListener('click', async (e) => {
        const index = this.tabs.indexOf(tab)

        this.selected = index

        await SiAsync.yieldThen
        this.dispatchEvent(
          new CustomEvent("select", {
            compose: true,
            bubbles: true,
            detail: index
          })
        )
      })
    })
  }

  get tabs() {
    return Array.from(this.querySelectorAll('si-tab'))
  }

  set selected(index) {
    if (index === undefined) return
    this.tabs.forEach((tab) => {
      tab.removeAttribute('selected')
      tab.setAttribute('tabindex', '-1')
    })
    this._selected = index
    this.selectedTab.setAttribute('selected', '')
    this.selectedTab.setAttribute('tabindex', '0')
    this._updateSlide()
  }

  get selected() {
    return this._selected
  }

  async _updateSlide() {
    await SiAsync.yieldThen
    this.slide.style.left = this.selectedTab.offsetLeft + 'px'
    this.slide.style.width = this.selectedTab.offsetWidth + 'px'
  }

  get selectedTab() {
    return this.tabs[this.selected]
  }

  _focusNext() {

  }

  render({slideColor}) {
    return html`
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          margin-left: 10px;
          position: relative;
          transition: color 0.3s ease-in;
        }

        :host(:focus) {
          outline: none;
        }

        #slide {
          width: 0px;
          background: var(--slide-color-dark, 'yellowgreen');
          height: 2px;
          left: 0px;
          bottom: 0px;
          transition: left 0.3s ease-out, width 0.3s ease-out;
          position: relative;
        }
      </style>

      <slot></slot>
      <div id="slide"></div>
    `
  }
}

SiTabs.define()
