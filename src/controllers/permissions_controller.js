import db from "../database/db.js";

export const getAllPermissions = async (req, res) => {
  const permissions = await db("permissions").select("*");
  return res.status(200).json(permissions);
};

export const addPermission = async (req, res) => {
  const { permission_name } = req.body;

  try {
    const permission = await db("permissions")
      .insert({ permission_name })
      .returning(["permission_id", "permission_name"]);

    if (permission) {
      return res.status(200).json({ permission });
    } else {
      throw Error("Failed to insert the record.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const getPermission = async (req, res) => {
  const { permission_id } = req.params;
  try {
    const permission = await db("permissions")
      .select("*")
      .where({ permission_id });

    if (permission) {
      return res.status(200).json({ permission });
    } else {
      throw Error("Record not found.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const updatePermission = async (req, res) => {
  const { permission_id } = req.params;
  const { permission_name } = req.body;
  try {
    const permission = await db("permissions")
      .where({ permission_id })
      .update({ permission_name });
    if (permission) {
      return res.status(200).json({ status: "success", permission });
    } else {
      throw Error("Failed to update the record.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const deletePermission = async (req, res) => {
  const { permission_id } = req.params;

  try {
    const permission = await db("permissions")
      .where({ permission_id })
      .delete();

    if (permission) {
      return res.status(200).json({ permission });
    } else {
      throw Error("Failed to delete the record.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};
