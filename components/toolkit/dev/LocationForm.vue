<template>
  <div class="card">
    <div class="card-header">
      Location
    </div>
    <div class="card-body pt-3 pb-0">
      <form-group v-model="values" :fields="fields" />
    </div>
    <div class="card-footer">
      <pre class="mt-3 mb-0">{{ JSON.stringify(values, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { buildFormFields, prefillFormValues } from '~/components/Form';
import { Location } from '~/lib/records';
import { MaybeData } from '~/lib/types';

@Component
export default class SpecialsForm extends Vue {
  fields = buildFormFields([
    [ 'address', 'location', {
      system: {
        id: -1,
        levels: [
          { type: 'list', name: 'Kraj', name_en: 'County' },
          { type: 'list', name: 'Okres', name_en: 'District' },
          { type: 'text', name: 'Ulice', name_en: 'Street' },
          { type: 'list', name: 'Město', name_en: 'Town' },
        ],
      },
      fetchLocations,
    } ],
  ]);

  defaultValues = {}

  values = {
    ...prefillFormValues(this.fields),
    ...this.defaultValues,
  };
}

function fetchLocations (level: number, parent_id?: string): MaybeData<Location[]> {
  console.log({ level, parent_id });
  let list = addresses.locations.filter(location => location.level === level);
  if (parent_id) {
    list = list.filter(location => location.parent_id === parent_id);
  }
  return { ok: true, data: list };
}

const addresses = {
  locations: [
    {
      id: '1',
      level: 1,
      name: 'Moravzkoslezský kraj',
      name_en: 'Moravian-Silezian Country',
    },
    {
      id: '2',
      level: 1,
      name: 'Jiný Kraj',
      name_en: 'Other Country',
    },
    {
      id: '3',
      level: 2,
      parent_id: '1',
      name: 'Frýdecko-Místecký okres',
      name_en: 'FM distr.',
    },
    {
      id: '4',
      level: 2,
      parent_id: '1',
      name: 'Novojičínský okres',
      name_en: 'New jersey distr.',
    },
    {
      id: '5',
      level: 2,
      parent_id: '2',
      name: 'Jakýsi okrsek',
      name_en: 'some distr.',
    },
  ],
};
</script>
