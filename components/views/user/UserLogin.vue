<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class UserLogin extends Vue {
  @Prop() readonly user?: {
    login: string;
    name: string[];
  };
}
</script>

<template>
  <div>
    <div class="h5">
      {{ user?.name?.[0] }}
    </div>
    <div>
      {{ user?.name?.[1] }}
    </div>
    <div class="mt-1 font-12">
      {{ user?.login }}
    </div>
  </div>
</template>
