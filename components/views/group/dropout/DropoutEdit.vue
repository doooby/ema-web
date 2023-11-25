<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { RecordLoaderState } from '~/components/database/pages/loaders/RecordLoader.vue';
import { group } from '~/lib/records';
import controls from '~/components/controls';
import app from '~/lib/app';
import DropoutReasons from '~/components/views/group/dropout/controls/DropoutReasons.vue';
import DropoutOn from '~/components/views/group/dropout/controls/DropoutOn.vue';
import ReturnOn from '~/components/views/group/dropout/controls/ReturnOn.vue';

@Component({
  components: { ReturnOn, DropoutOn, DropoutReasons },
})
export default class DropoutEdit extends Vue {
  @Prop({ required: true }) readonly value!: app.Maybe<controls.Group>;
  @Prop({ required: true }) readonly recordLoader!: RecordLoaderState<group.dropout.Dropout>;
  @Prop({ required: true }) readonly transaction!: app.Transaction;

  get controls () {
    return this.value;
  }

  get isDisabled () {
    return !this.recordLoader || this.transaction.state.isProcessing;
  }

  @Watch('recordLoader.record')
  reCreateSearchControls () {
    const { record } = this.recordLoader.record ?? {};
    if (!record) {
      this.$emit('input', undefined);
      return;
    }

    this.$emit('input', controls.Group.compose(
      DropoutReasons.asField({
        default: () => record.reasons,
      }),
      DropoutOn.asField({
        default: () => record.dropout_on,
      }),
      ReturnOn.asField(this, {
        default: () => record.return_on,
      }),
    ));
  }

  @Watch('controls.state.params')
  onParamsChange () {
    this.$emit('change', this.controls);
  }
}
</script>

<template>
  <div>
    <div v-if="controls" class="row">
      <div class="col-lg-6">
        <DropoutReasons
          :controls="controls"
          :disabled="isDisabled"
        />
      </div>
      <div class="col-lg-6">
        <DropoutOn
          :controls="controls"
          :disabled="isDisabled"
        />
        <ReturnOn
          :controls="controls"
          :disabled="isDisabled"
        />
      </div>
    </div>
  </div>
</template>
