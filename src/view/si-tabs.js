import {SiElement, html, css} from '../core/si-element.js'
import {SiAsync} from '../core/si-async.js'

class SiTabs extends SiElement {
  static get is() { return 'si-tabs' }

  static get properties() {
    return {
      orientation: {
        type: String,
        value: "horizontal"
      }
    }
  }

  ready() {
    super.ready()
    this.slide = this.shadowRoot.querySelector('#slide')

    this.setAttribute('tabindex', '0')

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
    switch (this.orientation) {
      case "horizontal":
        this.slide.style.left = this.selectedTab.offsetLeft + 'px'
        this.slide.style.width = this.selectedTab.offsetWidth + 'px'
        break
      case "vertical":
        this.slide.style.top = this.selectedTab.offsetTop + 'px'
        this.slide.style.height = this.selectedTab.offsetHeight + 'px'
        this.slide.style.left = this.selectedTab.offsetWidth + 'px'
        break
    }
  }

  get selectedTab() {
    return this.tabs[this.selected]
  }

  static get styles() {
    return css`
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

      :host([orientation="vertical"]) #slide {
        height: 0px;
        background: var(--slide-color-dark, 'yellowgreen');
        width: 2px;
        top: 0px;
        right: 0px;
        transition: top 0.3s ease-out, height 0.3s ease-out;
        position: absolute;
      }
    `
  }

  render({slideColor}) {
    return html`
      <slot></slot>
      <div id="slide"></div>
    `
  }
}

SiTabs.define()
