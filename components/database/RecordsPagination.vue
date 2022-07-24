<template>
  <div
    class="d-flex justify-content-end db--records-pagination"
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

export default Vue.extend({
  props: {
    current: { type: Number, required: true },
    pagesCount: { type: Number, required: true },
  },
  computed: {
    pages (): number[] {
      let start = this.current - 2;
      if (start < 2) start = 2;
      let end = this.current + 2;
      if (this.pagesCount < end) end = this.pagesCount;
      const list: number[] = [];
      for (let i = start; i <= end; i += 1) list.push(i);
      return list;
    },
  },
  methods: {
    onPageSelect (event: any) {
      const page = Number(event.target.dataset.page);
      if (!isNaN(page)) this.$emit('select', page);
    },
  },
});
</script>
