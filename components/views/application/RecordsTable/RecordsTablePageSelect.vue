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

  get countOnPage (): number {
    return this.value?.records?.length || 0;
  }

  get total (): number {
    return this.value?.total || 0;
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
    return [ 10, 25, 100 ];
  }

  renderContent (page: number): string {
    if (page === 1 && page !== this.currentPage) return '«';
    else if (page === this.lastPage && page !== this.currentPage) return '»';
    else return String(page);
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

  onPerPageSelect (value) {
    this.$emit('select', {
      page: 1,
      perPage: value,
    });
  }
}
</script>

<template>
  <div :class="$attrs.class">

    <div class="pagination-row d-flex justify-content-end flex-wrap">
      <div
        v-if="!hidePerPage"
        class="d-flex px-1 align-items-center"
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
          @click="onPerPageSelect(option)"
        >
          {{ option }}
        </MiniToggle>
      </div>
      <div class="px-1 d-flex">
        <t value="db.listing.SearchPagination.count" />
        <span>&nbsp;:&nbsp;</span>
        <span>{{ countOnPage }}</span>
        <span>&nbsp;/&nbsp;</span>
        <span>{{ total }}</span>
      </div>
    </div>

    <div
      class="mt-1 pagination-row d-flex justify-content-end"
      @click="onPageSelect"
    >
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
  padding: 0 2px;
}
.pagination--per_page {
  height: 20px;
  font-size: 14px;
  padding: 0 4px;
}
</style>
