import { controls, FormFieldDefinition } from '~/components/Form';

export function all (): FormFieldDefinition[] {
  return [
    [ 'name', controls.name ],
    [ 'code', controls.text ],
    [ 'contents', controls.text ],
  ];
}
