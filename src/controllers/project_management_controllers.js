import ProjectManagement from "../models/ProjectManagement.js";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await new ProjectManagement().fetchAll();

    // Parse JSON fields for all projects
    const parsedProjects = projects.map((project) =>
      new ProjectManagement().parseJsonFields(project)
    );

    return res.status(200).json(parsedProjects);
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
    const projectModel = new ProjectManagement();
    const project = await projectModel.fetch({ project_id });

    if (project) {
      const parsedProject = projectModel.parseJsonFields(project);
      return res.status(200).json({ project: parsedProject });
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
    const projectModel = new ProjectManagement();
    const existingProject = await projectModel.fetch({ project_id });

    if (existingProject) {
      const parsedExisting = projectModel.parseJsonFields(existingProject);

      const projectToUpdate = new ProjectManagement({
        ...parsedExisting,
        ...req.body,
        project_id,
      });

      const updatedProject = await projectToUpdate.update();

      if (updatedProject) {
        return res
          .status(200)
          .json({ status: "success", project: updatedProject });
      } else {
        throw Error("Failed to update the project record.");
      }
    } else {
      return res
        .status(404)
        .json({ status: "failed", error: "Project ID is not found." });
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectExists = await new ProjectManagement().fetch({ project_id });

    if (!projectExists) {
      return res
        .status(404)
        .json({ status: "failed", error: "Project not found." });
    }

    const projectToDelete = new ProjectManagement({ project_id });
    const result = await projectToDelete.delete();

    if (result) {
      return res
        .status(200)
        .json({ status: "success", message: "Project deleted successfully" });
    } else {
      throw Error("Failed to delete the project record.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

// Helper methods for array fields

export const addProjectNote = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const project = await projectModel.fetch({ project_id });

    if (!project) {
      return res
        .status(404)
        .json({ status: "failed", error: "Project not found." });
    }

    const updatedProject = await projectModel.addNote(req.body);

    if (updatedProject) {
      return res.status(201).json({
        status: "success",
        note: req.body,
        project: updatedProject,
      });
    } else {
      throw Error("Failed to add note to the project.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const addProjectPrereq = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const project = await projectModel.fetch({ project_id });

    if (!project) {
      return res
        .status(404)
        .json({ status: "failed", error: "Project not found." });
    }

    const updatedProject = await projectModel.addPrereq(req.body);

    if (updatedProject) {
      return res.status(201).json({
        status: "success",
        prereq: req.body,
        project: updatedProject,
      });
    } else {
      throw Error("Failed to add prerequisite to the project.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const addProjectTask = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const project = await projectModel.fetch({ project_id });

    if (!project) {
      return res
        .status(404)
        .json({ status: "failed", error: "Project not found." });
    }

    const updatedProject = await projectModel.addTask(req.body);

    if (updatedProject) {
      return res.status(201).json({
        status: "success",
        task: req.body,
        project: updatedProject,
      });
    } else {
      throw Error("Failed to add task to the project.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const addProjectUpdate = async (req, res) => {
  const { project_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const project = await projectModel.fetch({ project_id });

    if (!project) {
      return res
        .status(404)
        .json({ status: "failed", error: "Project not found." });
    }

    const updatedProject = await projectModel.addUpdate(req.body);

    if (updatedProject) {
      return res.status(201).json({
        status: "success",
        update: req.body,
        project: updatedProject,
      });
    } else {
      throw Error("Failed to add update to the project.");
    }
  } catch (error) {
    return res.status(500).json({ status: "failed", error: error.message });
  }
};

export const updateProjectTask = async (req, res) => {
  const { project_id, task_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const project = await projectModel.fetch({ project_id });

    if (!project) {
      return res
        .status(404)
        .json({ status: "failed", error: "Project not found." });
    }

    const updatedProject = await projectModel.updateTask(task_id, req.body);

    if (updatedProject) {
      // Find the updated task in the project
      const updatedTask = updatedProject.project_tasks.find(
        (task) => task.id === parseInt(task_id)
      );

      return res.status(200).json({
        status: "success",
        task: updatedTask,
        project: updatedProject,
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

export const updateProjectPrereq = async (req, res) => {
  const { project_id, prereq_id } = req.params;

  try {
    const projectModel = new ProjectManagement({ project_id });
    const project = await projectModel.fetch({ project_id });

    if (!project) {
      return res
        .status(404)
        .json({ status: "failed", error: "Project not found." });
    }

    const updatedProject = await projectModel.updatePrereq(prereq_id, req.body);

    if (updatedProject) {
      // Find the updated prerequisite in the project
      const updatedPrereq = updatedProject.project_prereq.find(
        (prereq) => prereq.id === parseInt(prereq_id)
      );

      return res.status(200).json({
        status: "success",
        prereq: updatedPrereq,
        project: updatedProject,
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
