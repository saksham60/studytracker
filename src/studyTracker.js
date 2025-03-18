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
export default function CMSETracker() {
    const [completed, setCompleted] = useState(() => {
      const saved = localStorage.getItem('completedTopics');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    });
  
    const [collapsed, setCollapsed] = useState({});
  
    useEffect(() => {
      localStorage.setItem('completedTopics', JSON.stringify([...completed]));
    }, [completed]);
  
    const toggleCompletion = (item) => {
      const updated = new Set(completed);
      if (updated.has(item)) updated.delete(item);
      else updated.add(item);
      setCompleted(updated);
    };
  
    const toggleCollapse = (section) => {
      setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
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
        <h1 style={{ textAlign: 'center', color: '#2c7be5' }}>📚 CMSE Learning Tracker</h1>
        {Object.entries(syllabus).map(([paper, subjects]) => (
          <div key={paper} style={{
            marginBottom: '20px',
            backgroundColor: 'white',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}>
            <h2 onClick={() => toggleCollapse(paper)} style={{ 
              cursor: 'pointer',
              color: '#2c7be5',
              borderBottom: '2px solid #e0f0ff',
              paddingBottom: '6px'
            }}>{paper}</h2>
            {!collapsed[paper] && (Array.isArray(subjects)
              ? subjects.map(item => (
                <label key={item} style={{ display: 'block', margin: '6px 0' }}>
                  <input type="checkbox" checked={completed.has(item)} onChange={() => toggleCompletion(item)} />
                  <span style={{ marginLeft: '8px' }}>• {item}</span>
                </label>
              ))
              : Object.entries(subjects).map(([sub, topics]) => (
                <div key={sub} style={{ paddingLeft: '16px', marginBottom: '10px' }}>
                  <h3 onClick={() => toggleCollapse(sub)} style={{ cursor: 'pointer', color: '#5a9cff' }}>{sub}</h3>
                  {!collapsed[sub] && topics.map(topic => (
                    <label key={topic} style={{ display: 'block', margin: '4px 0 4px 16px' }}>
                      <input type="checkbox" checked={completed.has(topic)} onChange={() => toggleCompletion(topic)} />
                      <span style={{ marginLeft: '8px' }}>• {topic}</span>
                    </label>
                  ))}
                </div>
              )))}
          </div>
        ))}
      </div>
    );
  }
  