import './wasm_exec.js';
const BRIDGE_NAME = "__GO_PROXY__";

const loadGoWasm = async (url) => {
  return new Promise((resolve, reject) => {
    if (WebAssembly) {
      // WebAssembly.instantiateStreaming is not currently available in Safari
      if (WebAssembly && !WebAssembly.instantiateStreaming) { // polyfill
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
          const source = await (await resp).arrayBuffer();
          return await WebAssembly.instantiate(source, importObject);
        };
      }

      const go = new Go();
      WebAssembly.instantiateStreaming(fetch(url), go.importObject)
        .then((result) => {
          go.run(result.instance)
          const bridgeObj = window[BRIDGE_NAME]
          resolve()
        })
        .catch(reject);
    } else {
      reject("WebAssembly is not supported in your browser")
    }
  })
}

export default loadGoWasm;