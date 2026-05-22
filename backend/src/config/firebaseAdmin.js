const admin = require("firebase-admin");
const { config } = require("./env");

const normalizePrivateKey = (value) => {
  if (!value) return "";
  // Render/Supabase envs often store newlines escaped.
  return String(value).replace(/\\n/g, "\n");
};

let app = null;

const getFirebaseAdmin = () => {
  if (app) return admin;

  if (!config.firebaseProjectId || !config.firebaseClientEmail || !config.firebasePrivateKey) {
    throw new Error(
      "Firebase Admin not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.",
    );
  }

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebaseProjectId,
      clientEmail: config.firebaseClientEmail,
      privateKey: normalizePrivateKey(config.firebasePrivateKey),
    }),
  });

  return admin;
};

module.exports = { getFirebaseAdmin };

