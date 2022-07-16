import {css} from '../core/si-element.js'

const rgbaRx = /^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+))?\)$/

function rgbaToGrayScale(rgba) {
  let [_, ...m] = rgba.match(rgbaRx)
  let [r,g,b,a] = m.map((v) => v ? parseInt(v) : v)
  return r * 0.2126 + g * 0.7152 + b * 0.0722
}

const shadowStyles = css`
  :host {
    --shadow-elevation-1:
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 1px 5px 0 rgba(0, 0, 0, 0.12),
      0 3px 1px -2px rgba(0, 0, 0, 0.2);

    --shadow-elevation-2:
      0 3px 4px 0 rgba(0, 0, 0, 0.14),
      0 1px 8px 0 rgba(0, 0, 0, 0.12),
      0 3px 3px -2px rgba(0, 0, 0, 0.4);

    --shadow-elevation-3:
      0 4px 5px 0 rgba(0, 0, 0, 0.14),
      0 1px 10px 0 rgba(0, 0, 0, 0.12),
      0 2px 4px -1px rgba(0, 0, 0, 0.4);

    --shadow-elevation-4:
      0 6px 10px 0 rgba(0, 0, 0, 0.14),
      0 1px 18px 0 rgba(0, 0, 0, 0.12),
      0 3px 5px -1px rgba(0, 0, 0, 0.4);

    --shadow-elevation-5:
      0 8px 10px 1px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12),
      0 5px 5px -3px rgba(0, 0, 0, 0.4);

    --shadow-elevation-6:
      0 12px 16px 1px rgba(0, 0, 0, 0.14),
      0 4px 22px 3px rgba(0, 0, 0, 0.12),
      0 6px 7px -4px rgba(0, 0, 0, 0.4);

    --shadow-elevation-7:
      0 16px 24px 2px rgba(0, 0, 0, 0.14),
      0  6px 30px 5px rgba(0, 0, 0, 0.12),
      0  8px 10px -5px rgba(0, 0, 0, 0.4);

    --shadow-elevation-8:
      0 24px 38px 3px rgba(0, 0, 0, 0.14),
      0 9px 46px 8px rgba(0, 0, 0, 0.12),
      0 11px 15px -7px rgba(0, 0, 0, 0.4);
  }

  .shadow-elevation-1 {
    box-shadow: var(--shadow-elevation-1);
  }
  .shadow-elevation-2 {
    box-shadow: var(--shadow-elevation-2);
  }
  .shadow-elevation-3 {
    box-shadow: var(--shadow-elevation-3);
  }
  .shadow-elevation-4 {
    box-shadow: var(--shadow-elevation-4);
  }
  .shadow-elevation-5 {
    box-shadow: var(--shadow-elevation-5);
  }
  .shadow-elevation-6 {
    box-shadow: var(--shadow-elevation-6);
  }
  .shadow-elevation-7 {
    box-shadow: var(--shadow-elevation-7);
  }
  .shadow-elevation-8 {
    box-shadow: var(--shadow-elevation-8);
  }
`

const layoutStyles = css`
  .layout {
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
  }

  .inline {
    display: -ms-inline-flexbox;
    display: -webkit-inline-flex;
    display: inline-flex;
  }

  .horizontal {
    -ms-flex-direction: row;
    -webkit-flex-direction: row;
    flex-direction: row;
  }

  .vertical {
    -ms-flex-direction: column;
    -webkit-flex-direction: column;
    flex-direction: column;
  }

  .flex {
    -ms-flex: 1 1 0.000000001px;
    -webkit-flex: 1;
    flex: 1;
    -webkit-flex-basis: 0.000000001px;
    flex-basis: 0.000000001px;
  }

  .flex-2 {
    -ms-flex: 2 2 0.000000001px;
    -webkit-flex: 2;
    flex: 2;
    -webkit-flex-basis: 0.000000001px;
    flex-basis: 0.000000001px;
  }

  .flex-3 {
    -ms-flex: 3 3 0.000000001px;
    -webkit-flex: 3;
    flex: 3;
    -webkit-flex-basis: 0.000000001px;
    flex-basis: 0.000000001px;
  }

  .flex-4 {
    -ms-flex: 4 4 0.000000001px;
    -webkit-flex: 4;
    flex: 4;
    -webkit-flex-basis: 0.000000001px;
    flex-basis: 0.000000001px;
  }

  .flex-5 {
    -ms-flex: 5 5 0.000000001px;
    -webkit-flex: 5;
    flex: 5;
    -webkit-flex-basis: 0.000000001px;
    flex-basis: 0.000000001px;
  }

  .align-stretch {
    align-items: stretch;
  }
  .align-start {
    align-items: flex-start;
  }
  .align-end {
    align-items: flex-end;
  }

  .align-self-stretch: {
    align-self: stretch;
  }
  .align-self-start: {
    align-self: flex-start;
  }
  .align-self-end: {
    align-self: flex-end;
  }
`

export {layoutStyles, shadowStyles, rgbaToGrayScale}
