<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import NameInputsTable from '~/components/controls/inputs/extended/NameInputsTable.vue';
import DropdownSelect from '~/components/controls/inputs/extended/DropdownSelect.vue';
import { person } from '~/lib/records';
import app from '~/lib/app';
import SimpleButton from '~/components/views/application/buttons/SimpleButton.vue';
import { CheckBox, TextInput } from '~/components/controls/inputs';

@Component({
  components: {
    CheckBox,
    TextInput,
    SimpleButton,
    DropdownSelect,
    NameInputsTable,
  },
})
export default class CaregiversFieldItem extends Vue {
  @Prop() readonly disabled?: boolean;
  @Prop({ required: true }) index!: number;
  @Prop({ required: true }) caregiver!: person.PersonCaregiver;
  @Prop({ required: true }) typeOptions!: app.OptionItem<string>[];

  get typeOption () {
    return this.typeOptions.find(option => option.value === this.caregiver.type);
  }
}
</script>

<template>
  <div>
    <div>
      <h5 class="mb-2 d-flex align-items-center">
        <span class="mr-2">{{ index + 1 }}.</span>
        <t v-if="typeOption" :value="typeOption.item" />
        <SimpleButton
          class="ml-3 font-14 btn-sm btn-outline-secondary border-0"
          @click="$emit('remove')"
        >
          <b-icon icon="trash" class="mr-1" />
          <t value="person.fields.CaregiversField.remove" />
        </SimpleButton>
      </h5>
    </div>
    <div class="form-group row no-gutters" style="gap: 2px;">
      <DropdownSelect
        class="col"
        :disabled="disabled"
        :value="[ typeOption ]"
        :options="typeOptions"
        style="width: 120px;"
        @change="$emit('change', {
          ...caregiver,
          type: $event?.[0]?.value,
        })"
      >
        <template #content="{ option }">
          <t v-if="option" :value="option.item" />
        </template>
        <template #option-content="{ option }">
          <t :value="option.item" />
        </template>
      </DropdownSelect>
      <TextInput
        v-if="caregiver.type === '_other'"
        class="col"
        :disabled="disabled"
        :value="caregiver.relation_other"
        @change="$emit('change', {
          ...caregiver,
          relation_other: $event,
        })"
      />
    </div>
    <div class="form-group">
      <label for="person--caregiver_name--en">
        <t value="person.label.name" />
      </label>
      <NameInputsTable
        :value="caregiver.names"
        dom-id="person--caregiver_name"
        :disabled="disabled"
        @change="$emit('change', {
          ...caregiver,
          names: $event,
        })"
      />
    </div>
    <div class="row no--gutter">
      <div class="col">
        <div class="form-group">
          <label for="person--caregiver_citizen_id">
            <t value="person.label.citizen_id" />
          </label>
          <TextInput
            :disabled="disabled"
            dom-id="person--caregiver_citizen_id"
            :value="caregiver.citizen_id"
            @change="$emit('change', {
              ...caregiver,
              citizen_id: $event,
            })"
          />
        </div>
        <div class="form-group">
          <label for="person--caregiver_email">
            <t value="person.label.email" />
          </label>
          <TextInput
            :disabled="disabled"
            dom-id="person--caregiver_email"
            :value="caregiver.email"
            @change="$emit('change', {
              ...caregiver,
              email: $event,
            })"
          />
        </div>
        <div class="form-group">
          <label for="person--caregiver_phone_no">
            <t value="person.label.phone_no" />
          </label>
          <TextInput
            :disabled="disabled"
            dom-id="person--caregiver_phone_no"
            :value="caregiver.phone_no"
            @change="$emit('change', {
              ...caregiver,
              phone_no: $event,
            })"
          />
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <CheckBox
            :disabled="disabled"
            :value="caregiver.cash_for_work"
            @change="$emit('change', {
              ...caregiver,
              cash_for_work: $event,
            })"
          >
            <t value="person.label.cash_for_work" />
          </CheckBox>
        </div>
        <div class="form-group">
          <label for="person--caregiver_humansis_cfw_id">
            <t value="person.label.humansis_cfw_id" />
          </label>
          <TextInput
            :disabled="disabled"
            dom-id="person--caregiver_humansis_cfw_id"
            :value="caregiver.humansis_cfw_id"
            @change="$emit('change', {
              ...caregiver,
              humansis_cfw_id: $event,
            })"
          />
        </div>
      </div>
    </div>
  </div>
</template>
