import {SiElement, html, css} from '../core/si-element.js'

export class SiChart extends SiElement {
  static get is() { return 'si-chart' }
  static get properties() {
    return {
      spec: Object
    }
  }

  ready() {
    super.ready()
  }

  async setData(name, data) {
    console.log("setData", this.spec, name, data)
    this.spec["data"] = {'name': name}
    this.vega = await vegaEmbed(this.$['vis'], this.spec, {"actions": false})
    this.vega.view.data(name, data)
    this.vega.view.runAsync()
  }

  static get styles() {
    return css`
      :host {
        display: block;
        background: white;
        position: relative;
      }
    `
  }

  render() {
    return html`
      <div style="width: 100%; height: 100%;" id="vis"><slot></slot></div>
    `
  }
}

SiChart.define()

