import { LitElement, html, css } from 'lit-element';
import { types } from './../config';
import './input-field';

export default class DroneSheet extends LitElement {
  static get properties() {
    return {
      model: { type: Number },
      type: { type: Number },
      index: { type: Number },
      lines: { type: Array }
    };
  }

  static get styles() {
    return css`
      .model_1,
      .model_2 {
      }

      .model_1 {
        background-color: #f2dada;
      }

      .model_2 {
        background-color: #c7fcd3;
      }

      .model_2.type_2 {
        background-color: #cfecfc;
      }

      .model_2.type_3 {
        background-color: #feffdb;
      }
    `;
  }

  constructor() {
    super();

    this.model = 1;
    this.lines = [];
  }

  _fieldChange({ detail: line } = {}) {
    this.dispatchEvent(
      new CustomEvent('drone-sheet-change', {
        detail: {
          type: this.type,
          index: this.index,
          line
        }
      })
    );
  }

  _getType(typeId) {
    const type = types.find(({ id }) => id === typeId);

    return html`
      <h3>Placa ${this.index + 1}</h3>
      <div class="model_${this.model} type_${type.id}">
        ${new Array(type.lines).fill().map(
          (_, index) =>
            html`
              <input-field
                index=${index}
                maxChars=${type.maxChars}
                value=${this.lines[index]?.value ?? ''}
                @input-field-change=${this._fieldChange}
              ></input-field>
            `
        )}
      </div>
    `;
  }

  render() {
    return html`
      ${this._getType(this.type)}
    `;
  }
}

customElements.define('drone-sheet', DroneSheet);
