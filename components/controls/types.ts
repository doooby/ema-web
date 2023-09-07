export interface RegisteredField {
  name: string;
}

export type RegisteredFieldsIndex = Record<string, RegisteredField> & {
  _list: RegisteredField[];
};

export interface FieldDefinition {
  name: string;
}

export interface GroupState {
  values: GroupValues;
}

export type GroupValues = Record<string, unknown>;
