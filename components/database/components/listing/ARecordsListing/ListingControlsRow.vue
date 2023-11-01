<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import SelectPage from '~/components/database/components/listing/SelectPage.vue';
import { RequestState, SearchRecordsResponsePayload } from '~/lib/api2';
import app from '~/lib/app';
import { DropdownSelect } from '~/components/controls/inputs';

export interface ListingControls {
  pagination: {
    page: number;
    perPage: number;
  };
  sort: [ string, string ];
}

@Component({
  components: { DropdownSelect, SelectPage },
})
export default class ListingControlsRow extends Vue {
  @Prop({ required: true }) readonly value!: ListingControls;
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly request!: RequestState<SearchRecordsResponsePayload<unknown>>;
  @Prop() readonly disabled?: boolean;
  @Prop() readonly hidePerPage?: boolean;

  get sortDirections (): app.OptionItem<string>[] {
    if (this.request?.response?.ok && this.request.response.payload.sort_keys?.length) {
      return this.request.response.payload.sort_keys.map(key => ({
        value: key, item: `db.record.${this.entity}.sorting.${key}.caption`,
      }));
    }

    return [];
  }

  get currentOrderKeyValue () {
    const value = this.value.sort?.[0];
    return [ this.sortDirections.find(option => option?.value === value) ];
  }

  get currentSortDirection () {
    return this.value.sort?.[1] ?? 'desc';
  }

  onChangeSortKey (value) {
    this.$emit('input', {
      ...this.value,
      sort: [
        value,
        this.currentSortDirection,
      ],
    });
  }

  onChangeSortDirection () {
    const dir = this.currentSortDirection === 'desc' ? 'asc' : 'desc';
    this.$emit('input', {
      ...this.value,
      sort: [
        this.value.sort?.[0],
        dir,
      ],
    });
  }

  onPaginationChange (pagination) {
    this.$emit('input', {
      ...this.value,
      pagination,
    });
  }
}
</script>

<template>
  <b-overlay :show="disabled" rounded="sm">
    <div
      :class="[
        'd-flex flex-wrap justify-content-between',
        $attrs.class,
      ]"
    >
      <div>
        <div
          v-if="sortDirections.length"
          class="gray-border-controls"
        >
          <DropdownSelect
            :value="currentOrderKeyValue"
            :options="sortDirections"
            @change="$event[0] && onChangeSortKey($event[0].value)"
          >
            <template #button-content="{ option }">
              <t v-if="option" :value="option.item" />
            </template>
            <template #option-content="{ option }">
              <t :value="option.item" />
            </template>
          </DropdownSelect>
          <div>
            <div
              class="direction--dir-btn gray-border-controls--field--button border-0 "
              @click="onChangeSortDirection"
            >
              {{ currentSortDirection === 'asc' ? '⇓' : '⇑' }}
            </div>
          </div>
        </div>
        <div class="mt-1" />
      </div>
      <SelectPage
        :request="request"
        :hide-per-page="hidePerPage"
        @select="onPaginationChange"
      />
    </div>
  </b-overlay>
</template>

<style scoped>
.direction--dir-btn {
  font-size: 16px;
}
</style>
