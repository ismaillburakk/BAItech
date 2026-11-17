#!/usr/bin/env node
/** Firestore içeriğini JSON olarak döker (salt okuma). node --env-file=.env scripts/tools/dump-content.mjs > dosya.json */
import process from "node:process";
import { getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "../_firebase.mjs";
const db = getFirestore(initAdminApp());
const out = {};
for (const c of await db.listCollections()) {
  if (c.id === "submissions") continue;
  out[c.id] = {};
  for (const d of (await c.get()).docs) out[c.id][d.id] = d.data();
}
process.stdout.write(JSON.stringify(out, (k, v) => (v && typeof v === "object" && "_seconds" in v ? new Date(v._seconds * 1000).toISOString() : v), 2));
process.exit(0);
