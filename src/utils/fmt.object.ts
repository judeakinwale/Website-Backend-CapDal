export const formatObjectAsString = <T extends object = Record<any, any>>(
  obj: T,
  limit: number = 1,
  indent = 2,
): string => {
  if (limit < 1) return "";
  limit -= 1;

  const indentStr = " ".padEnd(indent);
  indent += 2;

  let str = "";

  Object.entries(obj)?.map((k, v) => {
    // ? maybe extract getting renderedValue to a separate function
    let renderedValue: string;
    switch (true) {
      case typeof v === "string":
        renderedValue = v;
        break;

      case Array.isArray(v):
        renderedValue = `[${v.join(", ")}]`;
        break;

      case typeof v === "object":
        renderedValue = formatObjectAsString(v, limit, indent);
        break;

      default:
        renderedValue = String(v);
        break;
    }

    const entryStr = `
${indentStr}${k}: 
${indentStr}${indentStr}${renderedValue}
    `;
    str += entryStr;
  });

  return str;
};

export const sortObjectArray = <T extends object = Record<any, any>>(
  arr: T[],
  property: keyof T,
  order: "asc" | "desc" = "asc",
) => {
  const isAsc = order === "asc";
  // create new array
  const sortedArr = arr.toSorted((a, b) => {
    // ? consider normalizing the values first
    if (a[property] < b[property]) return isAsc ? -1 : 1;
    if (a[property] > b[property]) return isAsc ? 1 : -1;
    return 0;
  });

  return sortedArr;
};
