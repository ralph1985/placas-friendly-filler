import { LitElement, html, css } from 'lit-element';
import './src/drone-plate';

const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });

class App extends LitElement {
  static get properties() {
    return {
      plates: { type: Array }
    };
  }

  static get styles() {
    return css`
      drone-plate {
        border: 2px dashed black;
        padding: 1.5em 3em;
        margin-bottom: 0.5em;
        text-align: center;
      }
    `;
  }

  constructor() {
    super();

    this.plates = [];
  }

  connectedCallback() {
    super.connectedCallback();

    try {
      const plates = window.localStorage.getItem('plates');
      const platesArr = JSON.parse(plates);

      this.plates = Array.isArray(platesArr) ? platesArr : [];
    } catch {
      this.plates = [];
    }
  }

  _addPlate() {
    const modelId = this.shadowRoot.getElementById('selectPlates').value;

    this.plates = [...this.plates, { id: uuid(), model: modelId }];

    this._save();
  }

  _changePlate({ detail } = {}) {
    const plate = this.plates.find(plate => plate.id === detail.id);

    if (!plate.types) {
      plate.types = {};
    }

    let type = plate.types[detail.sheet.type];

    if (!type) {
      type = plate.types[detail.sheet.type] = {};
    }

    if (!type.sheets) {
      type.sheets = [];
    }

    let sheet = type.sheets[detail.sheet.index];

    if (!sheet) {
      sheet = type.sheets[detail.sheet.index] = {};
    }

    if (!sheet.lines) {
      sheet.lines = [];
    }

    let line = sheet.lines[detail.sheet.line.index];

    if (!line) {
      line = sheet.lines[detail.sheet.line.index] = {};
    }

    line.value = detail.sheet.line.value;

    this._save();
  }

  _deletePlate({ detail } = {}) {
    if (window.confirm('¿Deseas eliminar esta plancha?')) {
      const index = this.plates.findIndex(({ id }) => id === detail.id);

      this.plates.splice(index, 1);

      this._save();
      this.requestUpdate();
    }
  }

  _save() {
    window.localStorage.setItem('plates', JSON.stringify(this.plates));
  }

  render() {
    return html`
      <select id="selectPlates">
        <option value="1">Modelo 1</option>
        <option value="2">Modelo 2</option>
      </select>
      <button @click="${this._addPlate}">Añadir plancha</button>

      ${this.plates.map(
        ({ id, model, types = {} }) => html`
          <drone-plate
            id=${id}
            model=${model}
            .types=${types}
            @change-plate=${this._changePlate}
            @delete-plate=${this._deletePlate}
          ></drone-plate>
        `
      )}
    `;
  }
}

customElements.define('app-root', App);
