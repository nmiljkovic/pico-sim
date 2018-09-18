<template>
  <b-table
    :data="errors"
    :striped="true"
    :narrowed="true"
    :hoverable="true"
    :mobile-cards="true"
  >
    <template slot-scope="props">
      <b-table-column field="message" label="Message">
        {{ props.row.message }}
      </b-table-column>

      <b-table-column field="line" label="Line" numeric>
        {{ props.row.line }}
      </b-table-column>
    </template>

    <template slot="empty">
      <div class="content has-text-grey has-text-centered">
        <p>No errors.</p>
      </div>
    </template>
  </b-table>
</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "ErrorList",
    computed: mapGetters(["errors"]),
  };
</script>
