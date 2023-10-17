<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { format } from 'date-fns';
import PrintDate from '~/components/toolkit/PrintDate.vue';
import app from '~/lib/app';

@Component({
  components: { PrintDate },
  methods: { format },
})
export default class DayColumnHeader extends Vue {
  @Prop({ required: true }) readonly date!: Date;

  get weekdayName () {
    if (!this.date) return;
    return app.locales.createDateTimeFormat(
      this.$ema.locale, { weekday: 'long' },
    ).format(this.date);
  }
}
</script>

<template>
  <div class="py-1">
    <PrintDate :value="date" />
    <div class="mt-1 text-muted">
      {{ weekdayName }}
    </div>
  </div>
</template>
