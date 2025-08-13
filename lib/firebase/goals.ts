import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"
import type { Goal } from "../types"

export const createGoal = async (userId: string, goalData: Omit<Goal, "id" | "userId" | "createdAt" | "updatedAt">) => {
  const goalsRef = collection(db, "users", userId, "goals")
  const now = Date.now()

  const goal: Omit<Goal, "id"> = {
    ...goalData,
    userId,
    createdAt: now,
    updatedAt: now,
    progressValue: goalData.progressValue || 0,
  }

  return await addDoc(goalsRef, goal)
}

export const updateGoal = async (userId: string, goalId: string, updates: Partial<Goal>) => {
  const goalRef = doc(db, "users", userId, "goals", goalId)
  return await updateDoc(goalRef, {
    ...updates,
    updatedAt: Date.now(),
  })
}

export const deleteGoal = async (userId: string, goalId: string) => {
  const goalRef = doc(db, "users", userId, "goals", goalId)
  return await deleteDoc(goalRef)
}

export const getUserGoals = async (userId: string): Promise<Goal[]> => {
  const goalsRef = collection(db, "users", userId, "goals")
  const q = query(goalsRef, orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Goal,
  )
}

export const subscribeToUserGoals = (userId: string, callback: (goals: Goal[]) => void) => {
  const goalsRef = collection(db, "users", userId, "goals")
  const q = query(goalsRef, orderBy("createdAt", "desc"))

  return onSnapshot(q, (querySnapshot) => {
    const goals = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Goal,
    )
    callback(goals)
  })
}

export const updateGoalProgress = async (userId: string, goalId: string, progressValue: number) => {
  const goalRef = doc(db, "users", userId, "goals", goalId)
  return await updateDoc(goalRef, {
    progressValue,
    updatedAt: Date.now(),
  })
}
