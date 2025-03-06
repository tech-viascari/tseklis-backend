import LegalEntities from "../models/LegalEntities.js";

export const getAllLegalEntities = async (req, res) => {
  try {
    let legalEntities = await new LegalEntities().fetchAll();
    res.status(200).json(legalEntities);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const addLegalEntity = async (req, res) => {
  const { entity_details } = req.body;

  try {
    let legalEntity = new LegalEntities();
    legalEntity.entity_details = entity_details;
    legalEntity.entity_logo = req.entity_logo;

    const newLegalEntity = await legalEntity.add();

    if (newLegalEntity) {
      return res.status(200).json({ newLegalEntity });
    } else {
      throw Error("Failed to insert the record.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const getLegalEntity = async (req, res) => {
  const { entity_id } = req.params;
  try {
    const entity = await new LegalEntities().fetch({ entity_id });
    if (entity) {
      return res.status(200).json({ entity });
    } else {
      throw Error("Record not found.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const updatePermission = async (req, res) => {
  // const { entity_id } = req.params;

  // console.log(entity_id);
  try {
    // const entity = await new LegalEntities().fetch({ entity_id });
    // if (entity) {
    //   const newPermission = await new LegalEntities({ ...req.body }).update();
    //   if (newPermission) {
    //     return res.status(200).json({ status: "success", newPermission });
    //   } else {
    //     throw Error("Failed to update the record.");
    //   }
    // } else {
    //   throw Error("LegalEntities ID is not found.");
    // }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const deletePermission = async (req, res) => {
  const { entity_id } = req.params;

  try {
    const entity = await new LegalEntities().delete({ entity_id });
    if (entity) {
      return res.status(200).json({ entity });
    } else {
      throw Error("Failed to delete the record.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};
