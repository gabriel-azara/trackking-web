import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Task } from "../types";

export const createTask = async (
  userId: string,
  taskData: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">
) => {
  const tasksRef = collection(db, "users", userId, "tasks");
  const now = Date.now();

  const task: Omit<Task, "id"> = {
    ...taskData,
    userId,
    status: taskData.status || "todo",
    createdAt: now,
    updatedAt: now,
  };

  return await addDoc(tasksRef, task);
};

export const updateTask = async (
  userId: string,
  taskId: string,
  updates: Partial<Task>
) => {
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  return await updateDoc(taskRef, {
    ...updates,
    updatedAt: Date.now(),
  });
};

export const toggleTaskStatus = async () => {
  // const taskRef = doc(db, "users", userId, "tasks", taskId)
  // This would need to get current status first, then toggle
  // Implementation depends on current status logic
};

export const deleteTask = async (userId: string, taskId: string) => {
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  return await deleteDoc(taskRef);
};

export const getUserTasks = async (
  userId: string,
  status?: Task["status"]
): Promise<Task[]> => {
  const tasksRef = collection(db, "users", userId, "tasks");
  let q = query(tasksRef, orderBy("createdAt", "desc"));

  if (status) {
    q = query(
      tasksRef,
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
  }

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Task)
  );
};

export const subscribeToUserTasks = (
  userId: string,
  callback: (tasks: Task[]) => void
) => {
  const tasksRef = collection(db, "users", userId, "tasks");
  const q = query(tasksRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (querySnapshot) => {
    const tasks = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Task)
    );
    callback(tasks);
  });
};
