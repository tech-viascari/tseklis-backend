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

class LegalEntities {
  constructor({
    entity_id = "",
    business_type = BusinessTypes,
    client_type = ClientTypes,
    company_name = "",
    company_address = "",
    type_of_company = CompanyTypes,
    corporate_tin = "",
    sec_registration_number = "",
    official_email = "",
    alternative_email = "",
    official_contact_number = "",
    alternative_contact_number = "",
    company_logo = "",
    officer_information = OfficerInformationState,
    created_at = new Date(),
    updated_at = new Date(),
  } = {}) {
    this.entity_id = entity_id;
    this.business_type = business_type;
    this.client_type = client_type;
    this.company_name = company_name;
    this.company_address = company_address;
    this.type_of_company = type_of_company;
    this.corporate_tin = corporate_tin;
    this.sec_registration_number = sec_registration_number;
    this.official_email = official_email;
    this.alternative_email = alternative_email;
    this.official_contact_number = official_contact_number;
    this.alternative_contact_number = alternative_contact_number;
    this.company_logo = company_logo;
    this.officer_information = officer_information;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  async create(legalEntity) {
    return db(DB_NAME).insert(legalEntity).returning(DB_PRIMARY_KEY);
  }

  async update(entity_id, legalEntity) {
    return db(DB_NAME).where(DB_PRIMARY_KEY, entity_id).update(legalEntity);
  }

  async delete(entity_id) {
    return db(DB_NAME).where(DB_PRIMARY_KEY, entity_id).del();
  }

  async find(entity_id) {
    return db(DB_NAME).where(DB_PRIMARY_KEY, entity_id).first();
  }

  async findAll() {
    return db(DB_NAME);
  }
}

export default LegalEntities;
