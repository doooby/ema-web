export default class ModifiableRecordsList<R extends { id: number }> {
  originalList: R[];
  removedIds: number[] = [];
  addedRecords: R[] = [];

  constructor (originalList: R[]) {
    this.originalList = originalList;
  }

  getRecords (): R[] {
    const removed = this.removedIds;
    return this.addedRecords.concat(this.originalList).filter(
      ({ id }: R) => !removed.includes(id),
    );
  }

  reset (): void {
    this.removedIds.splice(0);
    this.addedRecords.splice(0);
  }

  changed (): boolean {
    return this.removedIds.length > 0 || this.addedRecords.length > 0;
  }

  add (record: R) {
    if (!this.getRecords().find(addedRecord => addedRecord.id === record.id)) {
      this.addedRecords.push(record);
    }
  }

  remove (record: R) {
    const indexInAdded = this.addedRecords.findIndex(
      addedRecord => addedRecord.id === record.id,
    );
    if (indexInAdded === -1) {
      this.removedIds.push(record.id);
    } else {
      this.addedRecords.splice(indexInAdded, 1);
    }
  }
}
