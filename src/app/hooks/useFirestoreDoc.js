import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { asyncActionError, asyncActionFinish, asyncActionStart } from '../async/asyncReducer';
import { dataFromSnapshot } from '../firestore/firestoreService';

export default function useFirestoreDoc({query, data, deps, shouldExecute = true}) {
    const dispatch = useDispatch();

    useEffect(() => { //this says, when the event Id changes, run this useEffect, EventDetailedPage.jsx
        if (!shouldExecute) return;
        dispatch(asyncActionStart());
        const unsubscribe = query().onSnapshot(
            snapshot => {
                if (!snapshot.exists) {
                    dispatch(asyncActionError({code: 'not-found', message: 'Could not find document'})); //look at the firestore error handling documentation
                    return;
                }
                data(dataFromSnapshot(snapshot));
                dispatch(asyncActionFinish());
            },
            error => dispatch(asyncActionError())
        );
        return () => {
            unsubscribe()
        }
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}