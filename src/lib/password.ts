/**
 * password.ts
 * --------------------------------------------------------------
 * bcrypt helpers. We NEVER store plain text passwords.
 * `hashPassword` is called before saving a user.
 * `comparePassword` is called during login.
 * --------------------------------------------------------------
 */
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}
