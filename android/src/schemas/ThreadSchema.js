export const ThreadSchema = {
  name: "Thread",
  properties: {
    name: "string",
    title: "string",
    image: "string",
    color: "string",
    unread: { type: "int", default: 0 },
    modified: "date",
    _id: "string",
    kind: "string",
    topic: { type: "string", indexed: true }
  }
};
