import React, { useState } from 'react';
import { 
  User, Settings, Bell, Heart, History, LogOut, Edit, 
  Check, X, ChevronRight, Film, Play, Trash2, Eye, Clock,
  Moon, Sun, Monitor, Save, Star
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { 
    user, 
    logout, 
    updateProfile, 
    removeFromWatchlist, 
    removeFromWatchHistory, 
    clearWatchHistory, 
    toggleServiceConnection,
    updatePreferences
  } = useUser();

  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState<'account' | 'notifications' | 'watchlist' | 'history' | 'preferences' | null>(null);
  
  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  
  // Handle profile update
  const handleProfileUpdate = () => {
    updateProfile({
      name,
      email,
      bio
    });
    setEditMode(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate progress percentage
  const getProgressPercentage = (progress: number) => {
    return `${Math.min(Math.round(progress * 100), 100)}%`;
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-lg mb-4">Please log in to view your profile</p>
        <button 
          className="px-6 py-3 bg-red-600 text-white rounded-full"
          onClick={() => navigate('/')}
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className={`w-20 h-20 rounded-full ${editMode ? 'bg-blue-100 dark:bg-blue-900' : 'bg-red-100 dark:bg-red-900'} flex items-center justify-center relative group`}>
              <User className={`w-10 h-10 ${editMode ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`} />
              {editMode && (
                <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div>
              {editMode ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xl font-bold bg-gray-100 dark:bg-dark-hover px-3 py-1 rounded-lg mb-2 w-full"
                />
              ) : (
                <h1 className="text-xl font-bold dark:text-dark-text-primary">{user.name}</h1>
              )}
              
              {editMode ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm bg-gray-100 dark:bg-dark-hover px-3 py-1 rounded-lg w-full"
                />
              ) : (
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary">{user.email}</p>
              )}
              
              {editMode && (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="mt-2 text-sm bg-gray-100 dark:bg-dark-hover px-3 py-1 rounded-lg w-full h-20 resize-none"
                />
              )}
            </div>
          </div>
          
          <div>
            {editMode ? (
              <div className="flex space-x-2">
                <button 
                  onClick={handleProfileUpdate}
                  className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full hover:bg-green-200 dark:hover:bg-green-800"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setEditMode(false)}
                  className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setEditMode(true)}
                className="p-2 bg-gray-100 dark:bg-dark-hover text-gray-600 dark:text-dark-text-secondary rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        {!editMode && user.bio && (
          <p className="mt-4 text-gray-700 dark:text-dark-text-secondary text-sm">{user.bio}</p>
        )}
      </div>

      {/* Settings Menu */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm overflow-hidden">
        <button 
          onClick={() => setActiveSection(activeSection === 'account' ? null : 'account')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-hover border-b border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center space-x-3">
            <Settings className="w-5 h-5 text-gray-600 dark:text-dark-text-secondary" />
            <span className="text-gray-700 dark:text-dark-text-primary">Account Settings</span>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === 'account' ? 'rotate-90' : ''}`} />
        </button>
        
        {activeSection === 'account' && (
          <div className="p-4 bg-gray-50 dark:bg-dark-hover border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold mb-3 dark:text-dark-text-primary">Account Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Member since</span>
                <span className="text-sm font-medium dark:text-dark-text-primary">January 2023</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Subscription</span>
                <span className="text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">Premium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Renewal Date</span>
                <span className="text-sm font-medium dark:text-dark-text-primary">Dec 31, 2023</span>
              </div>
              <button className="w-full mt-2 py-2 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50">
                Manage Subscription
              </button>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setActiveSection(activeSection === 'preferences' ? null : 'preferences')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-hover border-b border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-gray-600 dark:text-dark-text-secondary" />
            <span className="text-gray-700 dark:text-dark-text-primary">Preferences</span>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === 'preferences' ? 'rotate-90' : ''}`} />
        </button>
        
        {activeSection === 'preferences' && (
          <div className="p-4 bg-gray-50 dark:bg-dark-hover border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold mb-3 dark:text-dark-text-primary">Streaming Preferences</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={user.preferences.notifications} 
                    onChange={(e) => updatePreferences({ notifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Autoplay videos</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={user.preferences.autoplay} 
                    onChange={(e) => updatePreferences({ autoplay: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Subtitles</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={user.preferences.subtitles} 
                    onChange={(e) => updatePreferences({ subtitles: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Video Quality</span>
                <select 
                  value={user.preferences.quality}
                  onChange={(e) => updatePreferences({ quality: e.target.value as any })}
                  className="w-full p-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                >
                  <option value="auto">Auto</option>
                  <option value="low">Low (Data Saver)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="4k">4K Ultra HD</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Language</span>
                <select 
                  value={user.preferences.language}
                  onChange={(e) => updatePreferences({ language: e.target.value })}
                  className="w-full p-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                >
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Spanish</option>
                  <option value="fr-FR">French</option>
                  <option value="de-DE">German</option>
                  <option value="ja-JP">Japanese</option>
                </select>
              </div>
              
              <button className="w-full py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50">
                Save Preferences
              </button>
            </div>
          </div>
        )}
        
        <button 
          onClick={() => setActiveSection(activeSection === 'watchlist' ? null : 'watchlist')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-hover border-b border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center space-x-3">
            <Heart className="w-5 h-5 text-gray-600 dark:text-dark-text-secondary" />
            <span className="text-gray-700 dark:text-dark-text-primary">Watchlist</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full mr-2">
              {user.watchlist.length}
            </span>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === 'watchlist' ? 'rotate-90' : ''}`} />
          </div>
        </button>
        
        {activeSection === 'watchlist' && (
          <div className="p-4 bg-gray-50 dark:bg-dark-hover border-b border-gray-100 dark:border-gray-800">
            {user.watchlist.length > 0 ? (
              <div className="space-y-3">
                {user.watchlist.map(movie => (
                  <div key={movie.id} className="flex items-center justify-between bg-white dark:bg-dark-card p-2 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="w-12 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-sm dark:text-dark-text-primary">{movie.title}</h4>
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-500 dark:text-dark-text-secondary ml-1">{movie.vote_average.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="p-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      <button 
                        onClick={() => removeFromWatchlist(movie.id)}
                        className="p-1.5 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-center">Your watchlist is empty</p>
                <button 
                  onClick={() => navigate('/movies')}
                  className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  Browse Movies
                </button>
              </div>
            )}
          </div>
        )}
        
        <button 
          onClick={() => setActiveSection(activeSection === 'history' ? null : 'history')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-hover"
        >
          <div className="flex items-center space-x-3">
            <History className="w-5 h-5 text-gray-600 dark:text-dark-text-secondary" />
            <span className="text-gray-700 dark:text-dark-text-primary">Watch History</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full mr-2">
              {user.watchHistory.length}
            </span>
            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === 'history' ? 'rotate-90' : ''}`} />
          </div>
        </button>
        
        {activeSection === 'history' && (
          <div className="p-4 bg-gray-50 dark:bg-dark-hover">
            {user.watchHistory.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold dark:text-dark-text-primary">Recently Watched</h3>
                  <button 
                    onClick={clearWatchHistory}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline"
                  >
                    Clear History
                  </button>
                </div>
                
                {user.watchHistory.map(item => (
                  <div key={item.movie.id} className="flex items-center justify-between bg-white dark:bg-dark-card p-2 rounded-lg shadow-sm">
                    <div className="flex items-center flex-grow">
                      <div className="w-12 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${item.movie.poster_path}`} 
                          alt={item.movie.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <h4 className="font-medium text-sm dark:text-dark-text-primary">{item.movie.title}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500 dark:text-dark-text-secondary">{formatDate(item.timestamp)}</span>
                        </div>
                        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-red-500 dark:bg-red-600 rounded-full"
                            style={{ width: getProgressPercentage(item.progress) }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-2">
                      <button 
                        onClick={() => navigate(`/movie/${item.movie.id}`)}
                        className="p-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                      <button 
                        onClick={() => removeFromWatchHistory(item.movie.id)}
                        className="p-1.5 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full hover:bg-red-200 dark:hover:bg-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <Clock className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 text-center">No watch history yet</p>
                <button 
                  onClick={() => navigate('/movies')}
                  className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/50"
                >
                  Browse Movies
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Streaming Services */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 dark:text-dark-text-primary">Connected Services</h2>
        <div className="space-y-4">
          {user.connectedServices.map(service => (
            <div key={service.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded ${service.connected ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'} flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${service.connected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {service.icon}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700 dark:text-dark-text-primary">{service.name}</span>
                  {service.connected && service.subscription && (
                    <p className="text-xs text-gray-500 dark:text-dark-text-secondary">{service.subscription}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => toggleServiceConnection(service.id)}
                className={`text-sm px-3 py-1 rounded ${
                  service.connected 
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {service.connected ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))}
          <button className="w-full py-2 text-sm mt-2 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-hover">
            + Add Service
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center space-x-2 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span>Log Out</span>
      </button>
    </div>
  );
};

export default Profile; 