import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ResidentForm from "./ResidentForm";
import { fetchResident } from "./ResidentReducer";

export default function ResidentEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { RESIDENT } = useSelector((state) => state.resident);

  useEffect(() => {
    if (id) {
      dispatch(fetchResident(id));
    }
  }, []);

  return (
    <React.Fragment>
      <h1>Edit Resident</h1>
      <ResidentForm resident={RESIDENT} />
    </React.Fragment>
  );
}
