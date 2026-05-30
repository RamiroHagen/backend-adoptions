const initialAdoptions = [];
let adoptions = [...initialAdoptions];
let nextId = 1;

const clone = (value) => JSON.parse(JSON.stringify(value));

export const adoptionService = {
  async getAll() {
    return clone(adoptions);
  },

  async getById(id) {
    return clone(adoptions.find((adoption) => adoption.id === id) || null);
  },

  async create(data) {
    const adoption = {
      id: String(nextId++),
      petId: data.petId,
      adopterId: data.adopterId,
      status: data.status || "pending",
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    adoptions.push(adoption);
    return clone(adoption);
  },

  async updateStatus(id, status) {
    const adoption = adoptions.find((item) => item.id === id);
    if (!adoption) return null;

    adoption.status = status;
    adoption.updatedAt = new Date().toISOString();
    return clone(adoption);
  },

  async delete(id) {
    const index = adoptions.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const [deleted] = adoptions.splice(index, 1);
    return clone(deleted);
  },

  reset(seed = []) {
    adoptions = clone(seed);
    nextId = seed.length + 1;
  }
};
