#!/usr/bin/env node
/**
 * firestore.rules dosyasını Admin SDK ile yayınlar (firebase CLI gerektirmez).
 * Kullanım: npm run deploy-rules
 */
import { readFile } from "node:fs/promises";
import { getSecurityRules } from "firebase-admin/security-rules";
import { initAdminApp } from "./_firebase.mjs";

const source = await readFile(new URL("../firestore.rules", import.meta.url), "utf8");
const ruleset = await getSecurityRules(initAdminApp()).releaseFirestoreRulesetFromSource(source);
console.log(`✓ Firestore kuralları yayınlandı (ruleset: ${ruleset.name})`);
