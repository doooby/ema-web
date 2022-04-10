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
      <template #mandatory="{ dataItem }">
        <checkbox-input
          :value="dataItem.mandatory"
          @change="onMandatoryChange(dataItem, $event)"
        />
      </template>
      <template #periods-per-week="{ dataItem }">
        <integer-input
          :value="dataItem.periodsPerWeek"
          @change="onPeriodsPerWeekChange(dataItem, $event)"
        />
      </template>
      <template #periods-total="{ dataItem }">
        <integer-input
          :value="dataItem.periodsTotal"
          @change="onPeriodsTotalChange(dataItem, $event)"
        />
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
        <b-button
          variant="success"
          :disabled="queryUpdateSettings.running"
          @click="onSave"
        >
          <t value="app.action.save" />
        </b-button>
      </div>
    </div>
    <div v-if="errors">
      <div class="row justify-content-end">
        <div class="col-md-6 col-lg-4">
          <record-errors :errors="errors" />
        </div>
      </div>
    </div>
    <b-modal
      v-model="searchShown"
      hide-footer
    >
      <template #modal-title>
        <t value="db.record.course_guidelines.course_settings.subjects_listing.add_modal.title" />
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { SubjectSetting } from '~/components/database/records/course_guidelines/CourseSettings/index.vue';
import RecordLink from '~/components/database/cells/RecordLink.vue';
import RemoveRow from '~/components/database/cells/RemoveRow.vue';
import SearchModal from '~/components/database/SearchModal.vue';
import IntegerInput from '~/components/Form/primitives/IntegerInput.vue';
import CheckboxInput from '~/components/Form/primitives/CheckboxInput.vue';
import * as mappers from '~/lib/api/mappers';
import { CourseGuideline } from '~/lib/records';
import { RecordError } from '~/lib/api/mappers';
import RecordErrors from '~/components/database/RecordErrors.vue';

@Component({
  components: { SearchModal, IntegerInput, CheckboxInput, RecordErrors },
})
export default class SubjectsListing extends Vue {
  @Prop({ required: true }) readonly courseGuideline!: CourseGuideline;
  @Prop({ required: true }) readonly settings!: SubjectSetting[];

  tableColumns = [
    {
      name: 'remove',
      cell: {
        type: RemoveRow,
        onRemove: (item: SubjectSetting) => this.onRemove(item),
      },
      size: 40,
    },
    { name: 'id', cell: { type: RecordLink, onlyId: true }, size: 60 },
    {
      name: 'name',
      headerText: () => this.$t('db.record.subjects.meta.s'),
      getText: (item: SubjectSetting) => item.subject.labels.caption,
    },
    {
      name: 'mandatory',
      headerText: () => this.$t(
        'db.record.course_guidelines.course_settings.subjects_listing.label.mandatory',
      ),
      slot: 'mandatory',
    },
    {
      name: 'periods_per_week',
      headerText: () => this.$t(
        'db.record.course_guidelines.course_settings.subjects_listing.label.periods_per_week',
      ),
      slot: 'periods-per-week',
    },
    {
      name: 'periods_total',
      headerText: () => this.$t(
        'db.record.course_guidelines.course_settings.subjects_listing.label.periods_total',
      ),
      slot: 'periods-total',
    },
  ];

  items = [ ...this.settings ];
  searchShown = false;
  modified = false;
  queryUpdateSettings = this.$api.newQueryState<mappers.RecordChange>();
  errors = null as null | RecordError[];

  @Watch('settings')
  onSettingsChanged () {
    this.items = [ ...this.settings ];
    this.modified = false;
    this.errors = null;
  }

  get currentCountryId (): null | number {
    return this.$store.state.session.currentCountry?.id ?? null;
  }

  onRemove (item: SubjectSetting) {
    const index = this.items.indexOf(item);
    if (index === -1) return;
    this.items.splice(index, 1);
    this.modified = true;
  }

  onAddSubject (subject: mappers.AssociatedRecord) {
    this.searchShown = false;
    this.items.push({
      id: subject.id,
      subject,
      mandatory: false,
      periodsPerWeek: 0,
      periodsTotal: 0,
    });
    this.modified = true;
  }

  onMandatoryChange (item: SubjectSetting, value: any) {
    item.mandatory = value;
    this.modified = true;
  }

  onPeriodsPerWeekChange (item: SubjectSetting, value: any) {
    item.periodsPerWeek = value;
    this.modified = true;
  }

  onPeriodsTotalChange (item: SubjectSetting, value: any) {
    item.periodsTotal = value;
    this.modified = true;
  }

  async onSave () {
    const result = await this.$api.request({
      path: `/course_guidelines/${this.courseGuideline.id}/update_settings`,
      params: {
        settings: {
          subjects: this.items.map(item => ({
            id: item.id,
            mandatory: item.mandatory,
            periods_per_week: item.periodsPerWeek,
            periods_total: item.periodsTotal,
          })),
        },
      },
      mapper: mappers.changedRecord,
    }, this.queryUpdateSettings);
    if (result?.success) {
      this.$emit('updated');
    } else if (result?.errors) {
      this.errors = result.errors;
    } else {
      this.errors = [ [ 'base', 'unknown fail' ] ];
    }
  }
}
</script>
