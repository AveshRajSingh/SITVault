import React, { useState } from 'react';
import { FaGraduationCap, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

function Syllabus() {
  const { isAuthenticated } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState(null); // 'btech' or 'diploma'
  const [selectedBranch, setSelectedBranch] = useState(null); // 'civil', 'mech', 'ee', 'cse'
  const [selectedSemester, setSelectedSemester] = useState(null); // 1-8 or 1-6
  const [expandedSubject, setExpandedSubject] = useState(null); // Track which subject is expanded

  // Branch configuration
  const branches = {
    btech: [
      { id: 'civil', name: 'Civil Engineering', code: 'CE' },
      { id: 'mech', name: 'Mechanical Engineering', code: 'ME' },
      { id: 'ee', name: 'Electrical Engineering', code: 'EE' },
      { id: 'cse', name: 'Computer Science Engineering', code: 'CSE' }
    ],
    diploma: [
      { id: 'civil', name: 'Civil Engineering', code: 'CE' },
      { id: 'mech', name: 'Mechanical Engineering', code: 'ME' },
      { id: 'ee', name: 'Electrical Engineering', code: 'EE' },
      { id: 'cse', name: 'Computer Science Engineering', code: 'CSE' }
    ]
  };

  // Dummy subjects data structure
  const syllabusData = {
    btech: {
      civil: {
        1: [
          { id: 1, name: 'Engineering Mathematics-I', code: 'MA101' },
          { id: 2, name: 'Engineering Physics', code: 'PH101' },
          { id: 3, name: 'Engineering Chemistry', code: 'CH101' },
          { id: 4, name: 'Basic Electrical Engineering', code: 'EE101' },
          { id: 5, name: 'Engineering Graphics', code: 'CE101' }
        ],
        2: [
          { id: 1, name: 'Engineering Mathematics-II', code: 'MA102' },
          { id: 2, name: 'Mechanics of Solids', code: 'CE102' },
          { id: 3, name: 'Surveying', code: 'CE103' },
          { id: 4, name: 'Building Materials', code: 'CE104' },
          { id: 5, name: 'Environmental Engineering', code: 'CE105' }
        ],
        3: [
          { id: 1, name: 'Fluid Mechanics', code: 'CE201' },
          { id: 2, name: 'Structural Analysis-I', code: 'CE202' },
          { id: 3, name: 'Geotechnical Engineering', code: 'CE203' },
          { id: 4, name: 'Concrete Technology', code: 'CE204' },
          { id: 5, name: 'Transportation Engineering-I', code: 'CE205' }
        ],
        4: [
          { id: 1, name: 'Hydraulic Engineering', code: 'CE301' },
          { id: 2, name: 'Structural Analysis-II', code: 'CE302' },
          { id: 3, name: 'Foundation Engineering', code: 'CE303' },
          { id: 4, name: 'RCC Design', code: 'CE304' },
          { id: 5, name: 'Transportation Engineering-II', code: 'CE305' }
        ],
        5: [
          { id: 1, name: 'Advanced Structural Design', code: 'CE401' },
          { id: 2, name: 'Water Resources Engineering', code: 'CE402' },
          { id: 3, name: 'Construction Management', code: 'CE403' },
          { id: 4, name: 'Steel Structure Design', code: 'CE404' },
          { id: 5, name: 'Earthquake Engineering', code: 'CE405' }
        ],
        6: [
          { id: 1, name: 'Project Planning & Management', code: 'CE501' },
          { id: 2, name: 'Environmental Impact Assessment', code: 'CE502' },
          { id: 3, name: 'Advanced Foundation Engineering', code: 'CE503' },
          { id: 4, name: 'Bridge Engineering', code: 'CE504' },
          { id: 5, name: 'Elective-I', code: 'CE505' }
        ],
        7: [
          { id: 1, name: 'Quantity Surveying & Costing', code: 'CE601' },
          { id: 2, name: 'Urban Planning', code: 'CE602' },
          { id: 3, name: 'Pre-stressed Concrete', code: 'CE603' },
          { id: 4, name: 'Elective-II', code: 'CE604' },
          { id: 5, name: 'Major Project', code: 'CE605' }
        ],
        8: [
          { id: 1, name: 'Industrial Training', code: 'CE701' },
          { id: 2, name: 'Project Work', code: 'CE702' },
          { id: 3, name: 'Seminar', code: 'CE703' },
          { id: 4, name: 'Elective-III', code: 'CE704' }
        ]
      },
      mech: {
        1: [
          { id: 1, name: 'Engineering Mathematics-I', code: 'MA101' },
          { id: 2, name: 'Engineering Physics', code: 'PH101' },
          { id: 3, name: 'Engineering Chemistry', code: 'CH101' },
          { id: 4, name: 'Basic Electrical Engineering', code: 'EE101' },
          { id: 5, name: 'Engineering Graphics', code: 'ME101' }
        ],
        2: [
          { id: 1, name: 'Engineering Mathematics-II', code: 'MA102' },
          { id: 2, name: 'Thermodynamics', code: 'ME102' },
          { id: 3, name: 'Mechanics of Materials', code: 'ME103' },
          { id: 4, name: 'Manufacturing Processes', code: 'ME104' },
          { id: 5, name: 'Material Science', code: 'ME105' }
        ],
        3: [
          { id: 1, name: 'Fluid Mechanics', code: 'ME201' },
          { id: 2, name: 'Machine Design-I', code: 'ME202' },
          { id: 3, name: 'Theory of Machines', code: 'ME203' },
          { id: 4, name: 'Manufacturing Technology', code: 'ME204' },
          { id: 5, name: 'Engineering Thermodynamics', code: 'ME205' }
        ],
        4: [
          { id: 1, name: 'Heat Transfer', code: 'ME301' },
          { id: 2, name: 'Machine Design-II', code: 'ME302' },
          { id: 3, name: 'Dynamics of Machines', code: 'ME303' },
          { id: 4, name: 'Production Technology', code: 'ME304' },
          { id: 5, name: 'Fluid Machinery', code: 'ME305' }
        ],
        5: [
          { id: 1, name: 'Power Plant Engineering', code: 'ME401' },
          { id: 2, name: 'IC Engines', code: 'ME402' },
          { id: 3, name: 'Refrigeration & Air Conditioning', code: 'ME403' },
          { id: 4, name: 'CAD/CAM', code: 'ME404' },
          { id: 5, name: 'Industrial Engineering', code: 'ME405' }
        ],
        6: [
          { id: 1, name: 'Automobile Engineering', code: 'ME501' },
          { id: 2, name: 'Mechatronics', code: 'ME502' },
          { id: 3, name: 'Finite Element Analysis', code: 'ME503' },
          { id: 4, name: 'Elective-I', code: 'ME504' },
          { id: 5, name: 'Project Management', code: 'ME505' }
        ],
        7: [
          { id: 1, name: 'Robotics', code: 'ME601' },
          { id: 2, name: 'Operations Research', code: 'ME602' },
          { id: 3, name: 'Advanced Manufacturing', code: 'ME603' },
          { id: 4, name: 'Elective-II', code: 'ME604' },
          { id: 5, name: 'Major Project', code: 'ME605' }
        ],
        8: [
          { id: 1, name: 'Industrial Training', code: 'ME701' },
          { id: 2, name: 'Project Work', code: 'ME702' },
          { id: 3, name: 'Seminar', code: 'ME703' },
          { id: 4, name: 'Elective-III', code: 'ME704' }
        ]
      },
      ee: {
        1: [
          { id: 1, name: 'Engineering Mathematics-I', code: 'MA101' },
          { id: 2, name: 'Engineering Physics', code: 'PH101' },
          { id: 3, name: 'Engineering Chemistry', code: 'CH101' },
          { id: 4, name: 'Basic Electrical Engineering', code: 'EE101' },
          { id: 5, name: 'Engineering Graphics', code: 'EE102' }
        ],
        2: [
          { id: 1, name: 'Engineering Mathematics-II', code: 'MA102' },
          { id: 2, name: 'Circuit Theory', code: 'EE201' },
          { id: 3, name: 'Electrical Measurements', code: 'EE202' },
          { id: 4, name: 'Electronic Devices', code: 'EE203' },
          { id: 5, name: 'Network Analysis', code: 'EE204' }
        ],
        3: [
          { id: 1, name: 'Electromagnetic Theory', code: 'EE301' },
          { id: 2, name: 'Electrical Machines-I', code: 'EE302' },
          { id: 3, name: 'Analog Electronics', code: 'EE303' },
          { id: 4, name: 'Signals & Systems', code: 'EE304' },
          { id: 5, name: 'Control Systems', code: 'EE305' }
        ],
        4: [
          { id: 1, name: 'Power Systems-I', code: 'EE401' },
          { id: 2, name: 'Electrical Machines-II', code: 'EE402' },
          { id: 3, name: 'Digital Electronics', code: 'EE403' },
          { id: 4, name: 'Microprocessors', code: 'EE404' },
          { id: 5, name: 'Power Electronics', code: 'EE405' }
        ],
        5: [
          { id: 1, name: 'Power Systems-II', code: 'EE501' },
          { id: 2, name: 'Electrical Drives', code: 'EE502' },
          { id: 3, name: 'Microcontrollers', code: 'EE503' },
          { id: 4, name: 'High Voltage Engineering', code: 'EE504' },
          { id: 5, name: 'Renewable Energy Systems', code: 'EE505' }
        ],
        6: [
          { id: 1, name: 'Power System Protection', code: 'EE601' },
          { id: 2, name: 'Power System Analysis', code: 'EE602' },
          { id: 3, name: 'Industrial Automation', code: 'EE603' },
          { id: 4, name: 'Elective-I', code: 'EE604' },
          { id: 5, name: 'Project Management', code: 'EE605' }
        ],
        7: [
          { id: 1, name: 'Power System Operation & Control', code: 'EE701' },
          { id: 2, name: 'Smart Grid Technology', code: 'EE702' },
          { id: 3, name: 'Electrical Machine Design', code: 'EE703' },
          { id: 4, name: 'Elective-II', code: 'EE704' },
          { id: 5, name: 'Major Project', code: 'EE705' }
        ],
        8: [
          { id: 1, name: 'Industrial Training', code: 'EE801' },
          { id: 2, name: 'Project Work', code: 'EE802' },
          { id: 3, name: 'Seminar', code: 'EE803' },
          { id: 4, name: 'Elective-III', code: 'EE804' }
        ]
      },
      cse: {
        1: [
          { id: 1, name: 'Engineering Mathematics-I', code: 'MA101' },
          { id: 2, name: 'Engineering Physics', code: 'PH101' },
          { id: 3, name: 'Programming in C', code: 'CS101' },
          { id: 4, name: 'Digital Logic Design', code: 'CS102' },
          { id: 5, name: 'Basic Electronics', code: 'EC101' }
        ],
        2: [
          { id: 1, name: 'Engineering Mathematics-II', code: 'MA102' },
          { id: 2, name: 'Data Structures', code: 'CS201' },
          { id: 3, name: 'Object Oriented Programming', code: 'CS202' },
          { id: 4, name: 'Computer Organization', code: 'CS203' },
          { id: 5, name: 'Discrete Mathematics', code: 'MA201' }
        ],
        3: [
          { id: 1, name: 'Database Management Systems', code: 'CS301' },
          { id: 2, name: 'Operating Systems', code: 'CS302' },
          { id: 3, name: 'Computer Networks', code: 'CS303' },
          { id: 4, name: 'Design & Analysis of Algorithms', code: 'CS304' },
          { id: 5, name: 'Software Engineering', code: 'CS305' }
        ],
        4: [
          { id: 1, name: 'Web Technologies', code: 'CS401' },
          { id: 2, name: 'Compiler Design', code: 'CS402' },
          { id: 3, name: 'Computer Graphics', code: 'CS403' },
          { id: 4, name: 'Theory of Computation', code: 'CS404' },
          { id: 5, name: 'Microprocessors', code: 'CS405' }
        ],
        5: [
          { id: 1, name: 'Machine Learning', code: 'CS501' },
          { id: 2, name: 'Artificial Intelligence', code: 'CS502' },
          { id: 3, name: 'Information Security', code: 'CS503' },
          { id: 4, name: 'Cloud Computing', code: 'CS504' },
          { id: 5, name: 'Mobile Application Development', code: 'CS505' }
        ],
        6: [
          { id: 1, name: 'Big Data Analytics', code: 'CS601' },
          { id: 2, name: 'Blockchain Technology', code: 'CS602' },
          { id: 3, name: 'Internet of Things', code: 'CS603' },
          { id: 4, name: 'Elective-I', code: 'CS604' },
          { id: 5, name: 'Project Management', code: 'CS605' }
        ],
        7: [
          { id: 1, name: 'Deep Learning', code: 'CS701' },
          { id: 2, name: 'Natural Language Processing', code: 'CS702' },
          { id: 3, name: 'Cyber Security', code: 'CS703' },
          { id: 4, name: 'Elective-II', code: 'CS704' },
          { id: 5, name: 'Major Project', code: 'CS705' }
        ],
        8: [
          { id: 1, name: 'Industrial Training', code: 'CS801' },
          { id: 2, name: 'Project Work', code: 'CS802' },
          { id: 3, name: 'Seminar', code: 'CS803' },
          { id: 4, name: 'Elective-III', code: 'CS804' }
        ]
      }
    },
    diploma: {
      civil: {
        1: [
          { id: 1, name: 'Applied Mathematics-I', code: 'MA101' },
          { id: 2, name: 'Applied Physics', code: 'PH101' },
          { id: 3, name: 'Applied Chemistry', code: 'CH101' },
          { id: 4, name: 'Engineering Drawing', code: 'CE101' },
          { id: 5, name: 'Workshop Practice', code: 'WS101' }
        ],
        2: [
          { id: 1, name: 'Applied Mathematics-II', code: 'MA102' },
          { id: 2, name: 'Surveying-I', code: 'CE201' },
          { id: 3, name: 'Building Materials & Construction', code: 'CE202' },
          { id: 4, name: 'Engineering Mechanics', code: 'CE203' },
          { id: 5, name: 'Computer Applications', code: 'CS101' }
        ],
        3: [
          { id: 1, name: 'Strength of Materials', code: 'CE301' },
          { id: 2, name: 'Surveying-II', code: 'CE302' },
          { id: 3, name: 'Concrete Technology', code: 'CE303' },
          { id: 4, name: 'Hydraulics', code: 'CE304' },
          { id: 5, name: 'Environmental Engineering', code: 'CE305' }
        ],
        4: [
          { id: 1, name: 'Structural Mechanics', code: 'CE401' },
          { id: 2, name: 'Soil Mechanics', code: 'CE402' },
          { id: 3, name: 'Highway Engineering', code: 'CE403' },
          { id: 4, name: 'Water Supply Engineering', code: 'CE404' },
          { id: 5, name: 'RCC Design', code: 'CE405' }
        ],
        5: [
          { id: 1, name: 'Steel Structure Design', code: 'CE501' },
          { id: 2, name: 'Irrigation Engineering', code: 'CE502' },
          { id: 3, name: 'Quantity Surveying', code: 'CE503' },
          { id: 4, name: 'Construction Management', code: 'CE504' },
          { id: 5, name: 'Transportation Engineering', code: 'CE505' }
        ],
        6: [
          { id: 1, name: 'Project Work', code: 'CE601' },
          { id: 2, name: 'Industrial Training', code: 'CE602' },
          { id: 3, name: 'Estimating & Costing', code: 'CE603' },
          { id: 4, name: 'Building Planning & Drawing', code: 'CE604' }
        ]
      },
      mech: {
        1: [
          { id: 1, name: 'Applied Mathematics-I', code: 'MA101' },
          { id: 2, name: 'Applied Physics', code: 'PH101' },
          { id: 3, name: 'Applied Chemistry', code: 'CH101' },
          { id: 4, name: 'Engineering Drawing', code: 'ME101' },
          { id: 5, name: 'Workshop Practice', code: 'WS101' }
        ],
        2: [
          { id: 1, name: 'Applied Mathematics-II', code: 'MA102' },
          { id: 2, name: 'Engineering Mechanics', code: 'ME201' },
          { id: 3, name: 'Material Science', code: 'ME202' },
          { id: 4, name: 'Manufacturing Processes', code: 'ME203' },
          { id: 5, name: 'Computer Applications', code: 'CS101' }
        ],
        3: [
          { id: 1, name: 'Strength of Materials', code: 'ME301' },
          { id: 2, name: 'Thermodynamics', code: 'ME302' },
          { id: 3, name: 'Machine Drawing', code: 'ME303' },
          { id: 4, name: 'Production Technology', code: 'ME304' },
          { id: 5, name: 'Fluid Mechanics', code: 'ME305' }
        ],
        4: [
          { id: 1, name: 'Theory of Machines', code: 'ME401' },
          { id: 2, name: 'Thermal Engineering', code: 'ME402' },
          { id: 3, name: 'Machine Design', code: 'ME403' },
          { id: 4, name: 'Manufacturing Technology', code: 'ME404' },
          { id: 5, name: 'Metrology & Measurements', code: 'ME405' }
        ],
        5: [
          { id: 1, name: 'Power Plant Engineering', code: 'ME501' },
          { id: 2, name: 'Automobile Engineering', code: 'ME502' },
          { id: 3, name: 'Refrigeration & Air Conditioning', code: 'ME503' },
          { id: 4, name: 'Industrial Engineering', code: 'ME504' },
          { id: 5, name: 'CNC Machines', code: 'ME505' }
        ],
        6: [
          { id: 1, name: 'Project Work', code: 'ME601' },
          { id: 2, name: 'Industrial Training', code: 'ME602' },
          { id: 3, name: 'Maintenance Engineering', code: 'ME603' },
          { id: 4, name: 'Hydraulics & Pneumatics', code: 'ME604' }
        ]
      },
      ee: {
        1: [
          { id: 1, name: 'Applied Mathematics-I', code: 'MA101' },
          { id: 2, name: 'Applied Physics', code: 'PH101' },
          { id: 3, name: 'Applied Chemistry', code: 'CH101' },
          { id: 4, name: 'Engineering Drawing', code: 'EE101' },
          { id: 5, name: 'Workshop Practice', code: 'WS101' }
        ],
        2: [
          { id: 1, name: 'Applied Mathematics-II', code: 'MA102' },
          { id: 2, name: 'Basic Electronics', code: 'EE201' },
          { id: 3, name: 'Electrical Circuits', code: 'EE202' },
          { id: 4, name: 'Electrical Measurements', code: 'EE203' },
          { id: 5, name: 'Computer Applications', code: 'CS101' }
        ],
        3: [
          { id: 1, name: 'Electrical Machines-I', code: 'EE301' },
          { id: 2, name: 'Network Analysis', code: 'EE302' },
          { id: 3, name: 'Electronic Devices', code: 'EE303' },
          { id: 4, name: 'Electrical Engineering Materials', code: 'EE304' },
          { id: 5, name: 'Electrical Drawing', code: 'EE305' }
        ],
        4: [
          { id: 1, name: 'Electrical Machines-II', code: 'EE401' },
          { id: 2, name: 'Power Systems-I', code: 'EE402' },
          { id: 3, name: 'Analog Electronics', code: 'EE403' },
          { id: 4, name: 'Control Systems', code: 'EE404' },
          { id: 5, name: 'Electrical Installation & Maintenance', code: 'EE405' }
        ],
        5: [
          { id: 1, name: 'Power Systems-II', code: 'EE501' },
          { id: 2, name: 'Power Electronics', code: 'EE502' },
          { id: 3, name: 'Digital Electronics', code: 'EE503' },
          { id: 4, name: 'Microprocessors', code: 'EE504' },
          { id: 5, name: 'Electrical Drives', code: 'EE505' }
        ],
        6: [
          { id: 1, name: 'Project Work', code: 'EE601' },
          { id: 2, name: 'Industrial Training', code: 'EE602' },
          { id: 3, name: 'Industrial Electronics', code: 'EE603' },
          { id: 4, name: 'Utilization of Electrical Energy', code: 'EE604' }
        ]
      },
      cse: {
        1: [
          { id: 1, name: 'Applied Mathematics-I', code: 'MA101' },
          { id: 2, name: 'Applied Physics', code: 'PH101' },
          { id: 3, name: 'Programming in C', code: 'CS101' },
          { id: 4, name: 'Digital Electronics', code: 'EC101' },
          { id: 5, name: 'Communication Skills', code: 'EN101' }
        ],
        2: [
          { id: 1, name: 'Applied Mathematics-II', code: 'MA102' },
          { id: 2, name: 'Data Structures', code: 'CS201' },
          { id: 3, name: 'Computer Organization', code: 'CS202' },
          { id: 4, name: 'Web Technologies', code: 'CS203' },
          { id: 5, name: 'Database Management Systems', code: 'CS204' }
        ],
        3: [
          { id: 1, name: 'Object Oriented Programming', code: 'CS301' },
          { id: 2, name: 'Operating Systems', code: 'CS302' },
          { id: 3, name: 'Computer Networks', code: 'CS303' },
          { id: 4, name: 'Software Engineering', code: 'CS304' },
          { id: 5, name: 'Microprocessors', code: 'CS305' }
        ],
        4: [
          { id: 1, name: 'Java Programming', code: 'CS401' },
          { id: 2, name: 'System Programming', code: 'CS402' },
          { id: 3, name: 'Computer Graphics', code: 'CS403' },
          { id: 4, name: 'Mobile Application Development', code: 'CS404' },
          { id: 5, name: 'Python Programming', code: 'CS405' }
        ],
        5: [
          { id: 1, name: 'Artificial Intelligence', code: 'CS501' },
          { id: 2, name: 'Cloud Computing', code: 'CS502' },
          { id: 3, name: 'Information Security', code: 'CS503' },
          { id: 4, name: 'Internet of Things', code: 'CS504' },
          { id: 5, name: 'Machine Learning Basics', code: 'CS505' }
        ],
        6: [
          { id: 1, name: 'Project Work', code: 'CS601' },
          { id: 2, name: 'Industrial Training', code: 'CS602' },
          { id: 3, name: 'Web Development Project', code: 'CS603' },
          { id: 4, name: 'Cyber Security Fundamentals', code: 'CS604' }
        ]
      }
    }
  };

  // Dummy syllabus content for each subject
  const dummySyllabusContent = {
    default: `
      <strong>Unit 1: Introduction</strong><br/>
      - Fundamental concepts and definitions<br/>
      - Historical background and evolution<br/>
      - Basic principles and applications<br/>
      - Industry standards and practices<br/><br/>
      
      <strong>Unit 2: Core Concepts</strong><br/>
      - Detailed theoretical framework<br/>
      - Mathematical foundations<br/>
      - Analytical methods and techniques<br/>
      - Problem-solving approaches<br/><br/>
      
      <strong>Unit 3: Advanced Topics</strong><br/>
      - Complex problem analysis<br/>
      - Modern applications and tools<br/>
      - Case studies and real-world examples<br/>
      - Research methodologies<br/><br/>
      
      <strong>Unit 4: Practical Applications</strong><br/>
      - Laboratory experiments and demonstrations<br/>
      - Design projects and implementations<br/>
      - Industry best practices<br/>
      - Professional skills development<br/><br/>
      
      <strong>Unit 5: Current Trends</strong><br/>
      - Latest developments in the field<br/>
      - Emerging technologies and innovations<br/>
      - Future scope and career opportunities<br/>
      - Interdisciplinary applications
    `
  };

  const handleProgramSelect = (program) => {
    setSelectedProgram(program);
    setSelectedBranch(null);
    setSelectedSemester(null);
    setExpandedSubject(null);
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setSelectedSemester(null);
    setExpandedSubject(null);
  };

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
    setExpandedSubject(null);
  };

  const handleSubjectToggle = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
  };

  const handleReset = () => {
    setSelectedProgram(null);
    setSelectedBranch(null);
    setSelectedSemester(null);
    setExpandedSubject(null);
  };

  if (!isAuthenticated) {
    return (
      <div className='pt-20 h-screen bg-green-50'>
        <div className='md:max-w-[90%] h-full xl:max-w-[80%] mx-auto flex items-center justify-center'>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-4 text-4xl font-bold text-gray-900 sm:text-5xl">
              Please Login First
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              You need to be logged in to view the syllabus.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const maxSemesters = selectedProgram === 'btech' ? 8 : 6;
  const subjects = selectedProgram && selectedBranch && selectedSemester
    ? syllabusData[selectedProgram][selectedBranch][selectedSemester]
    : [];

  return (
    <div className='pt-16 min-h-screen bg-green-50'>
      <div className='md:max-w-[90%] xl:max-w-[80%] mx-auto px-4 md:px-0 py-8'>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <FaGraduationCap className="text-4xl text-green-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-green-600">Syllabus</h1>
          </div>
          {selectedProgram && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Reset Selection
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
          
          {/* Step 1: Program Selection (BTech/Diploma) */}
          {!selectedProgram && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Program</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleProgramSelect('btech')}
                  className="p-6 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <div className="text-2xl font-bold mb-2">B.Tech</div>
                  <div className="text-sm opacity-90">Bachelor of Technology (8 Semesters)</div>
                </button>
                <button
                  onClick={() => handleProgramSelect('diploma')}
                  className="p-6 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <div className="text-2xl font-bold mb-2">Diploma</div>
                  <div className="text-sm opacity-90">Diploma in Engineering (6 Semesters)</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Branch Selection */}
          {selectedProgram && !selectedBranch && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Select Branch - {selectedProgram === 'btech' ? 'B.Tech' : 'Diploma'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {branches[selectedProgram].map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => handleBranchSelect(branch.id)}
                    className="p-6 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <div className="text-xl font-bold mb-2">{branch.code}</div>
                    <div className="text-sm opacity-90">{branch.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Semester Selection */}
          {selectedProgram && selectedBranch && !selectedSemester && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Select Semester - {branches[selectedProgram].find(b => b.id === selectedBranch)?.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {Array.from({ length: maxSemesters }, (_, i) => i + 1).map((sem) => (
                  <button
                    key={sem}
                    onClick={() => handleSemesterSelect(sem)}
                    className="p-4 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg font-bold text-lg"
                  >
                    Sem {sem}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Subject List with Expandable Syllabus */}
          {selectedProgram && selectedBranch && selectedSemester && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Semester {selectedSemester} - {branches[selectedProgram].find(b => b.id === selectedBranch)?.name}
              </h2>
              <div className="space-y-3">
                {subjects.map((subject) => (
                  <div key={subject.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleSubjectToggle(subject.id)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center text-left"
                    >
                      <div>
                        <div className="font-bold text-gray-800">{subject.name}</div>
                        <div className="text-sm text-gray-600">Code: {subject.code}</div>
                      </div>
                      <div className="text-green-600">
                        {expandedSubject === subject.id ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </button>
                    
                    {/* Collapsible Syllabus Content */}
                    {expandedSubject === subject.id && (
                      <div className="p-6 bg-white border-t border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Syllabus Content</h3>
                        <div 
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: dummySyllabusContent.default }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 mb-2">📝 Note:</h3>
          <p className="text-blue-700 text-sm">
            This is a template syllabus structure. You can manually edit the subject names, codes, 
            and syllabus content directly in the component file to match your institution's curriculum.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Syllabus;
