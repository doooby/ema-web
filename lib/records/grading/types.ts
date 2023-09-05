export type GradingDefinition =
  | {
    type: 'number';
    limit: [number, number];
    options: string[];
    requiredIndex?: number;
  }
  | {
    type: 'letter';
    limit: [number, number];
    options: string[];
    requiredIndex?: number;
  };
