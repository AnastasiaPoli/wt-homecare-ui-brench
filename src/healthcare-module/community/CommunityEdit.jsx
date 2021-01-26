import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CommunityForm from './CommunityForm';
import { fetchCommunity } from './CommunityReducer';

export default function CommunityEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { community } = useSelector((state) => state.community);

  useEffect(() => {
    if (id) {
      dispatch(fetchCommunity(id));
    }
  }, []);

  return (
    <React.Fragment>
      <h1>Edit Community</h1>
      <CommunityForm community={community} />
    </React.Fragment>
  );
}
