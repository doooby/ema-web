<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { uniq } from 'lodash';
import { RequestState, SearchRecordsResponsePayload } from '~/lib/api2';

const DESIRED_PAGES = [ -15, -5, -2, -1, 0, 1, 2, 5, 15 ];

export const PER_PAGE = [ 10, 25, 50, 100 ];

@Component
export default class SelectPage extends Vue {
  @Prop({ required: true }) readonly request!: RequestState<SearchRecordsResponsePayload<unknown>>;

  perPage = PER_PAGE[0];

  get payload () : undefined | SearchRecordsResponsePayload<unknown> {
    return this.request.response?.ok ? this.request.response.payload : undefined;
  }

  get currentPage (): number {
    return this.payload?.page || 0;
  }

  get lastPage (): number {
    return this.payload?.pages_count || 0;
  }

  get countOnPage (): number {
    return this.payload?.records?.length || 0;
  }

  get total (): number {
    return this.payload?.total || 0;
  }

  get availablePages (): number[] {
    const topLimit = this.lastPage + 1;
    return uniq([
      1,
      ...(DESIRED_PAGES.map(i => this.currentPage + i)),
      this.lastPage,
    ]
      .filter(i => i > 0 && i < topLimit),
    );
  }

  get perPageOptions () {
    return PER_PAGE.map(per => ({ value: per, text: per }));
  }

  renderContent (page: number): string {
    if (page === 1 && page !== this.currentPage) return '«';
    else if (page === this.lastPage && page !== this.currentPage) return '»';
    else return String(page);
  }

  onPageInput (event) {
    let page = Number(event.target.value);
    if (!isNaN(page)) {
      if (page < 1) page = 1;
      if (page > this.lastPage) page = this.lastPage;
      if (this.currentPage !== page) {
        this.$emit('select', {
          page,
          perPage: this.perPage,
        });
      }
    }
  }

  onPageSelect (event) {
    const page = Number(event.target.dataset.page);
    if (!isNaN(page) && page !== this.currentPage) {
      if (this.currentPage !== page) {
        this.$emit('select', {
          page,
          perPage: this.perPage,
        });
      }
    }
  }

  onPerPageSelect () {
    this.$emit('select', {
      page: 1,
      perPage: this.perPage,
    });
  }
}
</script>

<template>
  <div
    class="pagination d-flex flex-wrap"
    @click="onPageSelect"
  >
    <div class="px-1 d-flex">
      <t value="db.listing.SearchPagination.count" />
      <span>&nbsp;:&nbsp;</span>
      <span>{{ countOnPage }}</span>
      <span>&nbsp;/&nbsp;</span>
      <span>{{ total }}</span>
    </div>
    <div class="pagination-input d-flex px-1">
      <span>
        <t value="db.listing.SearchPagination.pages" />
      </span>
      <span>&nbsp;:&nbsp;</span>
      <input
        type="text"
        class="form-control-plaintext p-0"
        :value="currentPage"
        @blur="onPageInput"
        @keydown.enter="onPageInput"
      >
      <span class="flex-fill">
        &nbsp;/&nbsp;{{ lastPage }}
      </span>
    </div>
    <div class="d-flex px-1">
      <span>
        <t value="db.listing.SearchPagination.per_page" />
      </span>
      <span>&nbsp;:&nbsp;</span>
      <select
        v-model="perPage"
        class="form-control pagination--per_page"
        @change="onPerPageSelect"
      >
        <option
          v-for="option of perPageOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
    </div>
    <div
      v-for="page of availablePages"
      :key="page"
      :class="{ 'pagination-item': true, 'current-page': currentPage === page }"
    >
      <div :data-page="page">
        {{ renderContent(page) }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "assets/css/variables";
.pagination {
  gap: 4px;
}
.pagination > div {
  min-width: 28px;
  height: 28px;
  border: 2px solid $input-bg;
  padding: 2px;
  font-size: 14px;

  &.current-page {
    border-color: $body-color;
    > div {
      background-color: $body-color;
      color: $body-bg;
    }
  }
}
.pagination-input {
  > input {
    font-size: 14px;
    width: 25px;
  }
}
.pagination-item > div {
  text-align: center;
  line-height: 20px;
  user-select: none;
  cursor: pointer;
}
.pagination--per_page {
  height: 20px;
  font-size: 14px;
  padding: 0 4px;
}
</style>
