import React, { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Grid,
  Header,
  Item,
  Reveal,
  Segment,
  Statistic,
} from "semantic-ui-react";
import { toast } from "react-toastify";
import { followUser, getFollowingDoc, unfollowUser } from "../../../app/firestore/firestoreService";
import { useDispatch, useSelector } from 'react-redux';
import { setFollowUser, setUnfollowUser } from '../profileActions';
import { CLEAR_FOLLOWINGS } from '../profileConstants';

export default function ProfileHeader({ profile, isCurrentUser }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {followingUser} = useSelector(state => state.profile);

  useEffect(() => {
    if (isCurrentUser) return;
    setLoading(true);
    async function fetchFollowingDoc() {
      try {
        const followingDoc = await getFollowingDoc(profile.id);
        if (followingDoc && followingDoc.exists) {
          dispatch(setFollowUser())
        } //to see if we have sth inside the object, we need to use the async inside the useEffect because of impediments (see documentation)
      } catch (error) {
        toast.error(error.message);
      }
    }
    fetchFollowingDoc().then(() => setLoading(false));
    return () => {
      dispatch({type: CLEAR_FOLLOWINGS});
    }
  }, [dispatch, profile.id, isCurrentUser]) 

  async function handleFollowUser() {
    setLoading(true);
    try {
      await followUser(profile);
      dispatch(setFollowUser());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  async function handleUnfollowUser() {
    setLoading(true);
    try {
      await unfollowUser(profile);
      dispatch(setUnfollowUser());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size='small'
                src={profile.photoURL || "/assets/user.png"}
              />
              <Item.Content verticalAlign='middle'>
                <Header
                  as='h1'
                  style={{ display: "block", marginBottom: 10 }}
                  content={profile.displayName}
                />
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group>
            <Statistic label='Followers' value={profile.followerCount || 0} />
            <Statistic label='Following' value={profile.followingCount || 0} />
          </Statistic.Group>
          {!isCurrentUser && (
            <>
              <Divider />
              <Reveal animated='move'>
                <Reveal.Content visible style={{ width: "100%" }}>
                  <Button fluid color='teal' content={followingUser ? 'Following' : 'Not following'} />
                </Reveal.Content> 
                <Reveal.Content hidden style={{ width: "100%" }}> 
                  <Button  //this hides the follow buttons on own profile
                    onClick={followingUser ? () => handleUnfollowUser() : () => handleFollowUser()} //if we are following, give option to unfollow, else give option to follow
                    loading={loading}
                    basic
                    fluid
                    color={followingUser ? 'red' : 'green'}
                    content={followingUser ? 'Unfollow' : 'Follow'}
                  />
                </Reveal.Content> 
              </Reveal> 
            </> 
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  );
}
