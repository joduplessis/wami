export const MessageSchema = {
  name: "Message",
  properties: {
    _id: { type: "string", indexed: true },
    text: "string",
    mime: "string",
    url: "string?",
    createdAt: "date",
    reactions: "string?[]",
    topic: "string",
    s_id: "string",
    sname: "string",
    simage: "string"
  }
};
