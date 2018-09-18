<template>
  <div class="level is-mobile">
    <ul class="level-left">
      <li class="level-item logo is-hidden-mobile">
        pico
      </li>
      <li class="level-item" v-show="!running">
        <b-tooltip label="Debug"
                   position="is-bottom"
                   animated>
          <button
            class="button"
            v-bind:disabled="!canRun"
            v-on:click="debug()">
            <b-icon icon="bug"/>
          </button>
        </b-tooltip>
      </li>
      <li class="level-item" v-show="!running">
        <b-tooltip label="Run"
                   position="is-bottom"
                   animated>
          <button
            class="button"
            v-bind:disabled="!canRun"
            v-on:click="run()"
          >
            <b-icon icon="play"/>
          </button>
        </b-tooltip>
      </li>
      <li class="level-item" v-show="running">
        <b-tooltip label="Continue"
                   position="is-bottom"
                   animated>
          <button
            class="button"
            v-bind:disabled="!canContinue"
            v-on:click="continueExecution()"
          >
            <b-icon icon="play"/>
          </button>
        </b-tooltip>
      </li>
      <li class="level-item" v-show="running">
        <b-tooltip label="Stop"
                   position="is-bottom"
                   animated>
          <button
            class="button"
            v-bind:disabled="!running"
            v-on:click="stop()"
          >
            <b-icon icon="stop"/>
          </button>
        </b-tooltip>
      </li>
      <li class="level-item" v-show="running">
        <b-tooltip label="Step"
                   position="is-bottom"
                   animated>
          <button
            class="button"
            v-bind:disabled="!canContinue"
            v-on:click="step()"
          >
            <b-icon icon="debug-step-into"/>
          </button>
        </b-tooltip>
      </li>
    </ul>

    <div class="level-right">
      <button
        class="button"
        v-on:click="format()"
        v-bind:disabled="running"
      >
        <b-icon icon="format-page-break"/>
        <span>Format</span>
      </button>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from "vuex";

  export default {
    name: "Toolbar",
    computed: {
      ...mapGetters(["errors", "canRun", "canContinue"]),
      ...mapState(["running"]),
    },
    methods: {
      ...mapActions([
        "debug",
        "run",
        "stop",
        "step",
        "format",
      ]),
      ...mapActions({
        "continueExecution": "continue"
      })
    },
  };
</script>

<style scoped>
  li {
    display: inline-block;
    list-style-type: none;
  }

  .logo {
    font-family: 'Niconne', cursive;
    font-size: 1.7em;
    color: #7957d5;
  }
</style>
