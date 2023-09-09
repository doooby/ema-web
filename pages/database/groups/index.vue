<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import IndexPage2 from '~/components/database/pages/index/IndexPage2.vue';
import controls from '~/components/controls';
import NewRecordButton from '~/components/database/pages/index/NewRecordButton.vue';
import BRecordsSelect from '~/components/controls/inputs/BRecordsSelect.vue';
import GroupsListing from '~/components/database/records/groups/GroupsListing.vue';

@Component({
  components: {
    GroupsListing,
    NewRecordButton,
    IndexPage2,
    BRecordsSelect,
  },
})
export default class extends DatabasePage {
  searchParams = {};
  searchControls = controls.Group.compose(
    {
      name: 'school',
      populateParams: (values, params) => {
        params.school_id = values.school?.map(b => b.id)?.[0];
      },
      onChange: (values) => {
        values.courses = undefined;
      },
    },
    {
      name: 'courses',
      populateParams: (values, params) => {
        params.course_id =
          values.courses?.map(b => b.id);
      },
    },
  );
}
</script>

<template>
  <IndexPage2
    entity="groups"
    :search-controls="searchControls"
    @search="searchParams = $event"
  >

    <template
      v-if="$admission.can('groups.create')"
      #resource-actions
    >
      <NewRecordButton entity="groups" />
    </template>

    <template #search-form="{ group }">
      <b-form-group
        v-slot="{ labelId }"
        class="col-md-4 col-lg-3"
        :label="$t('db.record.schools.meta.s')"
        label-for="groups_filters_school"
      >
        <BRecordsSelect
          :dom-id="labelId"
          :value="group.getValue('school')"
          entity="schools"
          @change="group.update('school', $event)"
        />
      </b-form-group>
      <b-form-group
        v-slot="{ labelId }"
        class="col-md-4 col-lg-3"
        :label="$t('db.record.courses.meta.s')"
        label-for="groups_filters_courses"
      >
        <BRecordsSelect
          :dom-id="labelId"
          :value="group.getValue('courses')"
          entity="courses"
          :params="{ school_id: group.getParam('school_id') }"
          @change="group.update('courses', $event)"
        />
      </b-form-group>
    </template>

    <GroupsListing
      class="mt-3"
      :params="searchParams"
    />

  </IndexPage2>
</template>
