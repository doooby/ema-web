<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { person } from '~/lib/records';
import RecordNamedValue from '~/components/views/application/RecordNamedValue.vue';
import app from '~/lib/app';

@Component({
  components: { RecordNamedValue },
})
export default class RecordListingDetails extends Vue {
  @Prop({ required: true }) readonly person!: person.Person;

  get residencyOptions () {
    return [
      ...app.internalOptionsList3<string>(this, 'residency_status'),
      app.country.defaults.options.otherOption(),
    ];
  };

  get residencyText (): app.Maybe<string> {
    const option = this.residencyOptions.find(
      ({ value }) => value === this.person.residency_status?.[0],
    );
    return option?.item;
  }
}
</script>

<template>
  <div>
    <RecordNamedValue
      v-if="residencyText"
      class="font-14"
    >
      <template #label>
        <t
          class="font-12"
          value="db.record.people.label.residency_status"
        />
      </template>
      <t :value="residencyText" />
    </RecordNamedValue>
  </div>
</template>
