import crypto from "node:crypto";

export const randomString = (len: number, an?: "a" | "n" | string): string => {
  an = an && an.toLowerCase();
  let str = "",
    i = 0;
  const min = an === "a" ? 10 : 0;
  const max = an === "n" ? 10 : 62;
  for (; i++ < len; ) {
    // let r = (Math.random() * (max - min) + min) << 0;
    let r = crypto.randomInt(min, max); // more secure than Math.random
    str += String.fromCharCode((r += r > 9 ? (r < 36 ? 55 : 61) : 48));
  }
  return str;
};

// randomString gives more control of the generated string
export const randomToken = (len: number): string => {
  return crypto.randomBytes(len).toString("hex");
};
