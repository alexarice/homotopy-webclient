export const _debug = true;

export const _assert = (condition) => {
  if (!_debug) return;
  if (!condition) {
    debugger;
    throw new Error("Assertion failed.");
  }
};

export const isNatural = (value) => {
  return Number.isInteger(value) && value >= 0;
};

export const _validate = (object) => {
  if (!_debug) return;
  if (!object.validate) {
    debugger;
  }
  object.validate();
};

export const _propertylist = (object, properties) => {
  if (!_debug) return;
  for (let property of properties) {
    if (!object.hasOwnProperty(property)) {
      debugger;
    }
  }
};
