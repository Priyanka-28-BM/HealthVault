const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient"); // your configured client

// Doctor views a patient record (only if consent is given)
router.get("/records/:patientId", async (req, res) => {
  const doctorId = req.user.id; // Assume auth middleware set this
  const patientId = req.params.patientId;

  // 1. Check if user is doctor
  const { data: doctorProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", doctorId)
    .single();

  if (doctorProfile?.role !== "doctor") {
    return res.status(403).json({ error: "Access denied. Not a doctor." });
  }

  // 2. Check if consent exists
  const { data: consent } = await supabase
    .from("consents")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("patient_id", patientId)
    .eq("granted", true)
    .single();

  if (!consent) {
    return res.status(403).json({ error: "No consent from this patient." });
  }

  // 3. If yes, fetch patient records
  const { data: records, error } = await supabase
    .from("records")
    .select("*")
    .eq("patient_id", patientId);

  if (error) return res.status(500).json({ error: error.message });

  res.json(records);
});

module.exports = router;
