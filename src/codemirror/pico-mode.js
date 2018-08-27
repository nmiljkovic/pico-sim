import CodeMirror from "codemirror";
import "codemirror/addon/mode/simple";

CodeMirror.defineSimpleMode("pico", {
  start: [
    {
      regex: /([a-z][\w$]*)(\s*=)/,
      token: ["variable", null]
    },
    {
      regex: /^\s*(?:mov|add|sub|mul|div|bgt|beq|in|out|stop|rts|jsr|org)\b/,
      token: "keyword"
    },
    {regex: /;.*/, token: "comment"},
    {regex: /[a-z][\w]*/, token: ["variable"]}
  ],
  meta: {
    dontIndentStates: ["comment"],
    lineComment: ";"
  }
});
