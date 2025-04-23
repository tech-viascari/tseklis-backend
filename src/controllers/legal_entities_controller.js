import LegalEntities from "../models/LegalEntities.js";
import GISDocument from "../models/GISDocument.js";

export const getAllLegalEntities = async (req, res) => {
  try {
    let legalEntities = await new LegalEntities().fetchAll();
    const legalEntitiesWithLatestGIS = await Promise.all(
      legalEntities.map(async (legal_entity) => {
        const latestGIS = await new GISDocument().fetchLatestGIS(
          legal_entity.entity_id
        );
        legal_entity.latest_GIS = latestGIS;
        return legal_entity;
      })
    );
    return res.status(200).json(legalEntitiesWithLatestGIS);
  } catch (error) {
    return res.status(500).json({
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
      const latestGIS = await new GISDocument().fetchLatestGIS(
        entity.entity_id
      );
      entity.latest_GIS = latestGIS;
      return res.status(200).json({ entity });
    } else {
      throw Error("Record not found.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const updateLegalEntity = async (req, res) => {
  const { entity_id } = req.params;

  try {
    if (req.entity_logo) {
      let entity = await new LegalEntities().fetch({ entity_id });
      const { entity_details } = req.body;

      entity.entity_details = entity_details;
      entity.entity_logo = req.entity_logo;

      if (entity) {
        const updated = await new LegalEntities({ ...entity }).update();
        return res.status(200).json({ updated });
      } else {
        throw Error("Record not found.");
      }
    } else {
      const entity = await new LegalEntities().fetch({ entity_id });

      const { entity_logo, ...filteredEntity } = req.body;

      if (entity) {
        const updated = await new LegalEntities({
          ...entity,
          ...filteredEntity,
        }).update();
        return res.status(200).json({ updated });
      } else {
        throw Error("Record not found.");
      }
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const deleteLegalEntity = async (req, res) => {
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
