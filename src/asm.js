import {DebuggableCodegenVisitor, DebugVm, IO, Pico} from "pico-asm";
import store from "./store";

const asm = {
  code: null,
  parseErrors: [],
  analysisErrors: [],
  parse: function (code) {
    if (this.code === code) {
      return;
    }
    this.code = code;
    this.errors = [];
    const {ast, errors} = Pico.parse(code + "\n");
    if (errors.length) {
      this.errors = errors;
      return;
    }
    this.pretty = Pico.prettyPrint(ast);
    const analysisErrors = Pico.analyze(ast);
    if (analysisErrors.length) {
      this.errors = analysisErrors;
      return;
    }

    const generateVisitor = new DebuggableCodegenVisitor();
    this.generatedCode = generateVisitor.visitProgram(ast);
    this.initVm();
  },
  initVm: function () {
    this.io = new IO(this.input.bind(this), this.output.bind(this));
    this.vm = new DebugVm(this.generatedCode, this.io);
  },
  input(addr) {
    store.commit("requestUserInput", addr);
    return new Promise((resolve) => {
      this.recordInput = resolve;
    });
  },
  output(value, addr) {
    store.commit("recordOutput", {
      address: addr,
      value: value,
    });
    return Promise.resolve();
  },
};

export function errors(state) {
  asm.parse(state.code);
  return asm.errors;
}

export function symbols(state) {
  return () => {
    const hasErrors = errors(state).length;
    if (hasErrors) {
      return [];
    }
    const symbolMap = asm.vm.symbolMap;
    const symbols = symbolMap.keys();
    return Array.from(symbols)
      .map(symbol => {
        const address = symbolMap.get(symbol);
        return {
          name: symbol,
          address: address,
          value: asm.vm._readMem(address),
        };
      })
      .filter(s => asm.vm.labels.indexOf(s.name) === -1);
  };
}

export function bytecode(state) {
  asm.parse(state.code);
  return asm.generatedCode.bytecode.join("\n");
}

export default asm;
