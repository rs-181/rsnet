import { adminDb } from "./firebaseAdmin";

export async function getSiteBySitename(sitename) {
  const snapshot = await adminDb
    .collection("sites")
    .where("sitename", "==", sitename)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}
