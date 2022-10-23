export type UserAPIRes = {
  id: string
  name: string
  /** How rad this user is on a scale of pretty to hecka */
  radness_level: 'pretty' | 'totally' | 'hecka'
}
