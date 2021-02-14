import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import VitalForm from "./VitalForm";
import { fetchVital } from "./VitalReducer";

export default function VitalEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { VITAL } = useSelector((state) => state.vital);

  useEffect(() => {
    if (id) {
      dispatch(fetchVital(id));
    }
  }, []);

  return (
    <React.Fragment>
      <h1>Edit Vital</h1>
      <VitalForm vital={VITAL} />
    </React.Fragment>
  );
}
