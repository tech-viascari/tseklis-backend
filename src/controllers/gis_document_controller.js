import moment from "moment";
import db from "../database/db.js";
import GISDocument from "../models/GISDocument.js";
import Quote from "../models/Quote.js";
import axios from "axios";

export const getAllGISDocuments = async (req, res) => {
  try {
    let quotes = await new GISDocument().fetchAll();
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const getAllEntityGISDocuments = async (req, res) => {
  const { entity_id } = req.params;
  try {
    let quotes = await new GISDocument().fetchAllFromEntity(entity_id);
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const getGISDocument = async (req, res) => {
  const { entity_id } = req.params;

  try {
    let gis_document = await new GISDocument().fetch({ entity_id });

    if (gis_document) {
      res.status(200).json({ gis_document });
    } else {
      throw Error("GIS Document ID is not found.");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const addGISDocument = async (req, res) => {
  const entity_id = req.params.entity_id;
  const document_data = req.body.document_data;
  const attachments = req.body.attachments;
  const timestamp = req.body.timestamp;

  try {
    const timestamps = new GISDocument().getGISTimestamp({
      status: timestamp.status,
      remarks: timestamp.remarks,
      user_id: req.current_user.user_id,
    });

    const type = document_data.is_special_meeting ? "AMENDMENT" : "ANNUAL";

    const dateOfMeeting = document_data.date_of_annual_meeting
      ? moment(document_data.date_of_annual_meeting).format("MMDDYYYY")
      : moment(new Date()).format("MMDDYYYY");

    const gisName = `${document_data.corporate_name} GIS ${document_data.year} ${type} ${dateOfMeeting}`;

    const toInsert = {
      entity_id: entity_id,
      gis_document_name: gisName,
      document_data: document_data,
      attachments: attachments,
      date_received: null,
    };

    const gis_document = await new GISDocument(toInsert).add(timestamps);

    return res.status(200).json({ gis_document });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const updateGISDocument = async (req, res) => {
  const { entity_id } = req.params;
  try {
    // const quote = await new Quote().fetch({ quote_id });

    // if (quote) {
    //   const timestamp = new Quote().getQuoteStatus({
    //     ...req.body.timestamp,
    //     user_id: req.current_user.user_id,
    //   });
    //   const updated = await new Quote({ ...quote, ...req.body.quote }).update(
    //     timestamp
    //   );
    return res
      .status(200)
      .json({ success: true, message: "For testing, not yet completed" });
    // } else {
    //   throw Error("Quote ID is not found.");
    // }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const deleteGISDocument = async (req, res) => {
  const { gis_document_id } = req.params;

  try {
    const gis_document = await new GISDocument().fetch({ gis_document_id });
    if (gis_document) {
      await new GISDocument().delete({ gis_document_id });
      return res
        .status(200)
        .json({ success: true, message: "Record deleted successfully." });
    } else {
      throw Error("GIS Document ID is not found.");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const generateGISDocument = async (req, res) => {
  const gis_document_id = req.params.gis_document_id;

  //Update Existing GIS
  // if (record.attachments.google_sheets != "") {
  //   let toUpdate = {
  //     draftingInput: JSON.stringify(record.draftingInput),
  //   };
  //   try {
  //     await db("records").where("recordId", recordId).update(toUpdate);
  //   } catch (error) {
  //     return res.status(500).json("Failed to update the record.");
  //   }
  // }

  let url =
    "https://script.google.com/a/macros/fullsuite.ph/s/AKfycbwqWncGPkcHl8kFalRxK2syj8zH-MSKB5RrFCiIdwW1R67qqtbmU9l5MGfAV5sc8Y27ZQ/exec";

  try {
    let response = await axios.get(url, {
      params: {
        gis_document_id: gis_document_id,
      },
    });

    if (response.status === 200) {
      res.send(response.data);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

export const getLatestGIS = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const data = await db("records")
      .select("*")
      .where("companyId", companyId)
      .where("status", "Completed")
      .orderBy([
        { column: "recordName", order: "desc" }, // Order by the first column in ascending order
        { column: "date_filed", order: "desc" }, // Order by the second column in descending order
      ])
      .limit(1);
    // .orderBy("date_filed", "desc")
    // .limit(1);

    if (data.length == 1) {
      res.status(200).json(data[0].draftingInput);
    } else {
      res.status(200).json(data);
    }
  } catch (e) {
    //returns 500 status code
    res.status(500).json({ error: "Internal Server Error", err: e });
  }
};
