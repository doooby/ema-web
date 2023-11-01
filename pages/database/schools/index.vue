<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import SchoolsListing from '~/components/database/records/schools/SchoolsListing.vue';
import IndexPage2 from '~/components/database/pages/index/IndexPage2.vue';
import controls from '~/components/controls';
import NewRecordButton from '~/components/database/pages/index/NewRecordButton.vue';
import { BRecordsSelect } from '~/components/controls/inputs';

@Component({
  components: {
    SchoolsListing,
    NewRecordButton,
    IndexPage2,
    BRecordsSelect,
  },
})
export default class extends DatabasePage {
  searchParams = {};
  searchControls = controls.Group.compose(
    {
      name: 'project',
      populateParams: (values: any, params) => {
        params.project_id = values.project?.map(b => b.id)?.[0];
      },
    },
  );
}
</script>

<template>
  <IndexPage2
    entity="schools"
    :search-controls="searchControls"
    @search="searchParams = $event"
  >

    <template
      v-if="$admission.can('schools.create')"
      #resource-actions
    >
      <NewRecordButton entity="schools" />
    </template>

    <template #search-form="{ group }">
      <b-form-group
        v-slot="{ labelId }"
        class="col-md-4 col-lg-3"
        :label="$t('db.record.projects.meta.s')"
        label-for="schools_filters_project"
      >
        <BRecordsSelect
          :dom-id="labelId"
          :value="group.getValue('project')"
          entity="projects"
          @change="group.update('project', $event)"
        />
      </b-form-group>
    </template>

    <SchoolsListing
      class="mt-3"
      :params="searchParams"
    />

  </IndexPage2>
</template>
