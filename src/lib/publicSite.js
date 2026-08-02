import { adminDb } from "./firebaseAdmin";

export async function getSiteBySubdomain(subdomain) {
  const snapshot = await adminDb
    .collection("sites")
    .where("subdomain", "==", subdomain)
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}
