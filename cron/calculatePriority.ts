import User from "../models/user";
import Task from "../models/task";

const CalucaltePriority = async () => {
  try {
    // Get all users
    const users = await User.find();

    // Iterate through users to calculate priority and make calls
    for (const user of users) {
      // Calculate user priority based on their tasks
      const userTasks = await Task.find({ userId: user._id });

      for (const task of userTasks) {
        const today = new Date();
        // const tomorrow = new Date();
        // tomorrow.setDate(today.getDate() + 1);

        const dueDate = new Date(task.due_date);
        const timeDiff = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (diffDays < 0) {
          task.priority = -1;
        } else if (diffDays === 0) {
          task.priority = 0;
        } else if (diffDays <= 2) {
          task.priority = 1;
        } else if (diffDays <= 4) {
          task.priority = 2;
        } else {
          task.priority = 3;
        }
        task.save();
      }
    }

    console.log(
      "changing priority of task based on due_date of task successfully"
    );
  } catch (error) {
    console.error("Error changing priority:", error);
  }
};

export { CalucaltePriority };
