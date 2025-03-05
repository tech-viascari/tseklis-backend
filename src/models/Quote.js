import db from "../database/db.js";

const DB_NAME = "quotes";
const DB_PRIMARY_KEY = "quote_id";

const ScopeOfWorkState = {
  task: "",
  sub_task: "",
  service_fee: "",
  oop_expenses: "",
};

const QuoteFormDataState = {
  recipient_company: "",
  recipient_address: "",
  recipient_email: "",
  recipient_name: "",
  subject: "",
  scope: "",
  billing_account: "Viascari, Inc.",
  scope_of_work: [],
  due_date: "",
  currency: "PHP",
  include_vat: "Yes",
};

const QuoteAttachmentsState = {
  signed_document_url: "",
  invoice_url: "",
  proof_of_payment_url: "",
};

const QuoteStatusState = {
  quote_id: "",
  user_id: "",
  status: "",
  remarks: "",
  datetime: new Date(),
};

// Quote model
class Quote {
  constructor({
    quote_id = "",
    quote_number = "",
    quote_name = "",
    form_data = QuoteFormDataState,
    folder_id = "",
    google_doc_id = "",
    attachments = QuoteAttachmentsState,
    created_at = new Date(),
    updated_at = new Date(),
  } = {}) {
    this.quote_id = quote_id;
    this.quote_number = quote_number;
    this.quote_name = quote_name;
    this.form_data = form_data;
    this.folder_id = folder_id;
    this.google_doc_id = google_doc_id;
    this.attachments = attachments;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Fetch all records
  async fetchAll() {
    const quotes = await db(DB_NAME).select("*");

    const quotesWithTimestamps = await Promise.all(
      quotes.map(async (quote) => {
        const timestamps = await db("quotes_timestamps")
          .select(
            "quotes_timestamps.*",
            db.raw(`
              coalesce(users.first_name, '') || 
              case when users.first_name is not null and users.middle_name is not null then ' ' else '' end || 
              coalesce(users.middle_name, '') || 
              case when (users.first_name is not null or users.middle_name is not null) and users.last_name is not null then ' ' else '' end || 
              coalesce(users.last_name, '') as full_name
            `)
          )
          .innerJoin("users", "users.user_id", "quotes_timestamps.user_id")
          .where("quote_id", quote.quote_id)
          .orderBy("created_at", "desc");
        return {
          ...quote,
          timestamps: timestamps,
        };
      })
    );

    return quotesWithTimestamps;
  }

  // Fetch a record by ID
  async fetch(columnNames) {
    let quote = await db(DB_NAME).where(columnNames).first();
    if (!quote) {
      return null;
    }
    const timestamps = await db("quotes_timestamps")
      .select(
        "quotes_timestamps.*",
        db.raw(`
        coalesce(users.first_name, '') || 
        case when users.first_name is not null and users.middle_name is not null then ' ' else '' end || 
        coalesce(users.middle_name, '') || 
        case when (users.first_name is not null or users.middle_name is not null) and users.last_name is not null then ' ' else '' end || 
        coalesce(users.last_name, '') as full_name
      `)
      )
      .innerJoin("users", "users.user_id", "quotes_timestamps.user_id")
      .where({ quote_id: quote.quote_id })
      .orderBy("created_at", "desc");
    quote.timestamps = timestamps;
    return quote;
  }

  // Add a new record
  async add(status = QuoteStatusState) {
    // Exclude the `quote_id`, `created_at`,`updated_at` from the insert data
    const { quote_id, created_at, updated_at, ...dataToInsert } = this;

    // Insert Quote
    const quote = await db(DB_NAME)
      .insert(dataToInsert)
      .returning(Object.keys(this));

    if (quote.length != 0) {
      await db(`${DB_NAME}_timestamps`).insert({
        ...status,
        quote_id: quote[0].quote_id,
      });
    }

    return quote;
  }

  // Update a record
  async update(status = QuoteStatusState) {
    // Exclude the `created_at`,`updated_at` from the update data
    const { created_at, updated_at, ...dataToUpdate } = this;
    const fieldsToUpdate = Quote.getUpdateFields(dataToUpdate);
    if (Object.keys(fieldsToUpdate).length > 0) {
      const updated = await db(DB_NAME)
        .where({ quote_id: this.quote_id })
        .update(fieldsToUpdate)
        .returning(Object.keys(this));

      if (updated != 0) {
        await db(`${DB_NAME}_timestamps`).insert({
          ...status,
          quote_id: updated[0].quote_id,
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

  getScopeOfWorkState() {
    return ScopeOfWorkState;
  }

  getQuoteFormDataState() {
    return QuoteFormDataState;
  }

  getQuoteAttachmentsState() {
    return QuoteAttachmentsState;
  }

  getQuoteStatus(status = QuoteStatusState) {
    return { ...QuoteStatusState, ...status };
  }
}

export default Quote;
