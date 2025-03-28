import Permission from "../models/Permission.js";

export const getPaginate = async (req, res) => {
  const { limit = 10, page = 1, search = "" } = req.query;

  try {
    const pagination = await new Permission().fetchPermissionPaginate(
      limit,
      page,
      search
    );
    return res.status(200).json(pagination);
  } catch (e) {
    console.error("Error fetching companies:", e);
    return res.status(500).json({ error: "Failed to fetch companies" });
  }
};

export const getAllPermissions = async (req, res) => {
  const permissions = await new Permission().fetchAll();
  return res.status(200).json(permissions);
};

export const addPermission = async (req, res) => {
  const { permission_name } = req.body;

  try {
    const permission = await new Permission({ permission_name }).add();

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
    const permission = await new Permission().fetch({ permission_id });

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

  console.log(permission_id);
  try {
    const permission = await new Permission().fetch({ permission_id });
    if (permission) {
      const newPermission = await new Permission({ ...req.body }).update();
      if (newPermission) {
        return res.status(200).json({ status: "success", newPermission });
      } else {
        throw Error("Failed to update the record.");
      }
    } else {
      throw Error("Permission ID is not found.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const deletePermission = async (req, res) => {
  const { permission_id } = req.params;

  try {
    const permission = await new Permission().delete({ permission_id });
    if (permission) {
      return res.status(200).json({ permission });
    } else {
      throw Error("Failed to delete the record.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};
