<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import SchoolsListing from '~/components/database/records/schools/SchoolsListing.vue';
import IndexPage2 from '~/components/database/pages/index/IndexPage2.vue';
import controls from '~/components/controls';
import NewRecordButton from '~/components/database/pages/index/NewRecordButton.vue';
import { BRecordsSelect } from '~/components/controls/inputs';
import ButtonToPath from '~/components/views/application/buttons/ButtonToPath.vue';

@Component({
  components: {
    ButtonToPath,
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
      #resource-actions
    >
      <div class="d-flex">
        <ButtonToPath
          v-if="$ema.canI('act:/schools/actions/create')"
          class="btn-outline-secondary border-0"
          path="/database/schools/new"
        >
          <b-icon icon="clipboard-plus" class="mr-2" />
          <t value="db.page.new.action" />
        </ButtonToPath>
      </div>
    </template>

    <template #search-form="{ group }">
      <b-form-group
        class="col-md-4 col-lg-3"
        label-for="schools_filters_project"
      >
        <template #label>
          <t value="db.record.projects.meta.s" />
        </template>
        <template #default="{ labelId }">
          <BRecordsSelect
            :dom-id="labelId"
            :value="group.getValue('project')"
            entity="projects"
            @change="group.update('project', $event)"
          />
        </template>
      </b-form-group>
    </template>

    <SchoolsListing
      class="mt-3"
      :params="searchParams"
    />

  </IndexPage2>
</template>
