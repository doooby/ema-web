<template>
  <div class="d-flex justify-content-between emb-2">
    <div class="d-flex align-items-center flex-fill emr-1">
      <span class="emr-2">
        {{ index + 1 }}.
      </span>
      <span class="emr-2">
        <t value="app.common.label.from" />
      </span>
      <DateInput
        :value="term.from"
        @change="onChangeFrom"
      />
    </div>
    <div class="d-flex align-items-center flex-fill eml-1">
      <span class="emr-2">
        <t value="app.common.label.to" />
      </span>
      <DateInput
        :value="term.to"
        @change="onChangeTo"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Term } from './index.vue';
import DateInput from '~/components/controls/inputs/DateInput.vue';

const dateFormat = Object.freeze({ year: 'numeric', month: 'numeric', day: 'numeric' });

@Component({
  components: { DateInput },
})
export default class TermRow extends Vue {
  @Prop({ required: true }) term!: Term;
  @Prop({ required: true }) index!: number;
  dateFormat = dateFormat;

  onChangeFrom (date) {
    this.$emit('change', { ...this.term, from: date });
  }

  onChangeTo (date) {
    this.$emit('change', { ...this.term, to: date });
  }
}
</script>
