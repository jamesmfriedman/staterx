export const safeParseJSON = (val: any) => {
  try {
    return JSON.parse(val);
  } catch (err) {
    return val;
  }
};
