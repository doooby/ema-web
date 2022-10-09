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
import { Location, LocationSystem } from '~/lib/records';
import { MaybeData } from '~/lib/types';

@Component
export default class SpecialsForm extends Vue {
  fields = buildFormFields([
    [ 'address', 'location', {
      system: {
        id: -1,
        name: [ 'Address' ],
        levels: 3,
        settings: {
          1: { type: 's', name: [ 'County', 'Kraj' ] },
          2: { type: 's', name: [ 'District', 'Okres' ] },
          3: { type: 't', name: [ 'Town', 'Město' ] },
        },
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

function fetchLocations (_system: LocationSystem, parent_id?: number): Promise<MaybeData<Location[]>> {
  return Promise.resolve({
    ok: true,
    data: addresses.locations.filter(location => location.parent_id === parent_id),
  });
}

const addresses = {
  locations: [
    {
      id: 1,
      level: 1,
      name: [ 'Moravian-Silezian Region', 'Moravzkoslezský kraj' ],
      label: '01',
    },
    {
      id: 2,
      level: 1,
      name: [ 'Other Region', 'Jiný Kraj' ],
      label: '02',
    },
    {
      id: 3,
      level: 2,
      parent_id: 1,
      name: [ 'FM distr.', 'Frýdecko-Místecký okres' ],
      label: '01',
    },
    {
      id: 4,
      level: 2,
      parent_id: 1,
      name: [ 'New jersey distr.', 'Novojičínský okres' ],
      label: '02',
    },
    {
      id: 5,
      level: 2,
      parent_id: 2,
      name: [ 'some distr.', 'Jakýsi okrsek' ],
      label: '01',
    },
  ],
};
</script>
