import Entity from "../models/Entity.js";
import OfficerInformation from "../models/OfficerInformation.js";

export const getAllEntities = async (req, res) => {
    const entities = await new Entity().fetchAll();
    return res.status(200).json(entities);
    }

// export const addEntity = async (req, res) => {
//     const {
//         business_type,
//         client_type,
//         company_name,
//         company_address,
//         type_of_company,
//         corporate_tin,
//         sec_registration_number,
//         official_email,
//         alternative_email,
//         official_contact_number,
//         alternative_contact_number,
//         company_logo
//     } = req.body.basic_information;

//     try {
//         const entity = await new Entity({
//             business_type,
//             client_type,
//             company_name,
//             company_address,
//             type_of_company,
//             corporate_tin,
//             sec_registration_number,
//             official_email,
//             alternative_email,
//             official_contact_number,
//             alternative_contact_number,
//             company_logo
//         }).add();

//         if (entity) {
//             const officer_information = req.body.officer_information.map((officer) => {
//                 return new OfficerInformation({
//                     entity_id: entity[0].entity_id,
//                     ...officer
//                 }).add();
//             });

//             if (officer_information) {

//                 return res.status(200).json({ entity, officer_information });
//             } else {
//                 throw Error("Failed to insert the record.");
//             }
//         } else {
//             throw Error("Failed to insert the record.");
//         }
//     } catch (error) {
//         return res.status(500).json({ status: "failed", error: error.message });
//     }
// };

export const addEntity = async (req, res) => {
    const { basic_information, officer_information } = req.body;

    if (!basic_information) {
        return res.status(400).json({ status: "failed", error: "Basic information is required." });
    }

    const {
        business_type,
        client_type,
        company_name,
        company_address,
        type_of_company,
        corporate_tin,
        sec_registration_number,
        official_email,
        alternative_email,
        official_contact_number,
        alternative_contact_number,
        company_logo
    } = basic_information;

    try {
        const entity = await new Entity({
            business_type,
            client_type,
            company_name,
            company_address,
            type_of_company,
            corporate_tin,
            sec_registration_number,
            official_email,
            alternative_email,
            official_contact_number,
            alternative_contact_number,
            company_logo,
            officer_information
        }).add();

        return res.status(200).json({ entity });
    } catch (error) {
        return res.status(500).json({ status: "failed", error: error.message });
    }
};

export const getEntity = async (req, res) => {
    const { entity_id } = req.params;

    try {
        const entity = await new Entity().fetchById(entity_id);
        if (!entity) {
            return res.status(404).json({ status: "failed", error: "Entity not found." });
        }
        return res.status(200).json(entity);
    } catch (error) {
        return res.status(500).json({ status: "failed", error: error.message });
    }
};

// export const getEntity = async (req, res) => {
//     const { entity_id } = req.params;
//     try {
//         const entity = await new Entity().fetch({ entity_id });

//         if (entity) {
//             return res.status(200).json({ entity });
//         } else {
//             throw Error("Record not found.");
//         }
//     } catch (error) {
//         return res.status(500).json({ status: "failed", error: error.message });
//     }
// };

export const updateEntity = async (req, res) => {
    const { entity_id } = req.params;

    try {
        const entity = await new Entity().fetch({ entity_id });
        if (entity) {
            const newEntity = await new Entity({ ...req.body }).update();
            if (newEntity) {
                return res.status(200).json({ status: "success", newEntity });
            } else {
                throw Error("Failed to update the record.");
            }
        } else {
            throw Error("Entity ID is not found.");
        }
    } catch (error) {
        return res.status(500).json({ status: "failed", error: error.message });
    }
};

export const deleteEntity = async (req, res) => {
    const { entity_id } = req.params;

    try {
        const entity = await new Entity().delete({ entity_id });
        if (entity) {
            return res.status(200).json({ entity });
        } else {
            throw Error("Failed to delete the record.");
        }
    } catch (error) {
        return res.status(500).json({ status: "failed", error: error.message });
    }
};

