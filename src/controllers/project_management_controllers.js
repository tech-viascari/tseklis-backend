import ProjectManagement from "../models/ProjectManagement.js";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await new ProjectManagement().fetchAll();
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const addProject = async (req, res) => {
  try {
    const project = await new ProjectManagement(req.body).add();

    if (project) {
      return res.status(201).json({ status: "success", project });
    } else {
      throw Error("Failed to insert the project record.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const getProject = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const project = await projectModel.fetch({ project_id });

    if (project) {
      return res.status(200).json({ project });
    } else {
      return res
        .status(404)
        .json({ status: "failed", error: "Project not found." });
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const updateProject = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const updatedProject = await projectModel.update(req.body);

    if (updatedProject) {
      return res
        .status(200)
        .json({ status: "success", project: updatedProject });
    } else {
      throw Error("Failed to update the project record.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectToDelete = new ProjectManagement({ project_id });
    await projectToDelete.delete();

    return res
      .status(200)
      .json({ status: "success", message: "Project deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

// Notes-related controllers
export const getProjectNotes = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const notes = await projectModel.fetchNotes(project_id);

    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const addProjectNote = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const note = await projectModel.addNote(req.body);

    if (note) {
      return res.status(201).json({
        status: "success",
        note,
      });
    } else {
      throw Error("Failed to add note to the project.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

// Updates/Logs-related controllers
export const getProjectUpdates = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const updates = await projectModel.fetchLogs(project_id);

    return res.status(200).json({ updates });
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const addProjectUpdate = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const update = await projectModel.addUpdate(req.body);

    if (update) {
      return res.status(201).json({
        status: "success",
        update,
      });
    } else {
      throw Error("Failed to add update to the project.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

// Prerequisites-related controllers
export const getProjectPrereqs = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const prerequisites = await projectModel.fetchPrerequisites(project_id);

    return res.status(200).json({ prerequisites });
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const addProjectPrereq = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const prereq = await projectModel.addPrereq(req.body);

    if (prereq) {
      return res.status(201).json({
        status: "success",
        prereq,
      });
    } else {
      throw Error("Failed to add prerequisite to the project.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const updateProjectPrereq = async (req, res) => {
  const { project_id, prereq_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const updatedPrereq = await projectModel.updatePrereq(prereq_id, req.body);

    if (updatedPrereq) {
      return res.status(200).json({
        status: "success",
        prereq: updatedPrereq,
      });
    } else {
      return res
        .status(404)
        .json({ status: "failed", error: "Prerequisite not found." });
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

// Tasks-related controllers
export const getProjectTasks = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const tasks = await projectModel.fetchTasks(project_id);

    return res.status(200).json({ tasks });
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const addProjectTask = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const task = await projectModel.addTask(req.body);

    if (task) {
      return res.status(201).json({
        status: "success",
        task,
      });
    } else {
      throw Error("Failed to add task to the project.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const updateProjectTask = async (req, res) => {
  const { project_id, task_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const updatedTask = await projectModel.updateTask(task_id, req.body);

    if (updatedTask) {
      return res.status(200).json({
        status: "success",
        task: updatedTask,
      });
    } else {
      return res
        .status(404)
        .json({ status: "failed", error: "Task not found." });
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};
