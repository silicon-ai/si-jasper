import {SiElement, html, css} from '../core/si-element.js'
import {SiAsync} from '../core/si-async.js'

class SiTabs extends SiElement {
  static get is() { return 'si-tabs' }

  static get properties() {
    return {
      orientation: {
        type: String,
        value: "horizontal"
      },
      showSlide: {
        type: Boolean,
        value: true
      }
    }
  }

  ready() {
    super.ready()
    this.slide = this.shadowRoot.querySelector('#slide')
    if (!this.showSlide) this.slide.style.display = 'none'

    this.setAttribute('tabindex', '0')

    this.addEventListener('tab-click', async (ev) => {
      ev.stopPropagation()

      let tab = ev.target
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
    if (this.selectedTab) this._updateSlide()
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

    if (index == -1) return
    this.selectedTab.setAttribute('selected', '')
    this.selectedTab.setAttribute('tabindex', '0')

    //FIXME: FoUC on slide offset measurement
    setTimeout(_ => this._updateSlide(), 50)
    window.addEventListener('resize', _ => this._updateSlide())
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
        this.slide.style.left = '0px'// (this.selectedTab.offsetWidth - 2) + 'px'
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
        left: 0px;
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
