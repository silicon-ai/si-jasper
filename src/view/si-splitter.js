import {SiTrackableElement, html} from '../core/si-element.js'
import {SiAsync} from '../core/si-async.js'

export class SiSplitter extends SiTrackableElement {
  static get is() { return 'si-splitter' }

  static get properties() {
    return {
      direction: {
        type: String,
        value: 'left'
      },
      locked: {
        type: Boolean,
        value: false
      },
      minSize: {
        type: String,
        value: ''
      },
      allowOverflow: {
        type: Boolean,
        value: false
      }
    }
  }

  ready() {
    super.ready()
    this.directionChanged()
    this.addEventListener('track', this._onTrack.bind(this))
  }

  _onTrack(ev) {
    if (this.locked) return;
    if (ev.detail.state == 'start') {
      this.update();
      this.size = parseInt(getComputedStyle(this.target)[this.dimension]);
    }
    var d = ev.detail[this.horizontal ? 'dy' : 'dx'];
    this.target.style[this.dimension] = this.size + (this.isNext ? -d : d) + 'px';
  }

  async attached() {
    if (!this.allowOverflow) {
      await SiAsync.yieldThen
      const elems = [
        this.parentNode,
        this.nextElementSibling,
        this.previousElementSibling
      ]
      elems.forEach((elem) => elem.style.overflow = 'hidden')
    }
  }

  directionChanged() {
    this.isNext = this.direction === 'right' || this.direction === 'down';
    this.horizontal = this.direction === 'up' || this.direction === 'down';
    this.update();
  }

  update() {
    this.target = this.isNext ? this.nextElementSibling : this.previousElementSibling;
    this.dimension = this.horizontal ? 'height' : 'width';
    this.classList.toggle('horizontal', this.horizontal);
  }

  render() {
    return html`
      <style>
        :host {
          display: block;
          width: 10px;
          background: #efefef;
          box-shadow: inset 0 0 2px 1px #ccc;
          cursor: col-resize;
        }

        :host(.horizontal) {
          width: auto;
          height: 10px;
          cursor: row-resize;
        }

        :host(:hover, :active) {
          background-color: #ddd;
        }
      </style>

      <slot></slot>
    `
  }
}

SiSplitter.define()
