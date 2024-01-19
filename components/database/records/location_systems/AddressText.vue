<template>
  <div>
    <div v-if="failed">
      failed!
    </div>
    <div v-else-if="!locations">
      loading
    </div>
    <ul v-else>
      <li v-for="(location, index) in locations" :key="index">
        <div v-if="location.type === 's'">
          {{ location.location.name[1] }} ({{ location.location.name[0] }})
        </div>
        <div v-else>
          {{ location.text }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { location_system } from '~/lib/records';

// TODO t-locations
@Component
export default class AddressText extends Vue {
  @Prop({ required: true }) readonly system!: location_system.LocationSystem;
  @Prop() readonly address?: string[];

  // TODO type?
  locations: null | any[] = null;
  failed: boolean = false;

  created () {
    this.load();
  }

  @Watch('system')
  @Watch('address')
  onAddressChanged () {
    this.load();
  }

  async load () {
    this.locations = null;
    this.failed = false;

    if (!this.address) return;

    // this.locations = await location_system.loadAddress(
    //   this.system, this.address, this.$api,
    // );

    // if (!this.locations)
    this.failed = true;
  }
}
</script>
