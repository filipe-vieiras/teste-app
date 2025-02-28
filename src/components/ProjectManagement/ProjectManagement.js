import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { toast } from 'react-toastify';

function ProjectManagement({ darkMode }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    status: 'planning',
    deadline: '',
    priority: 'medium'
  });
  const [editingProject, setEditingProject] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchTeamMembers();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_members(*, team_members(*))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamMemberSelection = (memberId) => {
    setSelectedTeamMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newProject.name) {
      setError('Project name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to create a project');
        return;
      }
      
      // Create the project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([{
          name: newProject.name,
          description: newProject.description,
          status: newProject.status,
          deadline: newProject.deadline || null,
          priority: newProject.priority,
          created_by: user.id,
          created_at: new Date().toISOString()
        }])
        .select();

      if (projectError) throw projectError;
      
      // Add team members to the project
      if (selectedTeamMembers.length > 0 && projectData && projectData[0]) {
        const projectMembersToInsert = selectedTeamMembers.map(memberId => ({
          project_id: projectData[0].id,
          team_member_id: memberId,
          added_by: user.id,
          created_at: new Date().toISOString()
        }));
        
        const { error: memberError } = await supabase
          .from('project_members')
          .insert(projectMembersToInsert);

        if (memberError) {
          console.error('Error adding team members to project:', memberError);
          toast.error('Project created but failed to add team members');
        }
      }
      
      // Reset form and refresh list
      setNewProject({
        name: '',
        description: '',
        status: 'planning',
        deadline: '',
        priority: 'medium'
      });
      setSelectedTeamMembers([]);
      fetchProjects();
      toast.success('Project created successfully');
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project.id);
    setNewProject({
      name: project.name,
      description: project.description,
      status: project.status,
      deadline: project.deadline || '',
      priority: project.priority
    });
    
    // Set selected team members
    if (project.project_members) {
      const memberIds = project.project_members.map(pm => pm.team_member_id);
      setSelectedTeamMembers(memberIds);
    } else {
      setSelectedTeamMembers([]);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    
    if (!newProject.name) {
      setError('Project name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('You must be logged in to update a project');
        return;
      }
      
      // Update the project
      const { error: projectError } = await supabase
        .from('projects')
        .update({
          name: newProject.name,
          description: newProject.description,
          status: newProject.status,
          deadline: newProject.deadline || null,
          priority: newProject.priority,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProject);

      if (projectError) throw projectError;
      
      // Remove existing team members
      const { error: deleteError } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', editingProject);

      if (deleteError) throw deleteError;
      
      // Add updated team members to the project
      if (selectedTeamMembers.length > 0) {
        const projectMembersToInsert = selectedTeamMembers.map(memberId => ({
          project_id: editingProject,
          team_member_id: memberId,
          added_by: user.id,
          created_at: new Date().toISOString()
        }));
        
        const { error: memberError } = await supabase
          .from('project_members')
          .insert(projectMembersToInsert);

        if (memberError) {
          console.error('Error updating team members:', memberError);
          toast.error('Project updated but failed to update team members');
        }
      }
      
      // Reset form and refresh list
      setNewProject({
        name: '',
        description: '',
        status: 'planning',
        deadline: '',
        priority: 'medium'
      });
      setSelectedTeamMembers([]);
      setEditingProject(null);
      fetchProjects();
      toast.success('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      setLoading(true);
      
      // Delete project members first (foreign key constraint)
      const { error: memberError } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', id);

      if (memberError) throw memberError;
      
      // Then delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchProjects();
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'planning':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'in-progress':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'on-hold':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return baseClasses;
    }
  };

  const getPriorityBadgeClass = (priority) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg`}>
      <h2 className="text-2xl font-bold mb-6">Project Management</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Project Form */}
      <div className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className="text-lg font-semibold mb-4">
          {editingProject ? 'Edit Project' : 'Create New Project'}
        </h3>
        
        <form onSubmit={editingProject ? handleUpdateProject : handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Name</label>
              <input
                type="text"
                name="name"
                value={newProject.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md text-gray-800"
                placeholder="Project Name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Deadline (optional)</label>
              <input
                type="date"
                name="deadline"
                value={newProject.deadline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md text-gray-800"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={newProject.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md text-gray-800"
              placeholder="Project description..."
              rows="3"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={newProject.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md text-gray-800"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={newProject.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md text-gray-800"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Team Members</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {teamMembers.map(member => (
                <div key={member.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    checked={selectedTeamMembers.includes(member.id)}
                    onChange={() => handleTeamMemberSelection(member.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`member-${member.id}`} className="text-sm">
                    {member.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {editingProject ? (loading ? 'Updating...' : 'Update Project') : (loading ? 'Creating...' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
      
      {/* Projects List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Projects</h3>
        
        {loading && projects.length === 0 ? (
          <div className="text-center py-4">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-4">No projects found. Create your first project above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Team</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{project.name}</span>
                        <span className="text-sm text-gray-500">{project.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadgeClass(project.status)}>
                        {project.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getPriorityBadgeClass(project.priority)}>
                        {project.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.project_members?.map((pm) => (
                          <span
                            key={pm.team_member.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {pm.team_member.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectManagement;