<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import RecordErrors from '~/components/database/RecordErrors.vue';

@Component({
  components: { RecordErrors },
})
export default class CardSaveableFooter extends Vue {
  @Prop() readonly disabled!: boolean;
}
</script>

<template>
  <div class="card-footer">
    <div class="d-flex justify-content-between">
      <div>
        <b-button
          variant="outline-success"
          :disabled="disabled"
          @click="$emit('save')"
        >
          <t value="app.action.save" />
        </b-button>
      </div>
      <div>
        <b-button
          variant="outline-secondary"
          :disabled="disabled"
          @click="$emit('cancel')"
        >
          <t value="app.action.cancel" />
        </b-button>
      </div>
    </div>
    <div
      v-if="$slots['fail-content']"
      class="mt-3"
    >
      <slot name="fail-content" />
    </div>
  </div>
</template>
