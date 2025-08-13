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
} from "firebase/firestore"
import { db } from "../firebase"
import type { Habit, HabitLog } from "../types"

export const createHabit = async (
  userId: string,
  habitData: Omit<Habit, "id" | "userId" | "createdAt" | "updatedAt">,
) => {
  const habitsRef = collection(db, "users", userId, "habits")
  const now = Date.now()

  const habit: Omit<Habit, "id"> = {
    ...habitData,
    userId,
    createdAt: now,
    updatedAt: now,
  }

  return await addDoc(habitsRef, habit)
}

export const updateHabit = async (userId: string, habitId: string, updates: Partial<Habit>) => {
  const habitRef = doc(db, "users", userId, "habits", habitId)
  return await updateDoc(habitRef, {
    ...updates,
    updatedAt: Date.now(),
  })
}

export const deleteHabit = async (userId: string, habitId: string) => {
  const habitRef = doc(db, "users", userId, "habits", habitId)
  return await deleteDoc(habitRef)
}

export const getUserHabits = async (userId: string): Promise<Habit[]> => {
  const habitsRef = collection(db, "users", userId, "habits")
  const q = query(habitsRef, orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Habit,
  )
}

export const subscribeToUserHabits = (userId: string, callback: (habits: Habit[]) => void) => {
  const habitsRef = collection(db, "users", userId, "habits")
  const q = query(habitsRef, orderBy("createdAt", "desc"))

  return onSnapshot(q, (querySnapshot) => {
    const habits = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Habit,
    )
    callback(habits)
  })
}

// Habit Logs
export const logHabitCompletion = async (
  userId: string,
  habitId: string,
  date: string,
  completed: boolean,
  value?: number,
) => {
  const logsRef = collection(db, "users", userId, "habitLogs")

  const log: Omit<HabitLog, "id"> = {
    habitId,
    date,
    completed,
    value,
    createdAt: Date.now(),
  }

  return await addDoc(logsRef, log)
}

export const getHabitLogs = async (
  userId: string,
  habitId: string,
  startDate?: string,
  endDate?: string,
): Promise<HabitLog[]> => {
  const logsRef = collection(db, "users", userId, "habitLogs")
  let q = query(logsRef, where("habitId", "==", habitId), orderBy("date", "desc"))

  if (startDate && endDate) {
    q = query(
      logsRef,
      where("habitId", "==", habitId),
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date", "desc"),
    )
  }

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as HabitLog,
  )
}
