import moment from "moment";
import db from "../database/db.js";
import axios from "axios";
import Document from "../models/Document.js";

export const getAllDraftedDocuments = async (req, res) => {
  try {
    let documents = await new Document().fetchAll();
    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const getAllEntityDocuments = async (req, res) => {
  const { entity_id } = req.params;
  try {
    let documents = await new Document().fetchAllFromEntity(entity_id);
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const getDocument = async (req, res) => {
  const { document_id } = req.params;

  try {
    let document = await new Document().fetch({ document_id });

    if (document) {
      res.status(200).json({ document });
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

export const addDocument = async (req, res) => {
  const entity_id = req.params.entity_id;
  const document_data = req.body.document_data;
  const attachments = req.body.attachments;
  const timestamp = req.body.timestamp;

  try {
    const timestamps = new Document().getDocumentTimestamp({
      status: timestamp.status,
      remarks: timestamp.remarks,
      user_id: req.current_user.user_id,
    });

    const date = moment(new Date()).format("MMDDYYYY");

    const document_name = `${document_data.type} ${date}`;

    const toInsert = {
      entity_id: entity_id,
      document_name: document_name,
      document_data: document_data,
      attachments: attachments,
    };

    const document = await new Document(toInsert).add(timestamps);

    return res.status(200).json({ document });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const updateGISDocument = async (req, res) => {
  const { document_id, entity_id } = req.params;
  const { document_data, attachments, timestamp } = req.body;

  try {
    const document = await new Document().fetch({ document_id });

    if (document) {
      const newTimestamp = new Document().getGISTimestamp({
        status: timestamp.status,
        remarks: timestamp.remarks,
        user_id: req.current_user.user_id,
      });

      const updated = await new Document({
        ...document,
        document_data,
      }).update(newTimestamp);

      if (updated) {
        return res.status(200).json({
          success: true,
          updated,
        });
      } else {
        throw Error("There's a problem processing the update.");
      }
    } else {
      throw Error("Document ID is not found.");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const deleteDocument = async (req, res) => {
  const { document_id } = req.params;

  try {
    const document = await new Document().fetch({ document_id });
    if (document) {
      await new Document().delete({ document_id });
      return res
        .status(200)
        .json({ success: true, message: "Record deleted successfully." });
    } else {
      throw Error("Document ID is not found.");
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const generateDocument = async (req, res) => {
  const { document_id } = req.params;

  // //Update Existing GIS
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
    "https://script.google.com/a/macros/viascari.com/s/AKfycby3ri8JhTjxUnw2huB8OYYNHbb08W9NkTCEwP7rh_isjUKEO1-LKeYpXFTlO-C7iJUP/exec";

  try {
    let response = await axios.get(url, {
      params: {
        document_id: document_id,
      },
    });

    if (response.status === 200) {
      res.send(response.data);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

export const updateDocument = async (req, res) => {
  const { document_id } = req.params;
  const { google_sheets } = req.body;

  let attachments = {
    google_sheets: google_sheets,
  };

  try {
    const update = await db("gis_documents")
      .where("document_id", document_id)
      .update({ attachments });

    if (update) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (error) {
    res.sendStatus(500);
  }
};
