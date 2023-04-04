<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { RequestState, SearchRecordsResponsePayload } from '~/lib/api2';
import { uniq } from 'lodash';
import TextInput from '~/components/Form/primitives/TextInput.vue';

interface Slot {
  page: number;
  text: string
}

@Component({
  components: { TextInput },
})
export default class SearchPagination extends Vue {
  @Prop({ required: true }) readonly query!: RequestState<SearchRecordsResponsePayload>;

  get responsePayload (): null | SearchRecordsResponsePayload {
    return this.query.response?.ok ? this.query.response.payload : null;
  }

  get current (): number {
    return this.responsePayload?.page ?? 1;
  }

  get pagesCount (): number {
    return this.responsePayload?.pages_count ?? 0;
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

  onSelectPage (page) {
    this.$emit('select', page);
  }

  onInputPage (value) {
    const page = Number(value);
    if (!isNaN(value) && value > 0 && value <= (this.responsePayload?.pages_count ?? 0)) {
      this.$emit('select', page);
    }
  }
}
</script>

<template>
  <div
    class="d-flex align-items-center db--listing--search-pagination"
  >
    <div v-if="responsePayload">
      <span>{{ responsePayload.total }}</span>
      <t value="db.listing.SearchPagination.count" />
    </div>
    <div class="mx-2">
      -
    </div>
    <div v-if="responsePayload" :style="{ maxWidth: '70px'}">
      <text-input
        :value="current"
        @submit="onInputPage"
      />
    </div>
    <div
      v-for="{ page, text } of slots"
      :key="page"
      :class="{ '--item': true, current: current === page }"
    >
      <div @click="onSelectPage(page)">
        {{ text }}
      </div>
    </div>
  </div>
</template>
