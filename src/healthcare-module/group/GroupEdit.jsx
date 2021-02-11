import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GroupForm from './GroupForm';
import { fetchGroup } from './GroupReducer';

export default function GroupEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { group } = useSelector((state) => state.group);

  useEffect(() => {
    if (id) {
      dispatch(fetchGroup(id));
    }
  }, []);

  return (
    <React.Fragment>
      <h1>Edit Group</h1>
      <GroupForm group={group} />
    </React.Fragment>
  );
}
