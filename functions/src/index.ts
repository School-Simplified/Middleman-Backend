import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import { PDFDocument } from "pdf-lib";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const logOnDatabaseUpdate = functions.firestore
  .document("/cs_hour_checkouts/{id}")
  .onCreate(async (document) => {
    if (document.data().logs.length <= 0) return;
    const user = await admin
      .firestore(functions.app.admin)
      .doc("/users/" + document.data().user)
      .get();
    const template = admin
      .storage(functions.app.admin)
      .bucket("ss-stuff-b4281.appspot.com")
      .file("CS Request Template.pdf");
    const fileName = `${user.data()?.firstName} ${
      user.data()?.lastName
    } CS Hour Log - ${document.id}.pdf`;
    await template.copy(fileName);
    await admin
      .firestore(functions.app.admin)
      .doc("/cs_hour_checkouts/" + document.id)
      .update({
        certificate_url:
          "https://firebasestorage.googleapis.com/v0/b/ss-stuff-b4281.appspot.com/o/" +
          fileName,
      });
  });
