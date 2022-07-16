
export class SiHttpRequest {
  constructor(headers = []) {
    this.headers = headers
    this.errorHander = null
  }

  withHeaders(headers) {
    this.headers = headers
    return this
  }

  withHeader(key, val) {
    if (!this.headers) this.headers = []
    this.headers.push([key, val])
    return this
  }

  onError(handler) {
    this.errorHandler = handler
    return this
  }

  send(meth, url, data) {
    const request = new XMLHttpRequest()
    const promise = new Promise((resolve, reject) => {
      request.onload = () => {
        if (request.status >= 400)
          reject(request)
        else
          resolve(request)
      }
      request.onerror = () => reject(request)
    })

    request.open(meth, url, true)
    this.headers.forEach((kv) => {
      const [key, val] = kv
      request.setRequestHeader(key, val)
    })

    if (data != null && typeof data === 'object') {
      data = JSON.stringify(data)
      request.setRequestHeader('Content-Type', 'application/json')
    }

    if (this.errorHandler) promise.catch(this.errorHandler)

    try {
      request.send(data)
    }
    catch (ex) {
      return Promise.reject(ex)
    }
    return promise
  }

  get(url) {
    return this.send('GET', url)
  }

  stream(url, headers) {
    return new EventSource(url, {headers: headers})
  }

  post(url, data) {
    return this.send('POST', url, data)
  }

  put(url, data) {
    return this.send('PUT', url, data)
  }

  delete(url) {
    return this.send('DELETE', url)
  }

  head(url) {
    return this.send('HEAD', url)
  }
}


const _WebSocket = window.MozWebSocket ? window.MozWebSocket : window.WebSocket

export class SiSocket {
  constructor(url) {
    this._url = url
    this._buffer = []
    this._onmessage = (message) => {
      this._buffer.push(message)
    }
  }

  open(protos = []) {
    this._ws = new _WebSocket(this._url, protos)
    const promise = new Promise((resolve, reject) => {
      try {
        this._ws.onopen = () => resolve(this)
        this._ws.onmessage = this._onMessage.bind(this)
      }
      catch (ex) {
        reject(ex)
      }
    })
    return promise
  }

  _onMessage(message) {
    this._buffer.push(message)
  }

  close() {
    this._ws.close()
    this._ws.onmessage = null
  }

  send(msg) {
    return this._ws.send(msg)
  }

  // TODO: make this async interable (i.e. a generator yielding promises)
  recv() {
    let promise
    if (Boolean(this._buffer.length)) {
      promise = new Promise((resolve, reject) => {
        resolve(this._buffer.shift())
      })
    }
    else {
      promise = new Promise((resolve, reject) => {
        const handler = (message) => {
          this._ws.removeEventListener("message", handler)
          resolve(message)
        }
        this._ws.addEventListener("message", handler)
      })
    }
    return promise
  }
}

