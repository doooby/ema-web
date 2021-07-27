<template>
  <edit-page
    entity="students"
    :fields="fields"
    :no-default-redirect="true"
    @success="onSuccess"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import EditPage from '~/components/database/EditPage.vue';

export default Vue.extend({
  components: { EditPage },
  layout: 'database',
  data () {
    return {
      fields: [
        { name: 'first_name_en', control: 'text' },
        { name: 'last_name_en', control: 'text' },
        { name: 'first_name', control: 'text' },
        { name: 'last_name', control: 'text' },
        { name: 'born_on', control: 'date' },
        { name: 'language', control: 'text' },
      ],
    };
  },
  methods: {
    onSuccess (recordId: Number) {
      this.$router.push({ path: `/database/students/${recordId}` });
    },
  },
});
</script>
