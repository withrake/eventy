const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.addFollowing = functions.firestore
    .document('following/{userUid}/userFollowing/{profileId}') //first specify what(then where)
    .onCreate(async (snapshot, context) => {
        const following = snapshot.data();
        try {
            const userDoc = await db.collection('users').doc(context.params.userUid).get();
            const batch = db.batch();
            batch.set(db.collection('following').doc(context.params.profileId).collection('userFollowers').doc(context.params.userUid), {
                displayName: userDoc.data.displayName,
                photoURL: user.photoURL,
                uid: user.uid
              })
              batch.update(db.collection('users').doc(profile.id), {
                followerCount: firebase.firestore.FieldValue.increment(1) //this defines the amount for incrementing
              })
        } catch (error) {
            return console.log(error);
        }
    }) //when someone follows, we create a new document on the upper path (snapshot). via the context we pass the relevant parameters up