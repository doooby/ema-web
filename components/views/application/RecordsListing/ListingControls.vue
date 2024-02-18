<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import app from '~/lib/app';
import PageSelect from '~/components/views/application/RecordsListing/PageSelect.vue';
import SmallDropdownSelect from '~/components/controls/inputs/temporary/SmallDropdownSelect.vue';

@Component({
  components: { SmallDropdownSelect, PageSelect },
})
export default class ListingControls extends Vue {
  @Prop({ required: true }) readonly resource!: app.api.Resource<app.api.RecordsListing<never>>;
  @Prop() readonly hidePerPage?: boolean;
  @Prop() readonly orderByOptions?: app.OptionItem<string>[];

  get currentListing () {
    return this.resource.state.resource?.listing;
  }

  get currentOrderKeyValue () {
    const value = this.currentListing?.order_by[0]?.[0];
    return [ this.orderByOptions?.find(option => option?.value === value) ];
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
          <SmallDropdownSelect
            :value="currentOrderKeyValue"
            :options="orderByOptions"
            @change="$event[0] && onChangeOrderKey($event[0].value)"
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
