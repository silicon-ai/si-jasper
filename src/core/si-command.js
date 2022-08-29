
export const SiCommandSource = {
  dispatchCommand(command, params) {
    const event = new CustomEvent('si-command', {
      bubbles: true,
      composed: true,
      detail: {
        scope: this.constructor.is,
        command: command,
        params: params,
        resolve: null,
        reject: null
      }
    })

    const promise = new Promise((resolve, reject) => {
      event.detail.resolve = resolve
      event.detail.reject = reject
    })

    this.dispatchEvent(event)
    return promise
  }
}


export const SiCommandHandler = {
  addCommandListener(command, listener) {
    if (!this._commandListeners) {
      this._commandListeners = []
      this.addEventListener('si-command', this._commandHandler.bind(this))
    }
    this._commandListeners.push([command, listener])
  },

  removeCommandListener(command, listener) {
    if (!this._commandListeners) return
    for (let x = 0; x < this._commandListeners.length; x++) {
      [c, l] = this._commandListeners[x]
      if (c === command && l === listener) {
        return this._commandListeners.splice(x, 1)
      }
    }
  },

  _commandHandler(ev) {
    if (!this._commandListeners) return
    let {command, params, resolve, reject} = ev.detail
    let [_, handler] = this._commandListeners.filter(val => val[0] == command)
    if (handler) {
      try {
        resolve(handler(params))
      }
      catch (ex) {
        reject(ex)
      }
    }
  }
}