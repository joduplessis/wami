export const UnreadSchema = {
  name: "Unread",
  properties: {
    _id: "string",
    kind: "string",
    last: "string",
    count: { type: "int", default: 0 }
  }
};
