<template>
  <div id="editor"></div>
</template>

<script>
  import CodeMirror from "codemirror";
  import "codemirror/lib/codemirror.css";
  import "codemirror/theme/idea.css";
  import "../codemirror/pico-mode";
  import {mapGetters, mapState} from "vuex";

  export default {
    name: "CodeEditor",
    mounted() {
      this.errorMarkers = [];
      this.editor = CodeMirror(
        document.getElementById("editor"), {
          lineNumbers: true,
          indentWithTabs: true,
          mode: "pico",
          theme: "idea",
          gutters: [
            "bytecode",
            "CodeMirror-linenumbers",
            "breakpoints",
          ],
        }
      );
      this.editor.on("changes", (editor) => {
        this.debounceParse();
      });
      this.editor.on("gutterClick", (editor, lineNumber) => {
        const info = editor.lineInfo(lineNumber);
        if (!info.text.trim().length) {
          return;
        }
        const marker = info.gutterMarkers ? null : makeBreakpointMarker();
        editor.setGutterMarker(lineNumber, "breakpoints", marker);

        this.$store.commit("updateCode", {
          code: this.editor.getValue(),
          breakpoints: this.getBreakpoints(),
        });
      });

      const makeBreakpointMarker = () => {
        const marker = document.createElement("div");
        marker.style.color = "#822";
        marker.innerHTML = "●";
        return marker;
      };
    },
    computed: {
      ...mapState(["running", "code", "currentLineNumber"]),
      ...mapGetters(["errors"]),
    },
    watch: {
      code() {
        if (this.code !== this.editor.getValue()) {
          this.editor.setValue(this.code);
        }
      },
      errors() {
        this.setErrorMarkers(this.errors);
      },
      running() {
        this.editor.setOption("readOnly", this.running);
      },
      currentLineNumber() {
        if (this.previousLineNumber) {
          this.editor.removeLineClass(
            this.previousLineNumber - 1,
            "background",
            "debug-cl",
          );
        }
        this.previousLineNumber = this.currentLineNumber;
        this.editor.addLineClass(
          this.currentLineNumber - 1,
          "background",
          "debug-cl",
        );
      }
    },
    methods: {
      debounceParse() {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.timeout = 0;
          this.$store.commit("updateCode", {
            code: this.editor.getValue(),
            breakpoints: this.getBreakpoints(),
          });
        }, 200);
      },
      setErrorMarkers(errors) {
        this.errorMarkers.forEach(marker => marker.clear());
        this.errorMarkers = errors.map(err => {
          return this.createMarker(err, false);
        }).filter(m => m);
      },
      getBreakpoints() {
        const lineCount = this.editor.lineCount();
        const lines = [];
        for (let i = 0; i < lineCount; i++) {
          const lineInfo = this.editor.lineInfo(i);
          if (lineInfo.gutterMarkers && lineInfo.gutterMarkers.breakpoints) {
            lines.push(i + 1);
          }
        }
        return lines;
      },
      createMarker(err) {
        const lineInfo = this.editor.lineInfo(err.line - 1);
        const lineLength = lineInfo.text.length;
        const isEol = err.startColumn >= lineLength;
        // A special offset is applied for end of line errors
        // which cannot be marked.
        // These errors are usually in the format of "Expected X instead of \n".
        const offset = isEol ? -1 : 0;
        const marker = this.editor.markText(
          {
            line: err.line - 1,
            ch: err.startColumn + offset,
          },
          {
            line: err.line - 1,
            ch: err.endColumn + 1 + offset,
          },
          {
            className: "error-mark",
            inclusiveLeft: false,
            inclusiveRight: false,
            title: err.message,
          }
        );
        return marker;
      }
    }
  };
</script>

<style>
  #editor {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }

  .CodeMirror {
    flex: 1 1 auto;
  }

  .CodeMirror-gutter.breakpoints {
    width: 10px;
  }

  .CodeMirror-gutter.bytecode {
    width: 40px;
  }

  .error-mark {
    text-decoration: underline;
    text-decoration-color: hsl(348, 100%, 61%);
    text-decoration-style: dashed;
    background-color: hsl(357, 100%, 88%);
  }

  .debug-cl {
    background-color: #dceaff;
  }
</style>
