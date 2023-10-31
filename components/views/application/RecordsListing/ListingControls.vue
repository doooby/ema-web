<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import PageSelect from '~/components/views/application/RecordsListing/PageSelect.vue';

@Component({
  components: { PageSelect },
})
export default class ListingControls extends Vue {
  @Prop({ required: true }) readonly resource!: app.api.Resource<app.api.ResourcesListing<never>>;
  @Prop() readonly hidePerPage?: boolean;
  @Prop() readonly orderByOptions?: app.OptionItem<string>[];

  get currentListing () {
    return this.resource.state.resource?.listing;
  }

  get currentOrderDirection () {
    return this.currentListing?.order_by[0]?.[1] ?? 'DESC';
  }

  onChangeOrderKey (value) {
    this.$emit('input', {
      page: this.currentListing?.page,
      per_page: this.currentListing?.per_page,
      order_by: [ [
        value, this.currentOrderDirection,
      ] ],
    } as app.api.ListingParams);
  }

  onChangeOrderDirection () {
    const dir = this.currentOrderDirection === 'DESC' ? 'ASC' : 'DESC';
    this.$emit('input', {
      page: this.currentListing?.page,
      per_page: this.currentListing?.per_page,
      order_by: [ [
        this.currentListing?.order_by[0]?.[0] ?? 'id', dir,
      ] ],
    });
  }

  onPaginationChange (pagination) {
    this.$emit('input', {
      page: pagination.page,
      per_page: pagination.perPage,
      order_by: this.currentListing?.order_by,
    });
  }
}
</script>

<template>
  <b-overlay :show="resource.state.isLoading" rounded="sm">
    <div
      :class="[
        'd-flex flex-wrap justify-content-between',
        $attrs.class,
      ]"
    >
      <div>
        <div
          v-if="orderByOptions?.length"
          class="gray-border-controls"
        >
          <div>
            <select
              :value="currentListing?.order_by[0]?.[0]"
              class="form-control gray-border-controls--field--select"
              @change="onChangeOrderKey($event.target.value)"
            >
              <option
                v-for="option of orderByOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ $t(option.item) }}
              </option>
            </select>
          </div>
          <div>
            <div
              class="dir-btn gray-border-controls--field--button border-0 "
              @click="onChangeOrderDirection"
            >
              {{ currentOrderDirection === 'ASC' ? '⇓' : '⇑' }}
            </div>
          </div>
        </div>
        <div class="mt-1" />
      </div>
      <PageSelect
        :resource="resource"
        :hide-per-page="hidePerPage"
        @select="onPaginationChange"
      />
    </div>
  </b-overlay>
</template>

<style scoped>
.dir-btn {
  font-size: 16px;
}
</style>
