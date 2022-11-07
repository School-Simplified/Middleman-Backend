import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { QueryDocumentSnapshot } from "firebase-functions/v1/firestore";
import { PDFDocument } from "pdf-lib";
import { createWriteStream, unlinkSync, readFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const logOnDatabaseUpdate = functions.firestore
  .document("/cs_hour_checkouts/{id}")
  .onCreate(async (document: QueryDocumentSnapshot) => {
    if (document.data().logs.length <= 0) return;
    const ticket = document.data();
    const allLogs = await Promise.all(
      ticket.logs.map(async (log: any) => {
        return (
          await admin.firestore(functions.app.admin).doc(log).get()
        ).data();
      })
    );
    const allLogReasons = (allLogs as Array<any>).map((log: any) => log.reason);
    const earliestDate = new Date(
      Math.max.apply(
        Math,
        allLogs.map((log: any) => log.from)
      )
    );
    const latestDate = new Date(
      Math.max.apply(
        Math,
        allLogs.map((log: any) => log.to)
      )
    );
    const user = (
      await admin
        .firestore(functions.app.admin)
        .doc("/users/" + document.data().user)
        .get()
    )?.data();
    const template = admin
      .storage(functions.app.admin)
      .bucket("ss-stuff-b4281.appspot.com")
      .file("CS Hour Request Template.pdf");
    await template.makePublic();
    const fileName = `${user?.firstName} ${user?.lastName} CS Hour Log - ${document.id}.pdf`;
    const tempFilePath = join(tmpdir(), fileName);
    await template.download({ destination: tempFilePath });
    const cert = await PDFDocument.load(readFileSync(tempFilePath));
    cert.setTitle(fileName);
    // update the new pdf
    const page = cert.getPage(0);
    const { height } = page.getSize();
    const fontSize = 12;
    const fields = [
      {
        point: [76, height - 190],
        value: `${user?.firstName} ${user?.lastName}`,
      },
      {
        point: [320, height - 190],
        value: user?.orgEmail,
      },
      {
        point: [76, height - 230],
        value: user?.address,
      },
      {
        point: [320, height - 230],
        value: user?.phoneNumber,
      },
      {
        point: [140, height - 265],
        value: ticket.hours,
      },
      {
        point: [415, height - 265],
        value: `${earliestDate.toLocaleDateString()} - ${latestDate.toLocaleDateString()}`,
      },
      {
        point: [75, height - 310],
        value: allLogReasons,
      },
      {
        point: [170, height - 448],
        value: user?.school,
      },
      {
        point: [170, height - 468],
        value: user?.schoolAddress,
      },
      {
        point: [170, height - 488],
        value: user?.schoolTelephone,
      },
      {
        point: [240, height - 640],
        value: new Date().toLocaleDateString(),
      },
      {
        point: [240, height - 660],
        value: document.id,
      },
    ];
    console.log(cert.getTitle());
    fields.forEach((f) => {
      page.moveTo(f.point[0], f.point[1]);
      if (typeof f.value == "string") {
        page.drawText(f.value, {
          size: fontSize,
        });
      } else if (Array.isArray(f.value)) {
        for (let r of f.value) {
          page.drawText(r, {
            size: fontSize,
          });
          page.moveDown(10);
        }
      }
    });

    createWriteStream(tempFilePath).write(await cert.save());
    const resp = await admin
      .storage(functions.app.admin)
      .bucket("ss-stuff-b4281.appspot.com")
      .upload(tempFilePath, {
        destination: fileName,
        metadata: {
          contentType: "application/pdf",
        },
      });
    await resp[0].makePublic();
    await admin
      .firestore(functions.app.admin)
      .collection("cs_hour_checkouts")
      .doc(document.id)
      .update({
        certificate_url: resp[0].publicUrl(),
      });
    await unlinkSync(tempFilePath);
  });
