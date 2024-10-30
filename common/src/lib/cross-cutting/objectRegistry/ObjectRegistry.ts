import type { AnyObject, ObjectSchema } from 'yup';
import type { Maybe } from '@vladbasin/ts-types';

export type ObjectRegistryEntryType<TObject extends AnyObject = AnyObject> = {
  schema: ObjectSchema<TObject>;
  defaultValue: TObject;
  securedFields?: (keyof TObject)[];
};

export class ObjectRegistry<TEntry extends ObjectRegistryEntryType<AnyObject> = ObjectRegistryEntryType<AnyObject>> {
  private readonly registry: Record<string, Maybe<TEntry>> = {};

  public add<TValue extends AnyObject, TSpecificEntry extends ObjectRegistryEntryType<TValue>>(
    name: string,
    entry: TSpecificEntry
  ) {
    // Registry entry may contain AnyObject, but for add method we want to enforce ObjectRegistryEntryType to be specific
    this.registry[name] = entry as unknown as Maybe<TEntry>;
    return this;
  }

  public get(name: string): Maybe<TEntry> {
    return this.registry[name];
  }

  public getAllNames(): string[] {
    return Object.keys(this.registry);
  }

  public getAll(): (TEntry & { name: string })[] {
    return Object.entries(this.registry)
      .map(([name, entry]) => (entry ? { ...entry, name } : undefined))
      .filter((entry) => !!entry);
  }
}
