<template>
  <div>
    <data-table-view
      :class="{ __modified: modified }"
      :columns="tableColumns"
      :dataset="items"
    >
      <template #footer-row>
        <b-button
          variant="outline-primary"
          class="btn-xs"
          @click="searchShown = true"
        >
          <b-icon icon="plus" />
        </b-button>
      </template>
    </data-table-view>
    <div
      v-if="modified"
      class="d-flex align-items-center justify-content-between emt-2"
    >
      <span class="text-ema-primary">
        <b-icon icon="info-circle" />
        <t value="form.changed" />
      </span>
      <div>
        <b-button variant="success" @click="onSave">
          <t value="app.action.save" />
        </b-button>
      </div>
    </div>
    <b-modal
      v-model="searchShown"
      hide-footer
    >
      <template #modal-title>
        <t value="db.record.course_guidelines.subject_settings.subject_listing.add_modal.title" />
      </template>
      <search-modal
        v-if="searchShown"
        :query="$api.queries.subjects.searchAssociated"
        :params="{ country_id: currentCountryId }"
        :selected-ids="items.map(item => item.id)"
        @select="onAddSubject"
      />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { SubjectSetting } from '~/components/database/records/course_guidelines/CourseSettings/index.vue';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import RemoveRow from '~/components/database/cells/RemoveRow.vue';
import SearchModal from '~/components/database/SearchModal.vue';
import { AssociatedRecord } from '~/lib/api/mappers';

@Component({
  components: { SearchModal },
})
export default class SubjectsListing extends Vue {
  @Prop({ required: true }) readonly subjectSettings!: SubjectSetting[];

  tableColumns = [
    {
      name: 'remove',
      cell: {
        type: RemoveRow,
        onRemove: (item: SubjectSetting) => this.onRemove(item),
      },
      headerText: false,
      size: 40,
    },
    { name: 'id', cell: { type: RecordLink, onlyId: true }, size: 60 },
    { name: 'name', getText: (item: SubjectSetting) => item.subject.labels.caption },
  ];

  items = [ ...this.subjectSettings ];
  modified = false;
  searchShown = false;

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  onRemove (item: SubjectSetting) {
    const index = this.items.indexOf(item);
    if (index === -1) return;
    this.items.splice(index, 1);
    this.modified = true;
  }

  onAddSubject (subject: AssociatedRecord) {
    this.searchShown = false;
    this.items.push({ id: subject.id, subject });
    this.modified = true;
  }

  onSave () {

  }
}
</script>
