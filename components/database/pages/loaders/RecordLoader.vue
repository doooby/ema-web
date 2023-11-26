<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { wai } from '~/vendor/wai';
import app from '~/lib/app';

export interface RecordLoaderState<R = unknown> {
  isLoading: boolean;
  record?: app.Maybe<wai.AResource<R>>;
  failReason?: string;
  onReload(): void;
}

@Component
export default class RecordLoader extends Vue {
  @Prop({ required: true }) readonly entity!: string;
  @Prop({ required: true }) readonly slices!: string[];
  @Prop({ required: true }) readonly reducer!: (record, associations: wai.Associations) => unknown;
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
    const params = {
      id: this.recordId,
      slices: this.slices,
      per_page: 1,
    };
    await this.$api2.request(
      this.query,
      {
        pathIsFull: true,
        path: `/v3/${this.entity}`,
        params,
        reducer: value => wai.recordShow(value, this.reducer),
      },
    );
    if (this.loaderState.record) {
      this.$emit('load', this.loaderState.record);
    }
  }
}
</script>

<template>
  <div>
    <slot :loader="loaderState" />
  </div>
</template>
