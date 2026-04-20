export type AppRole = "ADMIN" | "EDITOR" | "TRAINER" | "MEMBER" | "GUEST";

export type Permission =
  | "read_public_article"
  | "read_internal_article"
  | "create_article"
  | "review_article"
  | "delete_any_article"
  | "manage_users"
  | "view_dashboard"
  | "comment"
  | "like_bookmark"
  | "athlete_profile"
  | "manage_tags";

const matrix: Record<AppRole, Permission[]> = {
  ADMIN: [
    "read_public_article",
    "read_internal_article",
    "create_article",
    "review_article",
    "delete_any_article",
    "manage_users",
    "view_dashboard",
    "comment",
    "like_bookmark",
    "athlete_profile",
    "manage_tags",
  ],
  EDITOR: [
    "read_public_article",
    "read_internal_article",
    "create_article",
    "review_article",
    "view_dashboard",
    "comment",
    "like_bookmark",
    "athlete_profile",
  ],
  TRAINER: [
    "read_public_article",
    "read_internal_article",
    "create_article",
    "comment",
    "like_bookmark",
    "athlete_profile",
  ],
  MEMBER: [
    "read_public_article",
    "read_internal_article",
    "comment",
    "like_bookmark",
    "athlete_profile",
  ],
  GUEST: ["read_public_article"],
};

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return matrix[role].includes(permission);
}