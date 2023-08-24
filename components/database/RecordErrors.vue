<template>
  <b-list-group
    v-if="errors"
    :class="$attrs.class"
  >
    <b-list-group-item
      v-for="([attribute, message], index) in errors"
      :key="index"
      variant="danger"
    >
      <span v-if="attribute">
        <strong>
          <t :value="`db.record.${entity}.label.${attribute}`" />
        </strong>: {{ message }}
      </span>
      <span v-else>
        <t :value="`app.processing.${message}`" />
      </span>
    </b-list-group-item>
  </b-list-group>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RecordChangeError } from '~/lib/api/mappers';

export default Vue.extend({
  props: {
    entity: { type: String, required: true },
    errors: { type: Array as PropType<RecordChangeError[]>, default: null },
  },
});
</script>
