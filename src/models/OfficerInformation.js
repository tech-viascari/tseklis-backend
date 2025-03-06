import db from "../database/db.js";

const DB_NAME = "officer_information";
const DB_PRIMARY_KEY = "officer_id";


// OfficerInformation model
class OfficerInformation {
    constructor({
        officer_id = "",
        entity_id = "",
        officer_name = "",
        current_residence = "",
        nationality = "",
        incorporator = "",
        board = "",
        gender = "",
        stock_holder = "",
        officer = "",
        executive_committee = "",
        tax_identification_number = "",
        created_at = new Date(),
        updated_at = new Date(),
    } = {}) {
        this.officer_id = officer_id;
        this.entity_id = entity_id;
        this.officer_name = officer_name;
        this.current_residence = current_residence;
        this.nationality = nationality;
        this.incorporator = incorporator;
        this.board = board;
        this.gender = gender;
        this.stock_holder = stock_holder;
        this.officer = officer;
        this.executive_committee = executive_committee;
        this.tax_identification_number = tax_identification_number;
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
        // Exclude the `officer_id`, `created_at`,`updated_at` from the insert data
        const { officer_id, created_at, updated_at, ...dataToInsert } = this;
        return await db(DB_NAME).insert(dataToInsert).returning(Object.keys(this));
    }

    // Update a record
    async update() {
        // Exclude the `created_at`,`updated_at` from the update data
        const { created_at, updated_at, ...dataToUpdate } = this;
        return await db(DB_NAME).where({ officer_id: this.officer_id }).update(dataToUpdate).returning(Object.keys(this));
    }

    // Delete a record
    async delete() {
        return await db(DB_NAME).where({ officer_id: this.officer_id }).del();
    }

    // Get the update fields
    static getUpdateFields(data) {
        const fieldsToUpdate = {};
        for (const key in data) {
            if (data[key] !== undefined) {
                fieldsToUpdate[key] = data[key];
            }
        }
        return fieldsToUpdate;
    }

}

export default OfficerInformation;

