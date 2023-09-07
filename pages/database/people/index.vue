<script lang="ts">
import { Component } from 'vue-property-decorator';
import { DatabasePage } from '~/components';
import PeopleListing from '~/components/database/records/people/PeopleListing.vue';
import MoveStudents from '~/components/database/records/groups/students/actions/MoveStudents.vue';
import IndexPage2 from '~/components/database/pages/index/IndexPage2.vue';
import NewRecordButton from '~/components/database/pages/index/NewRecordButton.vue';
import SearchForm from '~/components/database/pages/index/SearchForm.vue';
import controls from '~/components/controls';

@Component({
  components: {
    SearchForm,
    PeopleListing,
    NewRecordButton,
    IndexPage2,
    MoveStudents,
  },
})
export default class extends DatabasePage {
  searchParams = {};
  searchControls = controls.Group.compose();
}
</script>

<template>
  <IndexPage2
    entity="people"
    :search-controls="searchControls"
    @search="searchParams = $event"
  >

    <template
      v-if="$admission.can('people.create')"
      #resource-actions
    >
      <NewRecordButton entity="people" />
    </template>

    <template #search-form="{}" />

    <PeopleListing
      class="mt-3"
      :params="searchParams"
    >
      <template
        v-if="$admission.can('groups.move_students')"
        #group-actions="{ records }"
      >
        <MoveStudents :students="records" />
      </template>
    </PeopleListing>

  </IndexPage2>
</template>
