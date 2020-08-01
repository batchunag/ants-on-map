import * as functions from 'firebase-functions'
import expressApp from './app'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const app = functions.region('asia-northeast1').https.onRequest(expressApp)
