import db from "../database/db.js";

const DB_NAME = "legal_entities";
const DB_PRIMARY_KEY = "entity_id";

const OfficerInformationState = {
  officer_name: "",
  current_residence: "",
  nationality: "",
  incorporator: "Yes",
  board: "Member",
  gender: "Male",
  stockholder: "Yes",
  officer: "Corporate Secretary",
  executive_committee: "N/A",
  tax_identification_number: "",
};
// business types are composed of Sole, Partnership, and Corporation
const BusinessTypes = ["Corporation"];

const ClientTypes = [
  "Viascari Group of Companies",
  "Computershare Clients",
  "External Clients",
];

const CompanyTypes = [
  "Non Stock",
  "Stock Domestic",
  "Stock Foreign Branch Office",
  "Stock Foreign Representative Office",
];

const LegalEntityDetailsState = {
  //corporation muna ito
  business_type: "Corporation",
  client_type: "Viascari Group of Companies",
  company_name: "",
  company_address: "",
  type_of_company: "Non Stock",
  corporate_tin: "",
  sec_registration_number: "",
  official_email: "",
  alternative_email: "",
  official_contact_number: "",
  alternative_contact_number: "",
  officer_information: [],
};

const GdriveFolderState = {
  root_folder_id: "",
  final_docs_id: "",
  sec_cert: "",
  articles_of_incorporation: "",
  by_laws: "",
  bir_cor: "",
  lgu_business_permit: "",
};

const LegalEntityState = {
  entity_id: "",
  entity_details: LegalEntityDetailsState,
  entity_logo: "",
  status: "Active",
  gdrive_folder: GdriveFolderState,
  created_at: new Date(),
  updated_at: new Date(),
};

class LegalEntities {
  constructor({
    entity_id = "",
    entity_details = LegalEntityDetailsState,
    entity_logo = "",
    status = "Active",
    gdrive_folder = GdriveFolderState,
    created_at = new Date(),
    updated_at = new Date(),
  } = {}) {
    this.entity_id = entity_id;
    this.entity_details = entity_details;
    this.entity_logo = entity_logo;
    this.status = status;
    this.gdrive_folder = gdrive_folder;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Fetch all records
  async fetchAll() {
    return await db(DB_NAME).select("*");
  }

  // Fetch a record by ID
  async fetch(columnNames) {
    return await db(DB_NAME).where(columnNames).first();
  }

  // Add a new record
  async add() {
    // Exclude the `entity_id`, `created_at`,`updated_at` from the insert data
    const { entity_id, created_at, updated_at, ...dataToInsert } = this;
    return await db(DB_NAME).insert(dataToInsert).returning(Object.keys(this));
  }

  // Update a record
  async update() {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = LegalEntities.getUpdateFields(dataToUpdate);
    if (Object.keys(fieldsToUpdate).length > 0) {
      return await db(DB_NAME)
        .where({ entity_id: this.entity_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));
    }
    return [this];
  }

  // Delete a record by ID
  async delete(id) {
    return await db(DB_NAME).where(id).del();
  }

  // Static method to prepare fields for updates
  static getUpdateFields(instance) {
    const updates = {};
    for (const key in instance) {
      if (
        instance[key] !== undefined &&
        key !== DB_PRIMARY_KEY &&
        instance[key] !== null
      ) {
        updates[key] = instance[key] === "" ? "" : instance[key];
      }
    }
    return updates;
  }
}

export default LegalEntities;
