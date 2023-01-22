<template>
  <div
    class="d-flex justify-content-end db--records-browsing--pagination"
    @click="onPageSelect"
  >
    <div
      v-for="{page, text} of slots"
      :key="page"
      :class="{ current: current === page }"
    >
      <div :data-page="page">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { RequestState } from '~/lib/api';
import * as mappers from '~/lib/api/mappers';
import { uniq } from 'lodash';

interface Slot {
  page: number;
  text: string
}

@Component
export default class Pagination<R extends mappers.RecordBase> extends Vue {
  @Prop({ required: true }) readonly requestState!: RequestState<mappers.PaginatedRecords<R>>;

  get current (): number {
    return this.requestState.value?.page || 1;
  }

  get pagesCount (): number {
    return this.requestState.value?.pages_count || 0;
  }

  get pages (): number[] {
    let list: number[] = [];

    list.push(1);
    list.push(this.current - 5);
    list.push(this.current - 2);
    list.push(this.current - 1);
    list.push(this.current);
    list.push(this.current + 1);
    list.push(this.current + 2);
    list.push(this.current + 5);
    list.push(this.pagesCount);

    list = list.sort((a, b) => a - b);
    list = list.filter(page => page > 0 && page < (this.pagesCount + 1));
    return uniq(list);
  }

  get slots (): Slot[] {
    const slots: Slot[] = [];

    for (let i = 0, len = this.pages.length, last = len - 1; i < len; i += 1) {
      const page = this.pages[i];
      if (i === 0 && this.current !== 1) {
        slots.push({ page, text: '«' });
      } else if (i === last && this.current !== this.pagesCount) {
        slots.push({ page, text: '»' });
      } else {
        slots.push({ page, text: String(page) });
      }
    }

    return slots;
  }

  onPageSelect (event: any) {
    const page = Number(event.target.dataset.page);
    if (!isNaN(page)) this.$emit('select', page);
  }
}
</script>
