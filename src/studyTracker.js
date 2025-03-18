import React, { useState, useEffect } from 'react';

const syllabus = {
  'Paper I': {
    '>General Medicine': [
      'Cardiology', 'Respiratory diseases', 'Gastro‐intestinal', 'Genito‐Urinary',
      'Neurology', 'Hematology', 'Endocrinology', 'Metabolic disorders',
      'Infections (Virus, Rickets, Bacterial, Spirochetal, Protozoan, Metazoan, Fungus)',
      'Nutrition/Growth', 'Dermatology', 'Musculoskeletal System',
      'Psychiatry (Depression, psychosis, anxiety, bipolar, schizophrenia)', 'General', 'Emergency Medicine',
      'Common Poisoning', 'Snake bite', 'Tropical Medicine', 'Critical Care Medicine',
      'Medical procedures', 'Pathophysiological basis', 'Vaccine & Non-vaccine preventable diseases',
      'Vitamin deficiency diseases'
    ],
    '>Paediatrics': [
      'Common childhood emergencies', 'Basic newborn care', 'Developmental milestones',
      'Accidents & poisonings', 'Birth defects (autism)', 'Immunization',
      'Children with special needs', 'National child health programmes'
    ]
  },
  'Paper II': {
    '>Surgery': [
      'General Surgery (Wounds, Infections, Tumours, etc.)', 'Urological Surgery', 'Neuro Surgery',
      'Otorhinolaryngology (ENT)', 'Thoracic Surgery', 'Orthopedic Surgery', 'Ophthalmology',
      'Anesthesiology', 'Traumatology', 'Common surgical ailments', 'Pre/post-operative care',
      'Medicolegal issues', 'Wound healing', 'Fluid & electrolyte management', 'Shock management'
    ],
    '>Gynaecology & Obstetrics': [
      'Ante/Intra/Post-natal conditions', 'Labour management', 'Applied anatomy & physiology',
      'Genital infections', 'Genital neoplasms', 'Uterus displacement', 'Safe delivery practices',
      'High-risk pregnancy', 'Abortions', 'IUGR', 'Medicolegal examination', 'Contraceptives & Family planning',
      'Medical Termination of Pregnancy'
    ],
    '>Preventive & Social Medicine': [
      'Community Medicine', 'Health & Disease concepts', 'Health Administration',
      'Epidemiology', 'Demography & Statistics', 'Communicable Diseases', 'Environmental Health',
      'Nutrition & Health', 'Non‐communicable diseases', 'Occupational Health', 'Genetics & Health',
      'International Health', 'Medical Sociology', 'Maternal & Child Health', 'National Programmes',
      'Common health problems', 'Monitoring health programmes', 'Maternal & Child wellness',
      'Community health management (malnutrition & emergencies)'
    ]
  },
  'Personality Test': [
    'General Knowledge', 'Intellectual curiosity', 'Critical assimilation', 'Balance of judgement',
    'Alertness of mind', 'Social cohesion', 'Integrity', 'Initiative', 'Leadership'
  ]
};

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbySB9ju3WbEOSCGtLjGgJ5wjk7l0M5PSPD_OA7sQfUhE9EjcWiVkTzxmxDB4X4RQfkw/exec';

export default function CMSETracker() {
    const [completed, setCompleted] = useState(new Set());
    const [collapsed, setCollapsed] = useState({});
  
    // Load from the sheet on first render
    useEffect(() => {
      fetch(SHEETS_URL)
        .then(res => res.json())
        .then(rows => {
          // 'rows' is the data slice (no headers)
          // each row => [Paper, Section, Topic, Completed]
          const completedTopics = rows
            .filter(row => row[3] === 'TRUE' || row[3] === true)
            .map(row => row[2]);
          setCompleted(new Set(completedTopics));
        })
        .catch(err => console.error('GET error:', err));
    }, []);
  
    // Toggle a topic's completed status
    const toggleCompletion = (topic) => {
      const newCompleted = new Set(completed);
      const newStatus = !newCompleted.has(topic);
  
      if (newStatus) newCompleted.add(topic);
      else newCompleted.delete(topic);
  
      setCompleted(newCompleted);
  
      // POST to the sheet
      fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, completed: newStatus })
      })
      .then(res => res.text())
      .then(text => console.log('POST response:', text))
      .catch(err => console.error('POST error:', err));
    };
  
    // Expand/collapse sections
    const toggleCollapse = (key) => {
      setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
    };
  
    return (
      <div style={{
        padding: '24px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(to bottom, #f5faff, #e0f0ff)',
        color: '#333',
        minHeight: '100vh'
      }}>
        <h1 style={{ textAlign: 'center', color: '#2c7be5' }}>
          📚 CMSE Learning Tracker
        </h1>
  
        {Object.entries(syllabus).map(([paper, sections]) => (
          <div key={paper} style={{
            marginBottom: '20px',
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <h2
              onClick={() => toggleCollapse(paper)}
              style={{
                cursor: 'pointer',
                color: '#2c7be5',
                borderBottom: '2px solid #e0f0ff',
                paddingBottom: '6px'
              }}
            >
              {paper}
            </h2>
            
            {!collapsed[paper] && (Array.isArray(sections)
              ? sections.map(topic => (
                  <label key={topic} style={{ display: 'block', margin: '6px 0' }}>
                    <input
                      type="checkbox"
                      checked={completed.has(topic)}
                      onChange={() => toggleCompletion(topic)}
                    />
                    <span style={{ marginLeft: '8px' }}>• {topic}</span>
                  </label>
                ))
              : Object.entries(sections).map(([sub, topics]) => (
                  <div key={sub} style={{ paddingLeft: '16px', marginBottom: '10px' }}>
                    <h3
                      onClick={() => toggleCollapse(sub)}
                      style={{ cursor: 'pointer', color: '#5a9cff' }}
                    >
                      {sub}
                    </h3>
                    {!collapsed[sub] && topics.map(topic => (
                      <label
                        key={topic}
                        style={{ display: 'block', margin: '4px 0 4px 16px' }}
                      >
                        <input
                          type="checkbox"
                          checked={completed.has(topic)}
                          onChange={() => toggleCompletion(topic)}
                        />
                        <span style={{ marginLeft: '8px' }}>• {topic}</span>
                      </label>
                    ))}
                  </div>
                ))
            )}
          </div>
        ))}
      </div>
    );
  }