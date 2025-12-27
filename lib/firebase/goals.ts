import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Goal } from "../types";

// Helper to clean document data
const sanitizeGoalData = (data: Record<string, unknown>) => {
  const cleaned = { ...data };

  // Remove undefined or empty strings
  Object.keys(cleaned).forEach((k) => {
    const v = cleaned[k];
    if (v === undefined || v === "") delete cleaned[k];
  });

  // Clean arrays
  if (Array.isArray(cleaned.milestones)) {
    cleaned.milestones = (cleaned.milestones as unknown[]).filter(
      (m) => m != null
    );
    if ((cleaned.milestones as unknown[]).length === 0)
      delete cleaned.milestones;
  }
  if (Array.isArray(cleaned.linkedHabits)) {
    cleaned.linkedHabits = (cleaned.linkedHabits as unknown[]).filter((h) => h);
    if ((cleaned.linkedHabits as unknown[]).length === 0)
      delete cleaned.linkedHabits;
  }

  return cleaned;
};

export const createGoal = async (
  userId: string,
  goalData: Omit<Goal, "id" | "userId" | "createdAt" | "updatedAt">
) => {
  const goalsRef = collection(db, "users", userId, "goals");
  const now = Date.now();

  const goal: Omit<Goal, "id"> = {
    ...goalData,
    userId,
    createdAt: now,
    updatedAt: now,
    progressValue: goalData.progressValue || 0,
  };

  const cleaned = sanitizeGoalData(goal);
  return await addDoc(goalsRef, cleaned);
};

export const updateGoal = async (
  userId: string,
  goalId: string,
  updates: Partial<Goal>
) => {
  const goalRef = doc(db, "users", userId, "goals", goalId);
  const cleanedUpdates = sanitizeGoalData(updates);
  return await updateDoc(goalRef, {
    ...cleanedUpdates,
    updatedAt: Date.now(),
  });
};

export const deleteGoal = async (userId: string, goalId: string) => {
  const goalRef = doc(db, "users", userId, "goals", goalId);
  return await deleteDoc(goalRef);
};

export const getUserGoals = async (userId: string): Promise<Goal[]> => {
  const goalsRef = collection(db, "users", userId, "goals");
  const q = query(goalsRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Goal)
  );
};

export const subscribeToUserGoals = (
  userId: string,
  callback: (goals: Goal[]) => void
) => {
  const goalsRef = collection(db, "users", userId, "goals");
  const q = query(goalsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (querySnapshot) => {
    try {
      const goals = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Goal)
      );
      callback(goals);
    } catch (error: unknown) {
      if (error instanceof Error) throw error;
      throw new Error("Erro desconhecido ao atualizar meta");
    }
  });
};

export const updateGoalProgress = async (
  userId: string,
  goalId: string,
  progressValue: number
) => {
  const goalRef = doc(db, "users", userId, "goals", goalId);
  return await updateDoc(goalRef, {
    progressValue,
    updatedAt: Date.now(),
  });
};
