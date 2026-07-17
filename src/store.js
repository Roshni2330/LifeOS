export class SimulationStore {
  constructor() { this.items = new Map(); }
  save(bundle, context) { this.items.set(bundle.id, { ...context, bundle }); return bundle; }
  get(id) { return this.items.get(id); }
}
