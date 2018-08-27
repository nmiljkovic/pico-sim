<template>
  <div v-if="requestedInputAddr !== null">
    Input for address {{requestedInputAddr}}:
    <b-input
      type="text"
      ref="inputTxt"
      v-model="value"
      v-on:keyup.native="handleInputKeyup"
    />
  </div>
</template>

<script>
  import {mapActions, mapState} from "vuex";

  export default {
    name: "InputValue",
    data() {
      return {
        value: null,
      };
    },
    computed: mapState(["requestedInputAddr"]),
    watch: {
      requestedInputAddr(addr) {
        this.value = null;
        if (addr) {
          setTimeout(() => this.$refs.inputTxt.focus());
        }
      }
    },
    methods: {
      ...mapActions(["recordUserInput"]),
      handleInputKeyup(ev) {
        if (ev.keyCode !== 13) {
          return;
        }
        const value = parseInt(this.value, 10);
        this.recordUserInput(value);
      },
    },
  };
</script>
