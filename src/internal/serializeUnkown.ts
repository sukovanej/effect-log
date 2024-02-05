/** @internal */
export const serializeUnknown = (u: unknown): string => {
  try {
    return typeof u === "object" ? JSON.stringify(u) : String(u)
  } catch (_) {
    return String(u)
  }
}
