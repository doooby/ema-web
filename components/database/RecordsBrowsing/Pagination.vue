<template>
  <div
    class="d-flex justify-content-end db--records-browsing--pagination"
    @click="onPageSelect"
  >
    <div :class="{ current: current === 1 }">
      <div data-page="1">
        1
      </div>
    </div>
    <div v-if="current > 4">
      <div>
        ...
      </div>
    </div>
    <div
      v-for="page of pages"
      :key="page"
      :class="{ current: current === page }"
    >
      <div :data-page="page">
        {{ page }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { RequestState } from '~/lib/api';
import * as mappers from '~/lib/api/mappers';

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
    let start = this.current - 2;
    if (start < 2) start = 2;
    let end = this.current + 2;
    if (this.pagesCount < end) end = this.pagesCount;
    const list: number[] = [];
    for (let i = start; i <= end; i += 1) list.push(i);
    return list;
  }

  onPageSelect (event: any) {
    const page = Number(event.target.dataset.page);
    if (!isNaN(page)) this.$emit('select', page);
  }
}
</script>
