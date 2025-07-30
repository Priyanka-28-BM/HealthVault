import React, { useEffect, useState } from 'react';

/**
 * This component renders a timeline view of medical records sorted by date.
 * It also fetches AI-generated health insights from LLaMA-3 based on the records.
 */
const TimelineView = ({ medicalRecords }) => {
  const [insights, setInsights] = useState(null);

  // Sort the records by date (newest to oldest)
  const sortedRecords = [...medicalRecords].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Function to get insights from AI
  const fetchInsights = async () => {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3',
          prompt: `Analyze the following medical records. Give short insights on repeated symptoms, potential deficiencies, and lifestyle suggestions:\n\n${JSON.stringify(medicalRecords)}`,
          stream: false,
        }),
      });

      const data = await response.json();
      setInsights(data.response);
    } catch (error) {
      console.error('AI insight fetch failed:', error);
      setInsights('Unable to fetch insights at the moment.');
    }
  };

  // Fetch insights once when component loads
  useEffect(() => {
    if (medicalRecords?.length > 0) {
      fetchInsights();
    }
  }, [medicalRecords]);

  return (
    <div style={{ padding: '20px', borderRadius: '10px', background: '#f9f9f9' }}>
      <h2>📅 Medical Timeline</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {sortedRecords.map((record, index) => (
          <li key={index} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
            <strong>{new Date(record.date).toLocaleDateString()}</strong>
            <p>📝 <b>Notes:</b> {record.notes}</p>
            <p>💊 <b>Diagnosis:</b> {record.diagnosis}</p>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '30px', padding: '15px', background: '#eef9f1', border: '1px solid #cce5cc' }}>
        <h3>🧠 AI-Generated Insights</h3>
        {insights ? <p>{insights}</p> : <p>Generating insights...</p>}
      </div>
    </div>
  );
};

export default TimelineView;
