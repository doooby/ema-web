<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import LoadingBlock from '~/components/database/components/LoadingBlock.vue';
import * as localStorage from '~/lib/localStorage';
import app from '~/lib/app';

// TODO depricated

export interface ActionParams<P> {
  params: P;
  onClean(): void;
}

@Component({
  components: { LoadingBlock },
})
export default class ActionPage2 extends Vue {
  @Prop({ default: true }) readonly isConnected!: boolean;

  params = app.nullable<unknown>();
  hasFailed = false;

  mounted () {
    if (this.actionData) {
      localStorage.set(localStorage.values.actionPageData, this.actionData);
      this.params = this.actionData;
    } else {
      const data = localStorage.get(localStorage.values.actionPageData);
      if (data) this.params = data;
    }

    if (this.params) {
      this.$emit('connect', {
        params: this.params,
        onClean: () => this.onCleanAction(),
      } as ActionParams<unknown>);
    } else {
      this.hasFailed = true;
    }
  }

  get actionData (): unknown {
    return this.$store.state.action.data;
  }

  onCleanAction () {
    this.$store.commit('action/setActionData');
  }
}
</script>

<template>
  <div class="container pt-4 pb-5">
    <LoadingBlock
      :is-loading="!params || !isConnected"
      :fail-message="hasFailed ? 'app.action_page.missing_data' : undefined"
    >
      <template v-if="hasFailed" #fail-content>
        <div class="text-muted font-12 mt-2">
          <t value="app.action_page.missing_data_note" />
        </div>
      </template>
    </LoadingBlock>
    <slot v-if="isConnected" />
  </div>
</template>
