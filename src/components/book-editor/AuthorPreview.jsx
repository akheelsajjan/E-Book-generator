import React from 'react';

const AuthorPreview = ({ book, activeTab = 'author', currentAuthorData = null }) => {
  // Only show preview for author tab
  if (activeTab !== 'author') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">👤</div>
          <p>Preview will appear here</p>
          <p className="text-sm mt-2">Select a tab to see the preview</p>
        </div>
      </div>
    );
  }

  // Use current author data if provided (for live preview), otherwise use book.author
  const authorData = currentAuthorData || book?.author || {};
  const name = authorData.name || 'Unknown Author';
  const title = authorData.title || '';
  const bio = authorData.bio || '';
  const credentials = authorData.credentials || [];
  const achievements = authorData.achievements || [];
  const social = authorData.social || {};

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center">
      {/* Author Page Container - Using same dimensions as PagePreview */}
      <div 
        className="w-[600px] h-[800px] rounded-lg shadow-2xl overflow-hidden relative"
        style={{
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 1px 8px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
          overflow: 'hidden',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      >
        {/* Page Content */}
        <div className="h-full p-12 flex flex-col" style={{
          background: 'linear-gradient(to right, #fafafa 0%, #ffffff 5%, #ffffff 95%, #fafafa 100%)',
          padding: '40px',
          maxWidth: '100%',
          overflow: 'hidden'
        }}>
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              About the Author
            </h1>
          </div>

          {/* Author Content */}
          <div className="flex-1" style={{ 
            marginTop: '1em', 
            marginBottom: '1em',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <div 
              className="text-gray-800 leading-relaxed"
              style={{ 
                fontSize: '16px',
                lineHeight: '1.6',
                fontFamily: 'Georgia, serif',
                textAlign: 'left',
                wordSpacing: '0.05em',
                letterSpacing: '0.01em',
                maxWidth: '100%',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              }}
            >
              {/* Author Name */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {name}
                </h2>
                {title && (
                  <p className="text-lg text-gray-600 italic mb-4">
                    {title}
                  </p>
                )}
              </div>

              {/* Author Bio */}
              {bio && (
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {bio}
                  </p>
                </div>
              )}

              {/* Credentials */}
              {credentials.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Credentials
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {credentials.map((credential, index) => (
                      <li key={index} className="text-gray-700">
                        {credential}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Achievements */}
              {achievements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Achievements
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-700">
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Social Links */}
              {(social.website || social.twitter || social.linkedin || social.email) && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Connect
                  </h3>
                  <div className="space-y-2">
                    {social.website && (
                      <p className="text-gray-700">
                        <span className="font-medium">Website:</span> {social.website}
                      </p>
                    )}
                    {social.twitter && (
                      <p className="text-gray-700">
                        <span className="font-medium">Twitter:</span> {social.twitter}
                      </p>
                    )}
                    {social.linkedin && (
                      <p className="text-gray-700">
                        <span className="font-medium">LinkedIn:</span> {social.linkedin}
                      </p>
                    )}
                    {social.email && (
                      <p className="text-gray-700">
                        <span className="font-medium">Email:</span> {social.email}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorPreview; 