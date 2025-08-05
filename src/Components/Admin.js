import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [pageComponents, setPageComponents] = useState({
    page1: ['AboutMe', 'Address'],
    page2: ['BirthDate']
  });

  const allComponents = ['AboutMe', 'Address', 'BirthDate'];
  const allPages = ['page1', 'page2'];

  
  useEffect(() => {
    const savedAssignments = localStorage.getItem('componentAssignments');
    if (savedAssignments) {
      setPageComponents(JSON.parse(savedAssignments));
    }
  }, []);

  const moveComponent = (component, fromPage, toPage) => {
    setPageComponents(prev => {
      const newAssignments = { ...prev };
      
   
      if (fromPage) {
        newAssignments[fromPage] = newAssignments[fromPage].filter(c => c !== component);
      }
      
     
      if (toPage) {
        newAssignments[toPage] = [...(newAssignments[toPage] || []), component];
      }
      
      return newAssignments;
    });
  };

  const handleSave = () => {
    
    if (Object.values(pageComponents).some(components => components.length === 0)) {
      alert('Each page must have at least one component!');
      return;
    }
    

    const assignedComponents = Object.values(pageComponents).flat();
    if (assignedComponents.length !== allComponents.length) {
      alert('All components must be assigned to a page!');
      return;
    }

    localStorage.setItem('componentAssignments', JSON.stringify(pageComponents));
    alert('Assignments saved successfully!');
    navigate('/');
  };

  return (
    <div className="admin-container">
      <h1>Component Management</h1>
      <p>Assign components to pages (all components must be assigned)</p>
      
      <div className="pages-grid">
        {allPages.map(page => (
          <div key={page} className="page-column">
            <h2>{page.toUpperCase()}</h2>
            <div className="components-list">
              {pageComponents[page]?.map(component => (
                <div key={component} className="component-item">
                  {component}
                  <div className="component-actions">
                    {allPages.filter(p => p !== page).map(otherPage => (
                      <button
                        key={`move-${component}-to-${otherPage}`}
                        onClick={() => moveComponent(component, page, otherPage)}
                        className="move-button"
                        title={`Move to ${otherPage}`}
                      >
                        ➡ {otherPage}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="unassigned-section">
        <h3>Unassigned Components</h3>
        <div className="components-list">
          {allComponents
            .filter(component => !Object.values(pageComponents).flat().includes(component))
            .map(component => (
              <div key={component} className="component-item unassigned">
                {component}
                <div className="component-actions">
                  {allPages.map(page => (
                    <button
                      key={`assign-${component}-to-${page}`}
                      onClick={() => moveComponent(component, null, page)}
                      className="assign-button"
                    >
                      Assign to {page}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <button onClick={handleSave} className="save-button">
        Save Assignments
      </button>
    </div>
  );
};

export default Admin;