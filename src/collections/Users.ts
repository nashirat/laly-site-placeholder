import type { CollectionConfig } from 'payload'

// `auth: true` supplies email + password. Default access on an auth collection restricts reads to
// authenticated users, which is what we want — don't loosen it.
export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [],
}
