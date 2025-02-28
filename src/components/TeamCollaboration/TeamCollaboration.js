import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { toast } from 'react-toastify';

function TeamCollaboration({ darkMode }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('editor'); // Novo estado para armazenar a função do usuário

  useEffect(() => {
    fetchTeamMembers();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get the user's role from the profiles table
        const { data: userData, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user role:', error);
          // Still set the current user even if we can't get their role
          setCurrentUser({
            ...user,
            role: 'member' // Default role
          });
          return;
        }
        
        // Combine auth user with role information
        setCurrentUser({
          ...user,
          role: userData?.role || 'member'
        });
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Don't set error state here to avoid blocking the UI
    }
  };

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to get authenticated users directly
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('You must be logged in to view team members');
        setLoading(false);
        return;
      }
      
      // Get users from the profiles table
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, role, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching from profiles table:', error);
        setError('Failed to load user information.');
        setLoading(false);
        return;
      }
      
      if (profiles && profiles.length > 0) {
        const formattedUsers = profiles.map(profile => ({
          id: profile.id,
          name: profile.email?.split('@')[0] || 'Unknown',
          email: profile.email,
          role: profile.role || 'member',
          created_at: profile.created_at
        }));

        setTeamMembers(formattedUsers);
      } else {
        // If no profiles found, try to get the current user at least
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Create a profile entry in the profiles table for the current user
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              { 
                id: user.id, 
                email: user.email,
                role: 'admin', // Make the first user an admin
                created_at: new Date().toISOString()
              }
            ]);
            
          if (insertError) {
            console.error('Error creating profile entry:', insertError);
          } else {
            // Fetch again after creating the profile
            const { data: newProfiles } = await supabase
              .from('profiles')
              .select('id, email, role, created_at')
              .order('created_at', { ascending: false });
              
            if (newProfiles && newProfiles.length > 0) {
              const formattedUsers = newProfiles.map(profile => ({
                id: profile.id,
                name: profile.email?.split('@')[0] || 'Unknown',
                email: profile.email,
                role: profile.role || 'member',
                created_at: profile.created_at
              }));
              
              setTeamMembers(formattedUsers);
            } else {
              // If still no profiles, just add the current user to the display
              setTeamMembers([{
                id: user.id,
                name: user.email?.split('@')[0] || 'Unknown',
                email: user.email,
                role: 'admin', // First user is admin
                created_at: new Date().toISOString()
              }]);
            }
          }
        } else {
          setTeamMembers([]);
        }
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      setError('Failed to load team members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      fetchTeamMembers();
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      setError('Failed to update role. Please try again.');
      toast.error('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validações permanecem as mesmas
      if (!newUserEmail.endsWith('@brokenmachines.com.br')) {
        setError('Only @brokenmachines.com.br emails are allowed');
        return;
      }
    
      // Verificação de usuário existente
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newUserEmail)
        .single();
    
      if (existingProfile) {
        setError('This email is already registered');
        return;
      }
    
      const tempPassword = Math.random().toString(36).slice(-12) + 
                          Math.random().toString(36).slice(-12);
    
      // Usar a URL completa e garantir que está formatada corretamente
      const redirectUrl = 'http://localhost:3000/setup-password';
    
      // Usar o método signUp com a URL de redirecionamento correta
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: tempPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: newUserRole,
            invited: true
          }
        }
      });
    
      if (signUpError) throw signUpError;
    
      // Resto da função permanece o mesmo
      if (data?.user) {
        setNewUserEmail('');
        setNewUserRole('editor');
        toast.success('User invited successfully. They will receive an email to confirm their account.');
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error inviting user:', error);
      setError(error.message || 'Failed to invite user. Please try again.');
      toast.error('Failed to invite user');
    } finally {
      setLoading(false);
    }
  };

  // The rest of the component remains the same
  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg`}>
      <h2 className="text-2xl font-bold mb-6">Team Members</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {currentUser?.role === 'admin' && (
        <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <h3 className="text-lg font-semibold mb-4">Invite New Team Member</h3>
          <form onSubmit={handleInviteUser} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="Email address"
                className="flex-1 px-4 py-2 rounded-md border text-gray-800"
                required
              />
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="px-4 py-2 rounded-md border text-gray-800"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Inviting...' : 'Invite User'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Team Members List */}
      <div>
        {loading && teamMembers.length === 0 ? (
          <div className="text-center py-4">Loading team members...</div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-4">No team members found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.id} className={darkMode ? 'bg-gray-800' : 'bg-white'}>
                    <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{member.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {currentUser?.id === member.id ? (
                        <span className="capitalize">{member.role}</span>
                      ) : (
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
                          disabled={loading || currentUser?.role !== 'admin'}
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="member">Member</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {currentUser?.role === 'admin' && currentUser?.id !== member.id && (
                        <button
                          onClick={() => handleRoleChange(member.id, 'inactive')}
                          className="text-red-500 hover:text-red-700"
                          disabled={loading}
                        >
                          Deactivate
                        </button>
                      )}
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

export default TeamCollaboration;