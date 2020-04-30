/** Given a full url, return just the domain */
export const rawDomain = (val: string) =>
  val.replace('www.', '').split('://')?.[1].split('/')?.[0] || '';
