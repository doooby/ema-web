<template>
  <div class="d-flex">
    <div class="flex-fill text-truncate form--control-label">
      {{ selectedOption?.text }}
    </div>
    <b-button :id="domId" :disabled="disabled" @click="modalShown = true">
      <b-icon icon="chevron-down" />
    </b-button>
    <search-modal
      v-model="modalShown"
      :list="options"
      :selected="selectedOption"
      @select="OnSelect($event)"
    >
      <template #title>
        <slot name="modal-title" />
      </template>
    </search-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { MaybeData, Option } from '~/lib/types';
import SearchModal from '~/components/Form/primitives/SearchModal.vue';

export type OptionsSource =
  | { list: Option[] }
  | { fetch: () => Promise<MaybeData<Option[]>> };

@Component({
  components: { SearchModal },
})
export default class SelectWithModal extends Vue {
  @Prop({ default: () => undefined }) readonly domId?: string;
  @Prop({ required: true }) readonly value!: string;
  @Prop({ required: true }) readonly optionsSource!: OptionsSource;
  @Prop() readonly disabled?: boolean;

  state: 'initial' | 'loading' | 'loaded' | 'failed' = 'initial';
  options: Option[] = [];
  modalShown = false;

  created () {
    if (!this.disabled) this.loadOptions();
  }

  @Watch('optionsSource')
  onOptionsSourceChange () {
    this.state = 'initial';
    this.options = [];
    if (!this.disabled) this.loadOptions();
  }

  @Watch('disabled')
  onDisabledChanged () {
    if (this.disabled) return;
    if (this.state === 'initial') this.loadOptions();
  }

  get selectedOption (): undefined | Option {
    return this.options.find(option => option.value === this.value);
  }

  OnSelect (value: string) {
    this.modalShown = false;
    this.$emit('select', value);
  }

  async loadOptions () {
    if ('fetch' in this.optionsSource) {
      this.state = 'loading';
      this.options = [];
      const result = await this.optionsSource.fetch();
      if (result.ok) {
        this.options = result.data;
        this.state = 'loaded';
      } else {
        this.state = 'failed';
      }
    } else {
      this.state = 'loaded';
      this.options = this.optionsSource.list;
    }
  }
}
</script>
