export class InputCell {
  constructor(value) {
    this.onChange(() => {});
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this.setValue(newValue);
  }

  setValue(newValue) {
    if (this.value !== newValue) {
      this._value = newValue;
      this.runOnChange(this.value);
    }
  }

  onChange(fn) {
    this.runOnChange = fn;
  }
}

export class ComputeCell extends InputCell {
  constructor(inputCells, fn) {
    super();
    this.fn = fn;
    this.inputCells = inputCells
    this._prevValue = this.value;
    this.callbacks = [];

    const self = this;
    this.inputCells.map(function(ic) {
      ic.onChange(self.onInputCellChange.bind(self))
    })
  }

  get value() {
    return this.fn(this.inputCells);
  }

  set value(v) {}

  addCallback(cb) {
    this.callbacks.push(cb);
  }

  removeCallback(cb) {
    this.callbacks = this.callbacks.filter(icb => icb !== cb);
  }

  hasChanged() {
    const changed = this._prevValue !== this.value;

    if (changed) {
      this._prevValue = this.value;
    }

    return changed;
  }

  onInputCellChange() {
    if (this.hasChanged()) {
      this.runCallbacks()
      this.runOnChange()
    }
  }

  runCallbacks() {
    const self = this;
    this.callbacks.map(function(cb) {
      cb.values.push(cb.fn(self));
    })
  }
}

export class CallbackCell {
  constructor(fn) {
    this.fn = fn;
    this.values = [];
  }
}
