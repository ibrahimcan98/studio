export const TEST_ACCOUNTS = [
  'ibrahimcanonder_98@hotmail.com',
  // TODO: Add the test teacher account email here when created
];

/**
 * Feature flag to safely enable the new Group Classes feature
 * only for admins and specific test accounts.
 */
export function isGroupClassesEnabled(email?: string | null, role?: string | null): boolean {
  // Fully launched for everyone (including logged-out visitors)
  return true;
}
