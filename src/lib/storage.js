export const ProjectDB = {
  list() {
    const data = localStorage.getItem('ai_engineer_projects');
    if (!data) return [];
    try {
      const projects = JSON.parse(data);
      return projects.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
    } catch (e) {
      return [];
    }
  },

  create(data) {
    const projects = this.list();
    const newProject = {
      id: crypto.randomUUID(),
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
      status: 'planning',
      tasks: [],
      memory_log: [],
      total_iterations: 0,
      final_code: '',
      ...data
    };
    projects.push(newProject);
    localStorage.setItem('ai_engineer_projects', JSON.stringify(projects));
    return newProject;
  },

  update(id, data) {
    const projects = this.list();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        ...data,
        updated_date: new Date().toISOString()
      };
      localStorage.setItem('ai_engineer_projects', JSON.stringify(projects));
      return projects[index];
    }
    return null;
  },

  delete(id) {
    const projects = this.list();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem('ai_engineer_projects', JSON.stringify(filtered));
  },
  
  get(id) {
    const projects = this.list();
    return projects.find(p => p.id === id) || null;
  }
};
