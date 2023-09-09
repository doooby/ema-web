<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import IndexPage2 from '~/components/database/pages/index/IndexPage2.vue';
import controls from '~/components/controls';
import NewRecordButton from '~/components/database/pages/index/NewRecordButton.vue';
import BRecordsSelect from '~/components/controls/inputs/BRecordsSelect.vue';
import GroupsListing from '~/components/database/records/groups/GroupsListing.vue';
import OptionsSelect from '~/components/controls/inputs/OptionsSelect.vue';

const nonAssignedOptions = Object.freeze([
  { value: '', item: 'db.record.groups.filters.non_classified.all' },
  { value: 'only', item: 'db.record.groups.filters.non_classified.only' },
  { value: 'exclude', item: 'db.record.groups.filters.non_classified.exclude' },
]);

@Component({
  components: {
    OptionsSelect,
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
    {
      name: 'non_classified',
      default: () => [ nonAssignedOptions[0] ],
      options: nonAssignedOptions,
      populateParams: (values, params) => {
        params.non_classified =
          values.non_classified?.map(b => b.value)?.[0];
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
      <b-form-group
        class="col-md-4 col-lg-3"
        :label="$t('db.record.groups.filters.non_classified.label')"
      >
        <OptionsSelect
          :value="group.getValue('non_classified')"
          :options="group.fieldsIndex.non_classified.options"
          @change="group.update('non_classified', $event)"
        >
          <template #options="{options, isSelected, onToggleOption}">
            <li
              v-for="option in options"
              :key="option.value"
              class="list-group-item list-group-item-action d-flex"
              style="cursor: pointer;"
              @click="onToggleOption(option)"
            >
              <input type="radio" :checked="isSelected(option)">
              <span class="ml-4">
                <t :value="option.item" />
              </span>
            </li>
          </template>
        </OptionsSelect>
      </b-form-group>
    </template>

    <GroupsListing
      class="mt-3"
      :params="searchParams"
    />

  </IndexPage2>
</template>
