import "@testing-library/jest-dom";

// crypto.randomUUID polyfill for jsdom/jest
if (!global.crypto) global.crypto = {};
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () =>
    "00000000-0000-4000-8000-000000000000";
}

// URL.createObjectURL polyfill (plotly/react-plotly)
if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = () => "blob:mock-url";
}
if (!global.URL.revokeObjectURL) {
  global.URL.revokeObjectURL = () => {};
}
