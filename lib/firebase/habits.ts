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
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Habit, HabitLog } from "../types";

// Helper to clean document data
const sanitizeHabitData = (data: Record<string, unknown>) => {
  const cleaned = { ...data };

  // Convert remindAt to Timestamp or remove if invalid
  if (cleaned.remindAt) {
    cleaned.remindAt = Timestamp.fromDate(
      new Date(cleaned.remindAt as string | number | Date)
    );
  } else {
    delete cleaned.remindAt;
  }

  // Remove any undefined or invalid values (e.g., empty strings)
  Object.keys(cleaned).forEach((key) => {
    if (cleaned[key] === undefined || cleaned[key] === "") {
      delete cleaned[key];
    }
  });

  return cleaned;
};

export const createHabit = async (
  userId: string,
  habitData: Omit<Habit, "id" | "userId" | "createdAt" | "updatedAt">
) => {
  const habitsRef = collection(db, "users", userId, "habits");
  const now = Date.now();

  const habit: Omit<Habit, "id"> = {
    ...habitData,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  const cleanedData = sanitizeHabitData(habit); // Ensure undefined values are removed
  return await addDoc(habitsRef, cleanedData);
};

export const updateHabit = async (
  userId: string,
  habitId: string,
  updates: Partial<Habit>
) => {
  const habitRef = doc(db, "users", userId, "habits", habitId);
  const cleanedUpdates = sanitizeHabitData(updates); // Ensure undefined values are removed
  return await updateDoc(habitRef, {
    ...cleanedUpdates,
    updatedAt: Date.now(),
  });
};

export const deleteHabit = async (userId: string, habitId: string) => {
  const habitRef = doc(db, "users", userId, "habits", habitId);
  return await deleteDoc(habitRef);
};

export const getUserHabits = async (userId: string): Promise<Habit[]> => {
  const habitsRef = collection(db, "users", userId, "habits");
  const q = query(habitsRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Habit)
  );
};

export const subscribeToUserHabits = (
  userId: string,
  callback: (habits: Habit[]) => void
) => {
  const habitsRef = collection(db, "users", userId, "habits");
  const q = query(habitsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (querySnapshot) => {
    const habits = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Habit)
    );
    callback(habits);
  });
};

// Habit Logs
export const logHabitCompletion = async (
  userId: string,
  habitId: string,
  date: string,
  completed: boolean,
  value?: number
) => {
  const logsRef = collection(db, "users", userId, "habitLogs");

  const log: Omit<HabitLog, "id"> = {
    habitId,
    date,
    completed,
    value,
    createdAt: Date.now(),
  };

  const cleanedLog = sanitizeHabitData(log); // Ensure undefined values are removed
  return await addDoc(logsRef, cleanedLog);
};

export const getHabitLogs = async (
  userId: string,
  habitId: string,
  startDate?: string,
  endDate?: string
): Promise<HabitLog[]> => {
  const logsRef = collection(db, "users", userId, "habitLogs");
  let q = query(
    logsRef,
    where("habitId", "==", habitId),
    orderBy("date", "desc")
  );

  if (startDate && endDate) {
    q = query(
      logsRef,
      where("habitId", "==", habitId),
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date", "desc")
    );
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as HabitLog)
  );
};
