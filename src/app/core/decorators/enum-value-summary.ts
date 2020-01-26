import 'reflect-metadata';

const formatMetadataKey = Symbol('enumSummary');

export interface IEnumValueSummary {
  label: string;
}

function setEnumValueSummary(summary: IEnumValueSummary) {
  return Reflect.metadata(formatMetadataKey, summary);
}

export function getSummaryOfEnumValueValue(target: any, propertyKey: string): IEnumValueSummary {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

export function getLabelOfEnumValue(target: any, propertyKey: string): string {
  return getSummaryOfEnumValueValue(target, propertyKey)?.label;
}
