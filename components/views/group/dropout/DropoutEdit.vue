<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import controls from '~/components/controls';
import app from '~/lib/app';
import DropoutReasons from '~/components/views/group/dropout/controls/DropoutReasons.vue';
import DropoutOn from '~/components/views/group/dropout/controls/DropoutOn.vue';
import ReturnOn from '~/components/views/group/dropout/controls/ReturnOn.vue';
import DropoutGroup from '~/components/views/group/dropout/DropoutGroup.vue';
import RecordId from '~/components/views/application/RecordId.vue';
import DropoutNote from '~/components/views/group/dropout/controls/DropoutNote.vue';
import { wai } from '~/vendor/wai';
import { group } from '~/lib/records';

@Component({
  components: { DropoutNote, RecordId, DropoutGroup, ReturnOn, DropoutOn, DropoutReasons },
})
export default class DropoutEdit extends Vue {
  @Prop({ required: true }) readonly value!: app.Maybe<controls.Group>;
  @Prop({ required: true }) readonly recordResource!: app.Nullable<app.api.Resource<wai.ResourceShow<group.dropout.Dropout>>>;
  @Prop({ required: true }) readonly transaction!: app.Transaction;

  get dropout () {
    return this.recordResource?.state.resource;
  }

  get controls () {
    return this.value;
  }

  get isDisabled () {
    return !this.dropout || this.transaction.state.isProcessing;
  }

  @Watch('dropout')
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
      DropoutNote.asField({
        default: () => dropout.record?.note,
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
    <div v-if="dropout" class="row">
      <div class="col-lg-6 mb-2">
        <h6>
          <t value="views.group.dropout.DropoutEdit.student_title" />
        </h6>
        <RecordId
          v-if="dropout.record?.student"
          :record="dropout.record.student"
          :path="`/database/people/${dropout.record.student.id}`"
        />
      </div>
      <div class="col-lg-6 mb-2">
        <h6>
          <t value="views.group.dropout.DropoutEdit.group_title" />
        </h6>
        <DropoutGroup
          v-if="dropout.group"
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
        <DropoutNote
          :controls="controls"
          :disabled="isDisabled"
          @submit="transaction.commit"
        />
      </div>
    </div>
  </div>
</template>
