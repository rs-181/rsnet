import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// FIREBASE_SERVICE_ACCOUNT_KEY holds the full service-account JSON as a
// string. Server-only — never prefix with NEXT_PUBLIC_ and never import
// this file from a "use client" component.
function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is not set — required for public site rendering, session cookies, and site creation."
    );
  }
  return JSON.parse(raw);
}

const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(getServiceAccount()) });

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
