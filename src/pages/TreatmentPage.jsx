import React from "react";
import { useParams } from "react-router-dom";
import treatments from "../data/treatmentsData";
import TreatmentTemplate from "../components/TreatmentTemplate";

export default function TreatmentPage() {
  const { slug } = useParams();
  const treatment = treatments.find((t) => t.slug === slug);

  if (!treatment) {
    return <h1 className="page-title">Treatment not found</h1>;
  }

  return <TreatmentTemplate treatment={treatment} />;
}
