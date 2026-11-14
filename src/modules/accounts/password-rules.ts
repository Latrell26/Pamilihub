/**
 * Single source of truth for password rules.
 * - The register page renders these as the live checklist.
 * - registerSchema (schemas.ts) enforces the same rules on the server.
 * Add or remove a rule here and both stay in sync.
 */
export type PasswordRule = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (value) => value.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter (A-Z)",
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "One lowercase letter (a-z)",
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: "number",
    label: "One number (0-9)",
    test: (value) => /\d/.test(value),
  },
];