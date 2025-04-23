import db from "../database/db.js";

const DB_NAME = "gis_documents";
const DB_PRIMARY_KEY = "gis_document_id";

const authCapitalStockState = {
  type_of_shares: "COMMON",
  number_of_shares: 0,
  par_or_stated_value: 1,
  amount: 0,
};

const filipinoSubscribeCapitalState = {
  number_of_stock_holders: 0,
  types_of_shares: "",
  number_of_shares: 0,
  number_of_shares_in_hands: "",
  par_or_stated_value: 0,
  amount: 0,
  percent_of_ownership: "",
};

const foreignSubscribeCapitalState = {
  nationality: "",
  number_of_stock_holders: "",
  types_of_shares: "",
  number_of_shares: "",
  number_of_shares_in_hands: "",
  par_or_stated_value: "",
  amount: "",
  percent_of_ownership: "",
};

const filipinoPaidUpCapitalState = {
  number_of_stock_holders: "",
  types_of_shares: "",
  number_of_shares: "",
  par_or_stated_value: "",
  amount: "",
  percent_of_ownership: "",
};

const foreignPaidUpCapitalState = {
  nationality: "",
  number_of_stock_holders: "",
  types_of_shares: "",
  number_of_shares: "",
  par_or_stated_value: "",
  amount: "",
  percent_of_ownership: "",
};

const subscribeCapitalState = {
  filipino: [],
  foreign: [],
  sub_total_number_of_shares_filipino: 0,
  sub_total_amount_filipino: 0,
  sub_total_ownership_filipino: 0,
  sub_total_number_of_shares_foreign: 0,
  sub_total_amount_foreign: 0,
  sub_total_ownership_foreign: 0,
  total_number_of_shares: 0,
  total_amount: 0,
  total_percent_of_ownership: 0,
  percentage_of_foreign_equity: 0,
};

const paidUpCapitalState = {
  filipino: [],
  foreign: [],
  sub_total_number_of_shares_filipino: 0,
  sub_total_amount_filipino: 0,
  sub_total_ownership_filipino: 0,
  sub_total_number_of_shares_foreign: 0,
  sub_total_amount_foreign: 0,
  sub_total_ownership_foreign: 0,
  total_number_of_shares: 0,
  total_amount: 0,
  total_percent_of_ownership: 0,
};

const directorsOrOfficersState = {
  name: "",
  current_residential_address: "",
  nationality: "",
  incorporator: "",
  board: "",
  gender: "",
  stock_holder: "",
  officer: "",
  executive_committee: "",
  tax_id_number: "",
  individuals_id: "",
};

const beneficialOwnershipDeclarationState = {
  complete_name: "",
  specific_residential_address: "",
  nationality: "",
  date_of_birth: "",
  tax_id_number: "",
  percent_of_ownership: "",
  type_of_beneficial_owner: "",
  category_of_beneficial_ownership: "",
};

const stockholdersInformationState = {
  name: "",
  nationality: "",
  current_residential_address: "",
  type: "COMMON",
  number: "",
  amount: "",
  percent_of_ownership: "",
  amount_paid: "",
  tax_id_number: "",
  total_number: 0,
  total_amount: 0,
};

const affiliationsState = {
  name: "N/A",
  sec_no: "N/A",
  address: "N/A",
};

const GISDocumentDataState = {
  is_amended: false,
  is_special_meeting: false,
  year: "",
  date_registered: "",
  official_email_address: "",
  corporate_name: "",
  fiscal_year_end: "",
  alternate_email_address: "",
  business_or_trade_name: "",
  corporate_tin: "",
  official_mobile_number: "",
  sec_registration_number: "",
  website_url_address: "N/A",
  name_of_external_auditor: "",
  date_of_annual_meeting: "",
  fax_number: "N/A",
  sec_accreditation_number: "",
  actual_date_of_annual_meeting: "",
  alternate_phone_number: "",
  industry_classification: "",
  complete_principal_office_address: "",
  telephone_number: "",
  geographical_code: "N/A",
  nature_of_business: "",
  primary_purpose: "",
  is_under_AMLA: false,
  has_complied_with_the_requirements: false,
  auth_capital_stock: {
    capital_stocks: [],
    total_number_of_shares: 0,
    total_amount: 0,
  },
  subscribe_capital: subscribeCapitalState,
  paid_up_capital: paidUpCapitalState,
  directors_or_officers: [],
  total_number_of_stockholders: 0,
  number_of_stockholders_with_more_shares_each: 0,
  total_assets_based_on_latest_audited: "",
  stock_holders_information: {
    information: [],
    total_amount: 0,
    total_percent_of_ownership: 0,
  },
  corporate_secretary: "",
  beneficial_ownership_declaration: [],
  affiliations: {
    parent: affiliationsState,
    subsidiary_affiliate: [affiliationsState],
  },
};

const GISStatusesState = {
  drafted: "Drafted",
  pending_for_approval: "Pending for Approval",
  approved: "Approved",
  routed_for_signature: "Routed for Signature",
  notarized: "Notarized",
  filed_with_sec: "Filed with SEC",
  completed: "Completed",
};

const GISTimestampState = {
  gis_document_id: "",
  user_id: "",
  status: "",
  remarks: "",
  datetime: new Date(),
};

const GISAttachmentState = {
  google_sheets: "",
  final_docs: "",
};

