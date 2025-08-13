import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase"
import type { UserProfile } from "../types"

export const signUp = async (email: string, password: string, name?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // Create user profile in Firestore
  const userProfile: UserProfile = {
    id: user.uid,
    email: user.email!,
    name: name || "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    theme: "system",
    language: "pt-BR",
    preferredUnits: ["times", "min", "pages", "km", "ml"],
  }

  await setDoc(doc(db, "users", user.uid), userProfile)
  return userCredential
}

export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}

export const signOut = async () => {
  return await firebaseSignOut(auth)
}

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docRef = doc(db, "users", userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile
  }
  return null
}
