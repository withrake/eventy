const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.addFollowing = functions.firestore
    .document('following/{userUid}/userFollowing/{profileId}') //first specify what(then where)
    .onCreate(async (snapshot, context) => {
        const following = snapshot.data();
        console.log({ following });
        try {
            const userDoc = await db
              .collection('users')
              .doc(context.params.userUid)
              .get();
            const batch = db.batch();
            batch.set(
              db
                .collection('following')
                .doc(context.params.profileId)
                .collection('userFollowers')
                .doc(context.params.userUid), 
                {
                displayName: userDoc.data().displayName,
                photoURL: userDoc.data().photoURL,
                uid: userDoc.id,
              }
              );
              batch.update(db.collection('users').doc(context.params.profileId), {
                followerCount: admin.firestore.FieldValue.increment(1), //this defines the amount for incrementing
              });
              return await batch.commit();
        } catch (error) {
            return console.log(error);
        }
    }); //when someone follows, we create a new document on the upper path (snapshot). via the context we pass the relevant parameters up


exports.removeFollowing = functions.firestore
    .document('following/{userUid}/userFollowing/{profileId}')
    .onDelete(async (snapshot, context) => {
      const batch = db.batch();
        batch.delete(
          db
            .collection('following')
            .doc(context.params.profileId)
            .collection('userFollowers')
            .doc(context.params.userUid)); //we need to delete the following document
        batch.update(db.collection('users').doc(context.params.profileId), {
            followerCount: admin.firestore.FieldValue.increment(-1), //this defines the amount for incrementing
          });
          try {
            return await batch.commit();
          } catch (error) {
          return console.log(error); //we always have to return the console.log from the server
      } 
    });

    exports.eventUpdated = functions.firestore
      .document('events/{eventId}')
      .onUpdate(async (snapshot, context) => {
        const before = snapshot.before.data();
        const after = snapshot.after.data();
        if (before.attendees.length < after.attendees.length) { // if the before is smaller than the after, we know someone joined
          let attendeeJoined = after.attendees.filter(item1 => !before.attendees.some(item2 => item2.id === item1.id))[0]; //this should give us the item that joined
          console.log({attendeeJoined});
          try {
            const followerDocs = await db.collection('following').doc(attendeeJoined.id).collection('userFollowers').get();
            followerDocs.forEach(doc => {
              admin.database().ref(`/posts/${doc.id}`).push(newPost(attendeeJoined, 'joined-event', context.params.eventId, before))
            })
          } catch (error) {
            return console.log(error);
          }
        }
        if (before.attendees.length > after.attendees.length) { // if the before is bigger than the after, we know someone left
          let attendeeLeft = before.attendees.filter(item1 => !after.attendees.some(item2 => item2.id === item1.id))[0]; //this should give us the item that left
          console.log({attendeeLeft});
          try {
            const followerDocs = await db.collection('following').doc(attendeeLeft.id).collection('userFollowers').get();
            followerDocs.forEach(doc => {
              admin.database().ref(`/posts/${doc.id}`).push(newPost(attendeeLeft, 'left-event', context.params.eventId, before))
            })
          } catch (error) {
            return console.log(error);
          }
        }
        return console.log('finished');
      })

  function newPost(user, code, eventId, event) {
    return {
      photoURL: user.photoURL,
      date: admin.database.ServerValue.TIMESTAMP,
      code,
      displayName: user.displayName,
      eventId,
      userUid: user.id,
      title: event.title,
    }
  }