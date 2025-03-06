import LegalEntities from "../models/LegalEntities.js";

export const getAllLegalEntities = async (req, res) => {
  try {
    let legalEntities = await new LegalEntities().findAll();
    res.status(200).json(legalEntities);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const getLegalEntity = async (req, res) => {
  const { entity_id } = req.params;
  try {
    let legalEntity = await LegalEntities.find(entity_id);
    res.status(200).json(legalEntity);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const createLegalEntity = async (req, res) => {
  const legalEntity = req.body;
  try {
    let entity_id = await new LegalEntities().create(legalEntity);
    res.status(200).json({ entity_id });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const updateLegalEntity = async (req, res) => {
  const { entity_id } = req.params;
  const legalEntity = req.body;
  try {
    let updated = await LegalEntities.update(entity_id, legalEntity);
    res.status(200).json({ updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};

export const deleteLegalEntity = async (req, res) => {
  const { entity_id } = req.params;
  try {
    let deleted = await LegalEntities.delete(entity_id);
    res.status(200).json({ deleted });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      err: error.message,
    });
  }
};
