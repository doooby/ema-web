<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { uniq } from 'lodash';
import app from '~/lib/app';
import { wai } from '~/vendor/wai';
import MiniToggle from '~/components/views/application/buttons/MiniToggle.vue';

const DESIRED_PAGES = [ -15, -5, -2, -1, 0, 1, 2, 5, 15 ];

@Component({
  components: { MiniToggle },
})
export default class RecordsTablePageSelect extends Vue {
  @Prop({ required: true }) readonly value!: app.Maybe<wai.RecordsList<unknown>>;
  @Prop() readonly hidePerPage?: boolean;

  get currentPage (): number {
    return this.value?.listing.page || 0;
  }

  get perPage (): number {
    return this.value?.listing.per_page ?? app.db.LISTING_PER_PAGE_OPTIONS[0];
  }

  get pagesCount (): number {
    return Math.ceil(
      (this.value?.total ?? 0) / (this.perPage),
    );
  }

  get lastPage (): number {
    return this.pagesCount || 0;
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

  get extendedPages (): {
    page: number,
    text: string,
    disabled: boolean,
  }[] {
    if (this.pagesCount < 2) return [];
    return [
      { page: 1, text: '«', disabled: this.currentPage === 1 },
      { page: this.currentPage - 1, text: '‹', disabled: this.currentPage < 2 },
      { page: this.currentPage + 1, text: '›', disabled: this.currentPage >= this.lastPage },
      { page: this.lastPage, text: '»', disabled: this.currentPage === this.lastPage },
    ];
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
}
</script>

<template>
  <div
    :class="[
      'pagination-row d-flex justify-content-end',
      $attrs.class,
    ]"
    @click="onPageSelect"
  >
    <div
      v-for="{ page, text, disabled } of extendedPages"
      :key="`e-${page}`"
      class="pagination-item"
    >
      <div :data-page="disabled ? undefined : page">
        {{ text }}
      </div>
    </div>
    <div
      v-for="page of availablePages"
      :key="`p-${page}`"
      :class="{ 'pagination-item': true, 'current-page': currentPage === page }"
    >
      <div :data-page="page">
        {{ page }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "assets/css/variables";
.pagination-row {
  gap: 4px;
  > div {
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
}
.pagination-item > div {
  text-align: center;
  line-height: 20px;
  user-select: none;
  cursor: pointer;
  padding: 0 2px;
}
</style>
