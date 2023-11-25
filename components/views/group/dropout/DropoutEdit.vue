<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { RecordLoaderState } from '~/components/database/pages/loaders/RecordLoader.vue';
import { group } from '~/lib/records';
import controls from '~/components/controls';
import app from '~/lib/app';
import DropoutReasons from '~/components/views/group/dropout/controls/DropoutReasons.vue';
import DropoutOn from '~/components/views/group/dropout/controls/DropoutOn.vue';
import ReturnOn from '~/components/views/group/dropout/controls/ReturnOn.vue';
import DropoutGroup from '~/components/views/group/dropout/DropoutGroup.vue';
import RecordId from '~/components/views/application/RecordId.vue';

@Component({
  components: { RecordId, DropoutGroup, ReturnOn, DropoutOn, DropoutReasons },
})
export default class DropoutEdit extends Vue {
  @Prop({ required: true }) readonly value!: app.Maybe<controls.Group>;
  @Prop({ required: true }) readonly recordLoader!: RecordLoaderState<group.dropout.Dropout>;
  @Prop({ required: true }) readonly transaction!: app.Transaction;

  get dropout () {
    return this.recordLoader.record;
  }

  get controls () {
    return this.value;
  }

  get isDisabled () {
    return !this.recordLoader || this.transaction.state.isProcessing;
  }

  @Watch('recordLoader.record')
  onResetRecord () {
    const dropout = this.dropout;
    if (!dropout?.record) {
      this.$emit('input', undefined);
      return;
    }

    this.$emit('input', controls.Group.compose(
      DropoutReasons.asField({
        default: () => dropout.record?.reasons,
      }),
      DropoutOn.asField({
        default: () => dropout.record?.dropout_on,
      }),
      ReturnOn.asField({
        default: () => dropout.record?.return_on,
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
    <div class="row">
      <div class="col-lg-6">
        <h6 class="mt-2">
          <t value="views.group.dropout.DropoutEdit.student_title" />
        </h6>
        <RecordId
          v-if="dropout?.record?.student"
          :record="dropout.record.student"
          :path="`/database/people/${dropout.record.student.id}`"
        />
      </div>
      <div class="col-lg-6">
        <h6>
          <t value="views.group.dropout.DropoutEdit.group_title" />
        </h6>
        <DropoutGroup
          v-if="dropout?.group"
          class="mt-2"
          :group="dropout.group"
        />
      </div>
    </div>
    <div v-if="controls" class="row mt-2">
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
