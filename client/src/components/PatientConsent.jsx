import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const PatientConsent = () => {
  const [doctors, setDoctors] = useState([]);
  const [consentMap, setConsentMap] = useState({});
  const user = supabase.auth.user();

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("role", "doctor");
      setDoctors(data);
    };
    fetchDoctors();
  }, []);

  const toggleConsent = async (doctorId, granted) => {
    await supabase.from("consents").upsert({
      doctor_id: doctorId,
      patient_id: user.id,
      granted,
    });
    setConsentMap((prev) => ({ ...prev, [doctorId]: granted }));
  };

  return (
    <div>
      <h2>Manage Doctor Access</h2>
      {doctors.map((doc) => (
        <div key={doc.id}>
          <label>
            <input
              type="checkbox"
              checked={consentMap[doc.id] || false}
              onChange={(e) => toggleConsent(doc.id, e.target.checked)}
            />
            {doc.full_name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default PatientConsent;