// GISDocument model
class GISDocument {
  constructor({
    gis_document_id = "",
    entity_id = "",
    gis_document_name = "",
    document_data = GISDocumentDataState,
    attachments = GISAttachmentState,
    date_received = null,
    created_at = new Date(),
    updated_at = new Date(),
  } = {}) {
    this.gis_document_id = gis_document_id;
    this.entity_id = entity_id;
    this.gis_document_name = gis_document_name;
    this.document_data = document_data;
    this.attachments = attachments;
    this.date_received = date_received;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Fetch all records
  async fetchAll() {
    const gis_documents = await db(DB_NAME).select("*");

    const gisWithTimestamps = await Promise.all(
      gis_documents.map(async (gis_document) => {
        const timestamps = await db("gis_documents_timestamps")
          .select(
            "gis_documents_timestamps.*",
            db.raw(`
                  coalesce(users.first_name, '') || 
                  case when users.first_name is not null and users.middle_name is not null then ' ' else '' end || 
                  coalesce(users.middle_name, '') || 
                  case when (users.first_name is not null or users.middle_name is not null) and users.last_name is not null then ' ' else '' end || 
                  coalesce(users.last_name, '') as full_name
                `)
          )
          .innerJoin(
            "users",
            "users.user_id",
            "gis_documents_timestamps.user_id"
          )
          .where("gis_document_id", gis_document.gis_document_id)
          .orderBy("created_at", "desc");
        return {
          ...gis_document,
          timestamps: timestamps,
        };
      })
    );

    return gisWithTimestamps;
  }

  async fetchAllFromEntity(entity_id) {
    const gis_documents = await db(DB_NAME)
      .select("*")
      .where("entity_id", entity_id);

    const gisWithTimestamps = await Promise.all(
      gis_documents.map(async (gis_document) => {
        const timestamps = await db("gis_documents_timestamps")
          .select(
            "gis_documents_timestamps.*",
            db.raw(`
                  coalesce(users.first_name, '') || 
                  case when users.first_name is not null and users.middle_name is not null then ' ' else '' end || 
                  coalesce(users.middle_name, '') || 
                  case when (users.first_name is not null or users.middle_name is not null) and users.last_name is not null then ' ' else '' end || 
                  coalesce(users.last_name, '') as full_name
                `)
          )
          .innerJoin(
            "users",
            "users.user_id",
            "gis_documents_timestamps.user_id"
          )
          .where("gis_document_id", gis_document.gis_document_id)
          .orderBy("created_at", "desc");
        return {
          ...gis_document,
          timestamps: timestamps,
        };
      })
    );

    return gisWithTimestamps;
  }

  // Fetch a record by ID
  async fetch(columnNames) {
    // return await db(DB_NAME).where(columnNames).first();

    let gis_document = await db(DB_NAME).where(columnNames).first();
    if (!gis_document) {
      return null;
    }
    const timestamps = await db("gis_documents_timestamps")
      .select(
        "gis_documents_timestamps.*",
        db.raw(`
            coalesce(users.first_name, '') || 
            case when users.first_name is not null and users.middle_name is not null then ' ' else '' end || 
            coalesce(users.middle_name, '') || 
            case when (users.first_name is not null or users.middle_name is not null) and users.last_name is not null then ' ' else '' end || 
            coalesce(users.last_name, '') as full_name
          `)
      )
      .innerJoin("users", "users.user_id", "gis_documents_timestamps.user_id")
      .where({ gis_document_id: gis_document.gis_document_id })
      .orderBy("created_at", "desc");
    gis_document.timestamps = timestamps;
    return gis_document;
  }

  async fetchLatestGIS(entity_id) {
    const gis_document_ids = await db(DB_NAME)
      .select("*")
      .innerJoin(
        "gis_documents_timestamps",
        "gis_documents.gis_document_id",
        "gis_documents_timestamps.gis_document_id"
      )
      .where("entity_id", entity_id)
      .where("status", "Completed")
      .orderBy("datetime", "desc")
      .limit(1);

    return gis_document_ids;
  }

  // Add a new record
  async add(status = GISTimestampState) {
    // Exclude the `gis_document_id`, `created_at`,`updated_at` from the insert data
    const { gis_document_id, created_at, updated_at, ...dataToInsert } = this;

    // Insert Quote
    const gis_document = await db(DB_NAME)
      .insert(dataToInsert)
      .returning(Object.keys(this));

    if (gis_document.length != 0) {
      await db(`${DB_NAME}_timestamps`).insert({
        ...status,
        gis_document_id: gis_document[0].gis_document_id,
      });
    }

    return gis_document;
  }

  // Update a record
  async update(status = GISTimestampState) {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = GISDocument.getUpdateFields(dataToUpdate);
    if (Object.keys(fieldsToUpdate).length > 0) {
      const updated = await db(DB_NAME)
        .where({ gis_document_id: this.gis_document_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));

      if (updated != 0) {
        await db(`${DB_NAME}_timestamps`).insert({
          ...status,
          gis_document_id: updated[0].gis_document_id,
        });
      }
      return updated;
    }
    return [this];
  }

  // Delete a record by ID
  async delete(id) {
    await db(`${DB_NAME}_timestamps`).where(id).del();
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

  getGISTimestamp(status = GISTimestampState) {
    return { ...GISTimestampState, ...status };
  }
}

export default GISDocument;
