<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { format } from 'date-fns';

@Component({
  methods: { format },
})
export default class DayColumnHeader extends Vue {
  @Prop({ required: true }) readonly date!: Date;
}
</script>

<template>
  <div>
    {{ $ema.localizeDate(date) }}
    <br>
    <span class="text-muted font-12">
      {{ format(date, 'EEEE') }}
    </span>
  </div>
</template>
