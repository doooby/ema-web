<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ARecordLink from '~/components/database/components/ARecordLink.vue';
import TextNames from '~/components/database/components/TextNames.vue';
import ARecordsListing from '~/components/database/components/listing/ARecordsListing/ARecordsListing.vue';
import { Params } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { Column } from '~/components/DataTable/v3';
import BRecordLink from '~/components/database/components/BRecordLink.vue';
import UserPrivileges from '~/components/database/records/users/views/UserPrivileges.vue';

@Component({
  components: { UserPrivileges, ARecordsListing, ARecordLink, TextNames, BRecordLink },
})
export default class RecordsListing extends Vue {
  @Prop({ default: () => [] }) readonly initialColumns!: Column[];
  @Prop({ default: () => {} }) readonly params!: Params;

  get showCountry (): boolean {
    const { user } = this.$store.state.session;
    return !!(user?.countries && user.countries.length);
  }

  get columns (): any {
    return [
      { name: 'id', size: 80 },
      (this.showCountry && { name: 'country', size: 250 }),
      ...application_record.fillDataTableColumns('users', [
        { name: 'login' },
        { name: 'full_name' },
        { name: 'privileges' },
      ]),
    ].filter(id => id);
  }
}
</script>

<template>
  <a-records-listing
    :class="$attrs.class"
    entity="users"
    :initial-columns="initialColumns"
    :columns="columns"
    :params="params"
    @change="$emit('change', $event)"
  >
    <template
      v-if="$admission.can('users.update')"
      #record-actions="{ record }"
    >
      <b-dropdown-item :to="`/database/users/${record.id}/edit`">
        <b-icon icon="pencil" />
        <t value="db.page.edit.action" />
      </b-dropdown-item>
    </template>
    <template v-if="$scopedSlots['group-actions']" #group-actions="{ records }">
      <slot name="group-actions" :records="records" />
    </template>
    <template #row="{ record }">
      <td>
        <a-record-link :id="record.id" entity="users" />
      </td>
      <td v-if="showCountry && record.country">
        <b-record-link entity="countries" :record="record.country" />
      </td>
      <td>
        {{ record.login }}
      </td>
      <td>
        <text-names class="single-row-cell" :value="record.full_name" />
      </td>
      <td>
        <UserPrivileges :user="record" />
      </td>
      <td />
    </template>
  </a-records-listing>
</template>
