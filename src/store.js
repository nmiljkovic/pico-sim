import asm, {errors, symbols} from "./asm";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const hasPendingIO = (state) => state.requestedInputAddr != null;

const store = new Vuex.Store({
  state: {
    code: "",
    breakpoints: [],
    running: false,
    debugging: false,
    currentLineNumber: -1,
    footerFocusedTab: 0,

    runtime: {
      PC: -1,
      SP: -1,
    },

    // IO
    requestedInputAddr: null,
    consoleActivity: [],
  },

  mutations: {
    updateCode(state, {code, breakpoints}) {
      state.code = code;
      state.breakpoints = breakpoints;

      if (window.localStorage) {
        window.localStorage.setItem("code", code);
      }
    },
    updateRunState(state, runState) {
      if (runState.running && !state.running) {
        // reset console activity on fresh run
        state.consoleActivity = [];
      }
      state.running = runState.running;
      state.debugging = runState.debugging;
      state.currentLineNumber = runState.currentLineNumber;
      state.runtime = runState.runtime;
      if (!runState.running) {
        state.requestedInputAddr = null;
      }
    },
    focusFooterTab(state, tab) {
      state.footerFocusedTab = tab;
    },
    requestUserInput(state, addr) {
      state.requestedInputAddr = addr;
      state.footerFocusedTab = 1;
    },
    recordUserInput(state, value) {
      if (!state.requestedInputAddr) {
        return;
      }
      state.consoleActivity.push(`Input at address ${state.requestedInputAddr}: ${value}`);
      state.requestedInputAddr = null;
    },
    recordOutput(state, {address, value}) {
      state.consoleActivity.push(`Memory at address ${address}: ${value}`);
    },
    submitConsoleMessage(state, message) {
      state.consoleActivity.push(message);
    }
  },

  getters: {
    errors: errors,
    canRun: (state) => !state.running && errors(state).length === 0 && !hasPendingIO(state),
    canContinue: (state) => state.running && !hasPendingIO(state),
    symbols: symbols,
    runtime: (state) => ([
      {name: "PC", value: state.runtime.PC},
      {name: "SP", value: state.runtime.SP},
    ]),
  },

  actions: {
    debug({dispatch}) {
      dispatch("run", {
        debug: true
      });
    },
    step({commit, state}) {
      if (!state.running) {
        throw new Error("Cannot step over on a stopped machine.");
      }
      asm.vm.step().then(finished => {
        commit("updateRunState", {
          running: !finished,
          debugging: false,
          currentLineNumber: asm.vm.sourceLine,
          runtime: {
            PC: asm.vm.pc,
            SP: asm.vm.stackPointer,
          },
        });
      }, err => {
        handleError(commit, err);
      });
    },
    continue({commit, state}) {
      if (!state.running) {
        throw new Error("Cannot continue on a stopped machine.");
      }
      syncBreakpoints(
        state.breakpoints,
        !state.debugging
      );
      asm.vm.run().then(finished => {
        commit("updateRunState", {
          running: !finished,
          debugging: state.debugging,
          currentLineNumber: asm.vm.sourceLine,
          runtime: {
            PC: asm.vm.pc,
            SP: asm.vm.stackPointer,
          },
        });
      }, err => {
        handleError(commit, err);
      });
    },
    run({dispatch, commit, state}, options) {
      if (state.running) {
        throw new Error("Cannot run an already running machine.");
      }
      let debug = false;
      if (options && options.debug) {
        debug = true;
      }
      commit("updateRunState", {
        running: true,
        debugging: debug,
        currentLineNumber: asm.vm.sourceLine,
        runtime: {
          PC: asm.vm.pc,
          SP: asm.vm.stackPointer,
        },
      });
      asm.initVm();
      dispatch("continue");
    },
    stop({commit}) {
      commit("updateRunState", {
        running: false,
        debugging: false,
        currentLineNumber: -1,
      });
    },
    format({commit, state}) {
      commit("updateCode", {
        code: asm.pretty,
        breakpoints: state.breakpoints,
      });
    },
    recordUserInput({commit, state}, value) {
      asm.recordInput(value);
      commit("recordUserInput", value);
    },
  },
});

function handleError(commit, err) {
  commit("updateRunState", {
    running: false,
    debugging: false,
    currentLineNumber: asm.vm.sourceLine,
    runtime: {
      PC: asm.vm.pc,
      SP: asm.vm.stackPointer,
    },
  });
  commit("submitConsoleMessage", err.message);
  commit("focusFooterTab", 1);
}

function syncBreakpoints(breakpoints, muteBreakpoints) {
  asm.vm.clearBreakpoints();
  breakpoints.forEach(sourceLine => {
    asm.vm.setBreakpoint(sourceLine);
  });
  asm.vm.muteBreakpoints = muteBreakpoints;
}

export default store;
