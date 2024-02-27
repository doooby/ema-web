<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';
import SmallDropdownSelect from '~/components/controls/inputs/temporary/SmallDropdownSelect.vue';
import RecordsTablePageSelect from '~/components/views/application/RecordsTable/RecordsTablePageSelect.vue';
import { recordsList } from '~/vendor/wai/mappers';

@Component({
  methods: { recordsList },
  components: {
    RecordsTablePageSelect,
    SmallDropdownSelect,
  },
})
export default class RecordsTableControls extends Vue {
  @Prop({ required: true }) readonly list!: app.Maybe<wai.RecordsList<unknown>>;
  @Prop({ required: true }) readonly queryParams!: app.db.QueryParams;
  @Prop() readonly sortOptions?: app.OptionItem<string>[];
  @Prop() readonly disabled?: boolean;
  @Prop() readonly hidePerPage?: boolean;

  get currentSortOption () {
    const value = this.list?.listing?.order_by?.[0]?.[0];
    if (!value) return;
    return this.sortOptions?.find(option => option.value === value);
  }

  get currentSortDirection () {
    return this.list?.listing?.order_by?.[0]?.[1] === 'ASC' ? 'ASC' : 'DESC';
  }

  onInput (value: Partial<app.db.ListingParams>) {
    this.queryParams.listingParams = {
      page: 0,
      per_page: 0,
      order_by: [],
      ...(this.list?.listing as any),
      ...value,
    };
  }

  onChangeSortOption (value: app.OptionItem<string>[]) {
    const option = value[0];
    if (!option) return;
    this.onInput({
      order_by: [ [ option.value, this.currentSortDirection ?? 'DESC' ] ],
    });
  }

  onChangeSortDirection () {
    if (!this.currentSortOption) return;
    const direction = this.currentSortDirection === 'DESC' ? 'ASC' : 'DESC';
    this.onInput({
      order_by: [ [ this.currentSortOption.value, direction ] ],
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
      <div class="mt-1">
        <div
          v-if="sortOptions?.length"
          class="gray-border-controls"
        >
          <SmallDropdownSelect
            :value="[ currentSortOption ]"
            :options="sortOptions"
            @change="onChangeSortOption($event)"
          >
            <template #content="{ option }">
              <t v-if="option" :value="option.item" />
            </template>
            <template #option-content="{ option }">
              <t :value="option.item" />
            </template>
          </SmallDropdownSelect>
          <div>
            <div
              class="direction--dir-btn gray-border-controls--field--button border-0 "
              @click="onChangeSortDirection"
            >
              {{ currentSortDirection === 'ASC' ? '⇓' : '⇑' }}
            </div>
          </div>
        </div>
        <div class="mt-1" />
      </div>
      <RecordsTablePageSelect
        class="mt-1"
        :value="list"
        :hide-per-page="hidePerPage"
        @select="({ page, perPage }) => onInput({ page, per_page: perPage })"
      />
    </div>
  </b-overlay>
</template>

<style scoped>
.direction--dir-btn {
  font-size: 16px;
}
</style>
