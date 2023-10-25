<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { wai } from '~/vendor/wai';

export interface RecordLoaderState<R = unknown> {
  isLoading: boolean;
  record?: wai.ResourceShow<R>;
  failReason?: string;
  onReload(): void;
}

@Component
export default class RecordLoader extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly slices!: string[];
  @Prop() readonly id?: string;
  @Prop() readonly idFromParams?: string;

  query = this.$api2.newQueryState<wai.ResourceShow<unknown>>();

  onReload = () => this.onLoadRecord();

  mounted () {
    this.onLoadRecord();
  }

  get recordId (): string {
    let value;
    if (this.id) {
      value = this.id;
    } else if (this.idFromParams) {
      value = this.$route.params[this.idFromParams];
    }
    return value || '-1';
  }

  get loaderState (): RecordLoaderState {
    const { processing: isLoading, response } = this.query;
    return {
      isLoading,
      record: response?.ok ? response.payload : undefined,
      failReason: response?.ok === false ? response.reason : undefined,
      onReload: this.onReload,
    };
  }

  @Watch('entity')
  @Watch('recordId')
  async onLoadRecord () {
    await this.$api2.request(
      this.query,
      this.$api2.getQuery(this.entity, 'V3_show')({
        id: this.recordId,
        slices: this.slices,
      }),
    );
  }
}
</script>

<template>
  <div>
    <slot :loader="loaderState" />
  </div>
</template>
