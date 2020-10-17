import firebase from "../config/firebase";

const db = firebase.firestore();

export function dataFromSnapshot(snapshot) {
  if (!snapshot.exists) return undefined;
  const data = snapshot.data();

  for (const prop in data) {
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof firebase.firestore.Timestamp) {
        data[prop] = data[prop].toDate();
      }
    }
  }

  return {
    ...data,
    id: snapshot.id,
  };
}

export function listenToEventsFromFirestore(predicate) {
  const user = firebase.auth().currentUser; //this is a reference to the current user
  let eventsRef = db.collection("events").orderBy("date");
  switch (
    predicate.get("filter") //this allows us to filter
  ) {
    case "isGoing":
      return eventsRef
        .where("attendeeIds", "array-contains", user.uid) //this is how we querry in firebase. we remove what we're not interested in
        .where("date", ">=", predicate.get("startDate")); // >= means greater than or equal to
    case "isHost":
      return eventsRef
        .where("hostUid", "==", user.uid) //we do not want ===
        .where("date", ">=", predicate.get("startDate"));
    default:
      return eventsRef.where("date", ">=", predicate.get("startDate"));
  }
}

export function listenToEventFromFirestore(eventId) {
  //this gives a single Event document
  return db.collection("events").doc(eventId);
}

export function addEventToFirestore(event) {
  const user = firebase.auth().currentUser; //to have a reference to the user
  return db.collection("events").add({
    ...event,
    hostUid: user.uid,
    hostedBy: user.displayName,
    hostPhotoURL: user.photoURL || null, //uses the static image if no image available
    attendees: firebase.firestore.FieldValue.arrayUnion({
      id: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL || null,
    }), //we cannot querry objects, so we need an additional array
    attendeeIds: firebase.firestore.FieldValue.arrayUnion(user.uid), //so we querry string-based arrays
  });
}

export function updateEventInFirestore(event) {
  return db.collection("events").doc(event.id).update(event);
}

export function deleteEventInFirestore(eventId) {
  return db.collection("events").doc(eventId).delete();
}

export function cancelEventToggle(event) {
  return db.collection("events").doc(event.id).update({
    isCancelled: !event.isCancelled,
  }); // we add a new flag to an event
}

export function setUserProfileData(user) {
  return db
    .collection("users")
    .doc(user.uid)
    .set({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL || null, //takes the photo from facebook etc.
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), //keeps our time consistent, instead of local
    });
}

export function getUserProfile(userId) {
  return db.collection("users").doc(userId);
}

export async function updateUserProfile(profile) {
  const user = firebase.auth().currentUser;
  try {
    if (user.displayName !== profile.displayName) {
      await user.updateProfile({
        displayName: profile.displayName,
      });
    }
    return await db.collection("users").doc(user.uid).update(profile);
  } catch (error) {
    throw error;
  }
}

export async function updateUserProfilePhoto(downloadURL, filename) {
  const user = firebase.auth().currentUser;
  const userDocRef = db.collection("users").doc(user.uid);
  try {
    const userDoc = await userDocRef.get();
    if (!userDoc.data().photoURL) {
      //if we do not have a photo file inside userDoc.data, then
      await db.collection("users").doc(user.uid).update({
        photoURL: downloadURL,
      });
      await user.updateProfile({
        photoURL: downloadURL,
      });
    }
    return await db.collection("users").doc(user.uid).collection("photos").add({
      name: filename,
      url: downloadURL,
    });
  } catch (error) {
    throw error;
  }
}

export function getUserPhotos(userUid) {
  return db.collection("users").doc(userUid).collection("photos");
}

export async function setMainPhoto(photo) {
  const user = firebase.auth().currentUser;
  try {
    await db.collection("users").doc(user.uid).update({
      photoURL: photo.url,
    });
    return await user.updateProfile({
      //this updates the auth part of the user profile data
      photoURL: photo.url,
    });
  } catch (error) {
    throw error;
  }
}

export function deletePhotoFromCollection(photoId) {
  const userUid = firebase.auth().currentUser.uid;
  return db
    .collection("users")
    .doc(userUid)
    .collection("photos")
    .doc(photoId)
    .delete();
}

export function addUserAttendance(event) {
  const user = firebase.auth().currentUser;
  return db
    .collection("events")
    .doc(event.id)
    .update({
      attendees: firebase.firestore.FieldValue.arrayUnion({
        id: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL || null,
      }), //we cannot querry objects, so we need an additional array
      attendeeIds: firebase.firestore.FieldValue.arrayUnion(user.uid), //so we querry string-based arrays
    });
}

export async function cancelUserAttendance(event) {
  const user = firebase.auth().currentUser;
  try {
    const eventDoc = await db.collection("events").doc(event.id).get();
    return db
      .collection("events")
      .doc(event.id)
      .update({
        attendeeIds: firebase.firestore.FieldValue.arrayRemove(user.uid), //this is used like an object, hence comma
        attendees: eventDoc
          .data()
          .attendees.filter((attendee) => attendee.id !== user.uid), //we treat this as a normal javascript array, and we set a new array for our attendees, leaving them in place after our method (not ideal, but the way we use firebase)
      });
  } catch (error) {
    throw error;
  }
}

export function getUserEventsQuery(activeTab, userUid) {
  let eventsRef = db.collection("events");
  const today = new Date();
  switch (activeTab) {
    case 1: //past events
      return eventsRef
        .where("attendeeIds", "array-contains", userUid)
        .where("date", "<=", today)
        .orderBy("date", "desc"); //most recent event first
    case 2: // hosting
      return eventsRef.where("hostUid", "==", userUid).orderBy("date");
    default:
      return eventsRef
        .where("attendeeIds", "array-contains", userUid)
        .where('date', '>=', today)
        .orderBy("date"); //ascending order
  }
}

export async function followUser(profile) {
  const user = firebase.auth().currentUser;
  const batch = db.batch(); // create a batch for all our functions, so they get executed simultaneously
  try {
    batch.set(db.collection('following').doc(user.uid).collection('userFollowing').doc(profile.id), { // batch takes reference and then asks what to update (instead of await)
      displayName: profile.displayName,
      photoURL: profile.photoURL,
      uid: profile.id
    });
    batch.update(db.collection('users').doc(user.uid), {
      followingCount: firebase.firestore.FieldValue.increment(1) //this defines the amount for incrementing
    })
    return await batch.commit(); //now we guarantee that either all work or none does
  } catch (error) {
    throw error;
  }
}

export async function unfollowUser(profile) {
  const user = firebase.auth().currentUser;
  const batch = db.batch();
  try {
    batch.delete(db.collection('following').doc(user.uid).collection('userFollowing').doc(profile.id)); //we need to delete the following document
    batch.update(db.collection('users').doc(user.uid), {
      followingCount: firebase.firestore.FieldValue.increment(-1) //this defines the amount for incrementing
    })
    return await batch.commit(); //avoids inconsistent data when we have a problem
  } catch (error) {
    throw error;
  }
}

export function getFollowersCollection(profileId) {
  return db.collection ('following').doc(profileId).collection('userFollowers')
}
export function getFollowingCollection(profileId) {
  return db.collection ('following').doc(profileId).collection('userFollowing')
}

export function getFollowingDoc(profileId) {
  const userUid = firebase.auth().currentUser.uid;
  return db.collection('following').doc(userUid).collection('userFollowing').doc(profileId).get();
}