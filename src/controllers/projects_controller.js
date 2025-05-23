import moment from "moment";
import db from "../database/db.js";
import GISDocument from "../models/GISDocument.js";
import axios from "axios";

export const getAllGISDocuments = async (req, res) => {
  // try {
  //   let quotes = await new GISDocument().fetchAll();
  //   res.status(200).json(quotes);
  // } catch (error) {
  //   res.status(500).json({
  //     success: false,
  //     error: "Internal Server Error",
  //     err: error.message,
  //   });
  // }
};

export const getAllEntityGISDocuments = async (req, res) => {
  // const { entity_id } = req.params;
  // try {
  //   let quotes = await new GISDocument().fetchAllFromEntity(entity_id);
  //   res.status(200).json(quotes);
  // } catch (error) {
  //   res.status(500).json({
  //     success: false,
  //     error: "Internal Server Error",
  //     err: error.message,
  //   });
  // }
};

export const getGISDocument = async (req, res) => {
  // const { gis_document_id } = req.params;
  // try {
  //   let gis_document = await new GISDocument().fetch({ gis_document_id });
  //   if (gis_document) {
  //     res.status(200).json({ gis_document });
  //   } else {
  //     throw Error("GIS Document ID is not found.");
  //   }
  // } catch (error) {
  //   res.status(500).json({
  //     success: false,
  //     message: "Internal Server Error",
  //     error: error.message,
  //   });
  // }
};

export const addGISDocument = async (req, res) => {
  // const entity_id = req.params.entity_id;
  // const document_data = req.body.document_data;
  // const attachments = req.body.attachments;
  // const timestamp = req.body.timestamp;
  // try {
  //   const timestamps = new GISDocument().getGISTimestamp({
  //     status: timestamp.status,
  //     remarks: timestamp.remarks,
  //     user_id: req.current_user.user_id,
  //     datetime: moment().format(),
  //   });
  //   const type = document_data.is_special_meeting ? "AMENDMENT" : "ANNUAL";
  //   const dateOfMeeting = document_data.actual_date_of_annual_meeting
  //     ? moment(document_data.actual_date_of_annual_meeting).format("MMDDYYYY")
  //     : moment(new Date()).format("MMDDYYYY");
  //   const year =
  //     document_data.year != "" ? document_data.year : new Date().getFullYear();
  //   const gisName = `${document_data.corporate_name} GIS ${year} ${type} ${dateOfMeeting}`;
  //   const toInsert = {
  //     entity_id: entity_id,
  //     gis_document_name: gisName,
  //     document_data: document_data,
  //     attachments: attachments,
  //     date_received: null,
  //   };
  //   const gis_document = await new GISDocument(toInsert).add(timestamps);
  //   return res.status(200).json({ gis_document });
  // } catch (error) {
  //   res.status(500).json({
  //     success: false,
  //     error: "Internal Server Error",
  //     err: error.message,
  //   });
  // }
};

export const updateGISDocument = async (req, res) => {
  // const { gis_document_id, entity_id } = req.params;
  // let { document_data, attachments, timestamp, date_received = "" } = req.body;
  // try {
  //   const gis_document = await new GISDocument().fetch({ gis_document_id });
  //   if (gis_document) {
  //     const newTimestamp = new GISDocument().getGISTimestamp({
  //       status: timestamp.status,
  //       remarks: timestamp.remarks,
  //       user_id: req.current_user.user_id,
  //       datetime: moment().format(),
  //     });
  //     if (date_received == "") {
  //       date_received = null;
  //     }
  //     const updated = await new GISDocument({
  //       ...gis_document,
  //       document_data,
  //       date_received,
  //     }).update(newTimestamp);
  //     if (updated) {
  //       return res.status(200).json({
  //         success: true,
  //         updated,
  //       });
  //     } else {
  //       throw Error("There's a problem processing the update.");
  //     }
  //   } else {
  //     throw Error("Document ID is not found.");
  //   }
  // } catch (error) {
  //   return res.status(500).json({
  //     success: false,
  //     error: "Internal Server Error",
  //     err: error.message,
  //   });
  // }
};

export const deleteGISDocument = async (req, res) => {
  // const { gis_document_id } = req.params;
  // try {
  //   const gis_document = await new GISDocument().fetch({ gis_document_id });
  //   if (gis_document) {
  //     await new GISDocument().delete({ gis_document_id });
  //     return res
  //       .status(200)
  //       .json({ success: true, message: "Record deleted successfully." });
  //   } else {
  //     throw Error("GIS Document ID is not found.");
  //   }
  // } catch (error) {
  //   return res.status(500).json({
  //     success: false,
  //     error: "Internal Server Error",
  //     err: error.message,
  //   });
  // }
};

export const getAllActiveUsers = async (req, res) => {
  try {
    const activeUsers = await db("users").select("*").where("status", "Active");

    if (activeUsers.length != 0) {
      const filteredUsers = activeUsers
        .filter(
          (user) => user.user_id !== "86445391-6f76-4453-a6ca-c3b806b45d3f"
        )
        .map((user) => {
          return {
            user_id: user.user_id,
            name: `${user.first_name} ${user.last_name}`,
            picture: user.picture,
          };
        });
      return res.status(200).json(filteredUsers);
    } else {
      return res.status(200).json([]);
    }
  } catch (e) {
    //returns 500 status code
    res.status(500).json({ error: "Internal Server Error", err: e });
  }
};
