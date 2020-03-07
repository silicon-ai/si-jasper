import {SiElement} from './si-element.js'
import {SiHttpRequest} from './si-net.js'
import {SiAsync} from './si-async.js'

class SiAjax extends SiElement {
  static get is() { return 'si-ajax' }
  static get properties() {
    return {
      auto: Boolean,
      url: String,
      method: {
        type: String,
        value: 'GET'
      },
      handleAs: String,
      params: Object,
      body: Object,
      debounceDuration: {
        type: Number,
        value: 0
      }
    }
  }

  ready() {
    console.log('si-ajax::ready')
    //this.http = new SiHttpRequest()
    if (this.auto) this.generateRequest()
  }

  get http() {
    return new SiHttpRequest()
  }

  async generateRequest() {
    await SiAsync.debounce(this, this.debounceDuration)

    return this.http.send(this.method, this.url, this.body)
      .then((request) => {
        let response
        switch (this.handleAs) {
          case 'json':
            response = JSON.parse(request.responseText)
            break
          case 'xml':
            response = request.responseXML
            break
          default:
            response = request.responseText
        }
        console.log('ajax-response', request.status)

        this.dispatchEvent(
          new CustomEvent('response', {
            bubbles: true,
            detail: { request, response }
          })
        )
      })
      .catch((request) => {
        const response = request.responseText
        const status = request.status
        const statusText = request.statusText
        this.dispatchEvent(
          new CustomEvent('ajax-error', {
            bubbles: true,
            composed: true,
            detail: { request, response, status, statusText }
          })
        )
      })
  }
}

SiAjax.define()
