<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';
import SmallDropdownSelect from '~/components/controls/inputs/temporary/SmallDropdownSelect.vue';
import RecordsTablePageSelect from '~/components/views/application/RecordsTable/RecordsTablePageSelect.vue';
import { recordsList } from '~/vendor/wai/mappers';
import MiniToggle from '~/components/views/application/buttons/MiniToggle.vue';

@Component({
  methods: { recordsList },
  components: {
    MiniToggle,
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

  perPageOptions = [ 10, 25, 100 ];

  get currentSortOption () {
    const value = this.list?.listing?.order_by?.[0]?.[0];
    if (!value) return;
    return this.sortOptions?.find(option => option.value === value);
  }

  get currentSortDirection () {
    return this.list?.listing?.order_by?.[0]?.[1] === 'ASC' ? 'ASC' : 'DESC';
  }

  get perPage (): number {
    return this.list?.listing.per_page ?? app.db.LISTING_PER_PAGE_OPTIONS[0];
  }

  get countOnPage (): number {
    return this.list?.records?.length || 0;
  }

  get countTotal (): number {
    return this.list?.total || 0;
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
  <div
    :class="[
      'row',
      $attrs.class,
    ]"
  >
    <div class="col-12 col-md-6 col-lg-4">
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
    </div>
    <div class="col-12 col-md-6 col-lg-4 mt-1 mt-md-0">
      <div
        class="gray-border-controls justify-content-center"
      >
        <div
          v-if="!hidePerPage"
          class="d-flex align-items-center"
          style="gap: 4px;"
        >
          <div>
            <t value="db.listing.SearchPagination.per_page" />
            <span> :</span>
          </div>
          <MiniToggle
            v-for="option in perPageOptions"
            :key="option"
            :value="perPage == option"
            @click="onInput({ page: 1, per_page: option })"
          >
            {{ option }}
          </MiniToggle>
        </div>
        <div class="d-flex">
          <t value="db.listing.SearchPagination.count" />
          <span>&nbsp;:&nbsp;</span>
          <span>{{ countOnPage }}</span>
          <span>&nbsp;/&nbsp;</span>
          <span>{{ countTotal }}</span>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6 col-lg-4 mt-1 mt-lg-0">
      <RecordsTablePageSelect
        :value="list"
        :hide-per-page="hidePerPage"
        @select="(value) => onInput({ page: value.page, per_page: value.perPage })"
      />
    </div>
  </div>
</template>

<style scoped>
.direction--dir-btn {
  font-size: 16px;
}
</style>
