import db from "../database/db.js";

const DB_NAME = "documents";
const DB_PRIMARY_KEY = "document_id";

const DocumentTypes = [
  "Certificate of Gross Sales/Receipts",
  // "SPA - Business Renewal",
  // "SECCERT - Waiver of Preemptive Rights",
  // "SECCERT - No Dispute",
  // "SECCERT - List of Stockholders",
  // "SECCERT - For Authorization",
  // "Affidavit of Loss",
  // "Affidavit of Non-Operation",
  // "Cover Sheet for Audited Financial Statements",
  // "SMR - Statement of Management's Responsibility for Financial Statements",
];

export const appointeeState = {
  name: "",
  id_no: "",
  date_place_issued: "",
};

const StatusesState = {
  drafted: "Drafted",
  pending_for_approval: "Pending for Approval",
  approved: "Approved",
  routed_for_signature: "Routed for Signature",
  notarized: "Notarized",
  filed_with_sec: "Filed with SEC",
  completed: "Completed",
};

const TimestampState = {
  document_id: "",
  user_id: "",
  status: "",
  remarks: "",
  datetime: new Date(),
};

const DocumentDataState = {
  type: DocumentTypes[0],
  corporate_name: "",
  corporate_tin: "",
  office_address: "",

  //CGR
  total_revenue: "",
  date_from: `${new Date().getFullYear()}-01-01`,
  date_to: `${new Date().getFullYear()}-12-31`,
  year: `${new Date().getFullYear()}`,
  revenue_q1: "",
  revenue_q2: "",
  revenue_q3: "",
  revenue_q4: "",

  //Preemptive Rights
  meeting_date: "",
  meeting_place: "",
  from: "",
  from_divided_into: "",
  from_par_value: "",
  to: "",
  to_divided_into: "",
  to_par_value: "",

  //List of Stockholders
  as_of: "",
  stockholders_data: [],

  //For Authorization
  // meeting_date: "",
  resolutions: [
    "RESOLVED, as it resolved that the Board of Directors hereby appoint {{name}}, {{position}} as the Point of Contact to transact, apply, submit, receive, sign for on behalf of the company in all Converge related transactions.",
    "RESOLVED FURTHER, to authorize, negotiate, secure, claim and receive from the above stated agency any and all documents related to the above mentioned power. ",
    "RESOLVED FINALLY, to authorize the above-named person/s to perform such other acts and to execute and sign any and all documents necessary to the accomplishment of the above mentioned authority.",
  ],

  //Signatory
  officer_name: "",
  officer_position: "",
  officer_nationality: "",

  //Corporate Secretary
  corp_sec: "",
  corp_sec_address: "",

  //Affidavit of Loss
  list_items: [
    "I am the registered Corporate Secretary of {{corporate_name}}, a company duly registered with the Security and Exchange Commissions under SEC Registration No. {{sec_registration_number}} and with TIN {{corporate_tin}}, with principal office address at {{complete_principal_office_address}};",
    "That the said loss was discovered on or about {{last_dicovered_date}} and despite diligent efforts, we are unable to locate or recover the said {{missing_items}};",
    "I am executing this affidavit to attest to the truth of the foregoing in order to secure a certified true copy of the documents required for updating the Corporation’s head office address from {{old_head_office}} to {{new_head_office}}.",
  ],

  appointees: [appointeeState],
};

const AttachmentState = {
  google_sheets: "",
  final_docs: "",
};

// Document model
class Document {
  constructor({
    document_id = "",
    entity_id = "",
    document_name = "",
    document_data = DocumentDataState,
    attachments = AttachmentState,
    created_at = new Date(),
    updated_at = new Date(),
  } = {}) {
    this.document_id = document_id;
    this.entity_id = entity_id;
    this.document_name = document_name;
    this.document_data = document_data;
    this.attachments = attachments;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Fetch all records
  async fetchAll() {
    const documents = await db(DB_NAME).select("*");

    const docWithTimestamps = await Promise.all(
      documents.map(async (document) => {
        const timestamps = await db("documents_timestamps")
          .select(
            "documents_timestamps.*",
            db.raw(`
                  coalesce(users.first_name, '') || 
                  case when users.first_name is not null and users.middle_name is not null then ' ' else '' end || 
                  coalesce(users.middle_name, '') || 
                  case when (users.first_name is not null or users.middle_name is not null) and users.last_name is not null then ' ' else '' end || 
                  coalesce(users.last_name, '') as full_name
                `)
          )
          .innerJoin("users", "users.user_id", "documents_timestamps.user_id")
          .where("document_id", document.document_id)
          .orderBy("created_at", "desc");
        return {
          ...document,
          timestamps: timestamps,
        };
      })
    );

    return documents;
  }

  async fetchAllFromEntity(entity_id) {
    const documents = await db(DB_NAME)
      .select("*")
      .where("entity_id", entity_id);

    const documentWithTimestamps = await Promise.all(
      documents.map(async (document) => {
        const timestamps = await db("documents_timestamps")
          .select(
            "documents_timestamps.*",
            db.raw(`
                  coalesce(users.first_name, '') || 
                  case when users.first_name is not null and users.middle_name is not null then ' ' else '' end || 
                  coalesce(users.middle_name, '') || 
                  case when (users.first_name is not null or users.middle_name is not null) and users.last_name is not null then ' ' else '' end || 
                  coalesce(users.last_name, '') as full_name
                `)
          )
          .innerJoin("users", "users.user_id", "documents_timestamps.user_id")
          .where("document_id", document.document_id)
          .orderBy("created_at", "desc");
        return {
          ...document,
          timestamps: timestamps,
        };
      })
    );

    return documentWithTimestamps;
  }

  // Fetch a record by ID
  async fetch(columnNames) {
    // return await db(DB_NAME).where(columnNames).first();

    let document = await db(DB_NAME).where(columnNames).first();
    if (!document) {
      return null;
    }
    const timestamps = await db("documents_timestamps")
      .select(
        "documents_timestamps.*",
        db.raw(`
            coalesce(users.first_name, '') || 
            case when users.first_name is not null and users.middle_name is not null then ' ' else '' end || 
            coalesce(users.middle_name, '') || 
            case when (users.first_name is not null or users.middle_name is not null) and users.last_name is not null then ' ' else '' end || 
            coalesce(users.last_name, '') as full_name
          `)
      )
      .innerJoin("users", "users.user_id", "documents_timestamps.user_id")
      .where({ document_id: document.document_id })
      .orderBy("created_at", "desc");
    document.timestamps = timestamps;
    return document;
  }

  // Add a new record
  async add(status = GISTimestampState) {
    // Exclude the `document_id`, `created_at`,`updated_at` from the insert data
    const { document_id, created_at, updated_at, ...dataToInsert } = this;

    // Insert Quote
    const document = await db(DB_NAME)
      .insert(dataToInsert)
      .returning(Object.keys(this));

    if (document.length != 0) {
      await db(`${DB_NAME}_timestamps`).insert({
        ...status,
        document_id: document[0].document_id,
      });
    }

    return document;
  }

  // Update a record
  async update(status = GISTimestampState) {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = Document.getUpdateFields(dataToUpdate);
    if (Object.keys(fieldsToUpdate).length > 0) {
      const updated = await db(DB_NAME)
        .where({ document_id: this.document_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));

      if (updated != 0) {
        await db(`${DB_NAME}_timestamps`).insert({
          ...status,
          document_id: updated[0].document_id,
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

  getDocumentTimestamp(status = TimestampState) {
    return { ...TimestampState, ...status };
  }
}

export default Document;
