<template>
  <div class="hardware-panel is-hidden-mobile">
    <b-table
      :data="symbols()"
      :striped="true"
      :narrowed="true"
      :hoverable="true"
    >
      <template slot-scope="props">
        <b-table-column field="name" label="Symbol">
          {{ props.row.name }}
        </b-table-column>

        <b-table-column field="value" label="Value" numeric>
          {{ props.row.value }}
        </b-table-column>
      </template>

      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>Symbols will appear here.</p>
          </div>
        </section>
      </template>
    </b-table>

    <b-table
      v-if="running"
      :data="runtime"
      :striped="true"
      :narrowed="true"
      :hoverable="true"
    >
      <template slot-scope="props">
        <b-table-column field="name" label="Register">
          {{props.row.name}}
        </b-table-column>

        <b-table-column field="value" label="Value" numeric>
          {{props.row.value}}
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
  import {mapGetters, mapState} from "vuex";

  export default {
    name: "Hardware",
    computed: {
      ...mapState(["running"]),
      ...mapGetters(["symbols", "runtime"]),
    },
  };
</script>

<style scoped>
  .hardware-panel {
    overflow-y: scroll;
    width: 200px;
  }
</style>
