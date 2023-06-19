<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { uniq } from 'lodash';
import { RequestState, SearchRecordsResponsePayload } from '~/lib/api2';

const DESIRED_PAGES = [ -15, -5, -2, -1, 0, 1, 2, 5, 15 ];

@Component
export default class SearchRecordsPagination extends Vue {
  @Prop({ required: true }) readonly request!: RequestState<SearchRecordsResponsePayload<unknown>>;

  get payload () : undefined | SearchRecordsResponsePayload<unknown> {
    return this.request.response?.ok ? this.request.response.payload : undefined;
  }

  get currentPage (): number {
    return this.payload?.page || 1;
  }

  get lastPage (): number {
    return this.payload?.pages_count || 0;
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

  renderContent (page: number): string {
    if (page === 1 && page !== this.currentPage) return '«';
    else if (page === this.lastPage && page !== this.currentPage) return '»';
    else return String(page);
  }

  onPageSelect (event) {
    const page = Number(event.target.dataset.page);
    if (!isNaN(page) && page !== this.currentPage) {
      this.$emit('select', page);
    }
  }
}
</script>

<template>
  <div
    class="pagination"
    @click="onPageSelect"
  >
    <div
      v-for="page of availablePages"
      :key="page"
      :class="{ current: currentPage === page }"
    >
      <div :data-page="page">
        {{ renderContent(page) }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "assets/css/variables";
.pagination > div {
  min-width: 28px;
  height: 28px;
  border: 2px solid $input-bg;
  padding: 2px;

  margin-right: 4px;
  &:last-child { margin-right: 0; }

  &.current {
    border-color: $body-color;
    > div {
      background-color: $body-color;
      color: $body-bg;
    }
  }

  > div {
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    user-select: none;
    cursor: pointer;
  }
}
</style>
