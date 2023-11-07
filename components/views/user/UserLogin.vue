<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import RecordName from '~/components/views/application/RecordName.vue';

@Component({
  components: { RecordName },
})
export default class UserLogin extends Vue {
  @Prop() readonly user?: {
    login: string;
    name: string[];
  };
}
</script>

<template>

  <div>
    <RecordName :names="user?.name" />
    <div class="mt-1 font-12">
      {{ user?.login }}
    </div>
  </div>
</template>
