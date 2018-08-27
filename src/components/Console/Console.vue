<template>
  <div>
    <ul>
      <li v-for="activity in consoleActivity">
        {{activity}}
      </li>
    </ul>
    <input-value/>
  </div>
</template>

<script>
  import InputValue from "./InputValue";
  import {mapState} from "vuex";

  export default {
    name: "Console",
    components: {InputValue},
    computed: mapState(["running", "consoleActivity"]),
  };
</script>
