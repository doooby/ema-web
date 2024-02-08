<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import LoadingBlock from '~/components/database/components/LoadingBlock.vue';
import app from '~/lib/app';
import * as sessionStorage from '~/lib/sessionStorage';

@Component({
  components: { LoadingBlock },
})
export default class ApplicationPage extends Vue {
  @Prop({ required: true }) state!: app.page.Page;
  @Prop({ default: true }) autoConnect?: boolean;

  mounted () {
    this.state.pageData = sessionStorage.get(
      sessionStorage.values.pageData.forPage(this.$route.path),
    ) as any ?? undefined;

    this.$emit('connect');
    if (this.autoConnect) this.state.hasConnected = true;
  }

  beforeDestroy () {
    if (this.state.hasSucceeded) {
      sessionStorage.set(
        sessionStorage.values.pageData.forPage(this.$route.path),
      );
    }
  }
}
</script>

<template>
  <div class="container pt-4 pb-5">
    <LoadingBlock
      :is-loading="!state.hasConnected"
      :fail-message="state.hasFailed ? 'application.ApplicationPage.failed' : undefined"
    >
      <template v-if="state.hasFailed" #fail-content>
        <slot name="fail-content" />
      </template>
    </LoadingBlock>
    <slot v-if="state.hasConnected" />
  </div>
</template>
