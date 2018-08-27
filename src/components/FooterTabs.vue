<template>
  <b-tabs
    v-on:input="focusFooterTab"
    v-bind:value="footerFocusedTab"
    :animated="false"
  >
    <b-tab-item>
      <template slot="header">
        <span>
          Errors
          <b-tag rounded type="is-danger">{{errors.length}}</b-tag>
        </span>
      </template>
      <error-list/>
    </b-tab-item>
    <b-tab-item label="Console">
      <console/>
    </b-tab-item>
  </b-tabs>
</template>

<script>
  import ErrorList from "./ErrorList";
  import Console from "./Console/Console";
  import {mapGetters, mapMutations, mapState} from "vuex";

  export default {
    name: "FooterTabs",
    components: {ErrorList, Console},
    computed: {
      ...mapState(["footerFocusedTab"]),
      ...mapGetters(["errors"]),
    },
    methods: {
      ...mapMutations(["focusFooterTab"]),
    },
  };
</script>
