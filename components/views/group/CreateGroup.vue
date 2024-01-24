<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CreateLinkedGroupParams } from '~/pages/database/groups/new_linked.vue';
import { wai } from '~/vendor/wai';

@Component
export default class CreateGroup extends Vue {
  @Prop() readonly parent?: wai.AResource;

  onClick () {
    if (this.parent) {
      const data: CreateLinkedGroupParams = { parent: this.parent };
      this.$store.dispatch('action/goToActionPage', {
        context: this,
        newPage: '/database/groups/new_linked',
        data,
      });
    } else {
      this.$store.dispatch('action/goToActionPage', {
        context: this,
        newPage: '/database/groups/new',
        data: {},
      });
    }
  }
}
</script>

<template>
  <button
    :class="[ $attrs.class, 'btn btn-outline-secondary' ]"
    @click="onClick"
  >
    <slot />
  </button>
</template>
