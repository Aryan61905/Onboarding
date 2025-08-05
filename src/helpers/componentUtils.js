export const getAssignedComponents = (page) => {
    const savedAssignments = localStorage.getItem('componentAssignments');
    const defaultAssignments = {
      page1: ['AboutMe', 'Address'],
      page2: ['BirthDate']
    };
    const assignments = savedAssignments ? JSON.parse(savedAssignments) : defaultAssignments;
    return assignments[page] || [];
  };
  
  export const getComponentAssignment = (component) => {
    const savedAssignments = localStorage.getItem('componentAssignments');
    const defaultAssignments = {
      page1: ['AboutMe', 'Address'],
      page2: ['BirthDate']
    };
    const assignments = savedAssignments ? JSON.parse(savedAssignments) : defaultAssignments;
    
    for (const page in assignments) {
      if (assignments[page].includes(component)) {
        return page;
      }
    }
    return null;
  };