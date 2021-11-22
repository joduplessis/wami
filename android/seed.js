// These are sample Realm queries to use as seeding and also debuggin

/*
import Realm from "realm";
import { MessageSchema, ThreadSchema, UnreadSchema } from "./src/schemas";

setInterval(() => {
  Realm.open({ schema: [ThreadSchema] })
    .then(realm => {
      realm.write(() => {
        realm.create("Thread", {
          name: new Date().getTime().toString(),
          title: "Group",
          image: "5b6631c6c252dca5c325700b_1536059214698.JPG",
          color: "#EF6C31",
          unread: 3,
          modified: new Date(),
          _id: "5b757ce58e43d11d2a90f910",
          kind: "group",
          topic: "5b757ce58e43d11d2a90f910"
        });
      });

      realm.close();
    })
    .catch(error => {
      console.log(error);
    });
}, 2000);

Realm.deleteFile({});

setInterval(() => {
  Realm.open({ schema: [ThreadSchema] })
    .then(realm => {
      realm.write(() => {
        realm.create("Thread", {
          name: "Super",
          title: "Group",
          image: "5b6631c6c252dca5c325700b_1536059214698.JPG",
          color: "#EF6C31",
          unread: 3,
          modified: new Date(),
          _id: "5b757ce58e43d11d2a90f910",
          kind: "group",
          topic: "5b757ce58e43d11d2a90f910"
        });
      });

      //realm.close();
    })
    .catch(error => {
      console.log(error);
    });
}, 5000);

Realm.open({ schema: [ThreadSchema, MessageSchema] })
  .then(realm => {
    console.log(realm.path);

    realm.write(() => {
      realm.create("Message", {
        _id: "5b6631c6c252dca5c325700b",
        text: "Hi there",
        mime: "plain/text",
        url: null,
        createdAt: new Date(),
        reactions: ["thumbsup"],
        topic: "5b6631c6c252dca5c325700b/5b6ea6495d6406ac2b0cc631",
        s_id: "5b6ea536293ef8c023eddde9",
        sname: "Bronwyn Mcpherson",
        simage: "5b6631c6c252dca5c325700b_1536059214698.JPG"
      });

      realm.create("Thread", {
        name: "Super",
        title: "Group",
        image: "5b6631c6c252dca5c325700b_1536059214698.JPG",
        color: "#EF6C31",
        unread: 3,
        modified: new Date(),
        _id: "5b757ce58e43d11d2a90f910",
        kind: "group",
        topic: "5b757ce58e43d11d2a90f910"
      });

      realm.create("Thread", {
        name: "Incredibles",
        title: "Wami",
        image: "5b6631c6c252dca5c325700b_1536059214698.JPG",
        color: "#2CD1C0",
        unread: 0,
        modified: new Date(),
        _id: "5b6d6bbd91deeb084b8d242a",
        kind: "channel",
        topic: "5b6d6bbd91deeb084b8d242a"
      });

      realm.create("Thread", {
        name: "Bronwyn Mcpherson",
        title: "Nutritionist",
        image: "5b6631c6c252dca5c325700b_1536059214698.JPG",
        color: "#3E3E3F",
        unread: 0,
        modified: new Date(),
        _id: "5b6ea536293ef8c023eddde9",
        kind: "user",
        topic: "5b6631c6c252dca5c325700b/5b6ea6495d6406ac2b0cc631"
      });
    });

    realm.close();
  })
  .catch(error => {
    console.log(error);
  });
*/
