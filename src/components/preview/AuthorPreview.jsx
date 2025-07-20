import React from 'react';

const AuthorPreview = ({ author, template }) => {
  if (!author) {
    return (
      <div className="author-preview">
        <h1 className="text-xl font-bold text-center mb-6">About the Author</h1>
        <p className="text-center">No author information available.</p>
      </div>
    );
  }

  return (
    <div className="author-preview">
      {/* Title */}
      <h1 className="text-xl font-bold text-center mb-8">About the Author</h1>
      
      <div className="author-content">
        {/* Author Name and Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">{author.name}</h2>
          {author.title && (
            <p className="text-lg text-gray-600 italic">{author.title}</p>
          )}
        </div>
        
        {/* Author Photo (if available) */}
        {author.photo && (
          <div className="flex justify-center mb-6">
            <img 
              src={author.photo} 
              alt={author.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
            />
          </div>
        )}
        
        {/* Bio */}
        {author.bio && (
          <div className="mb-6">
            <p className="text-justify leading-relaxed">
              {author.bio}
            </p>
          </div>
        )}
        
        {/* Credentials */}
        {author.credentials && author.credentials.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Credentials</h3>
            <ul className="list-disc list-inside space-y-1">
              {author.credentials.map((credential, index) => (
                <li key={index} className="text-gray-700">{credential}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Achievements */}
        {author.achievements && author.achievements.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Achievements</h3>
            <ul className="list-disc list-inside space-y-1">
              {author.achievements.map((achievement, index) => (
                <li key={index} className="text-gray-700">{achievement}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Contact Information */}
        {author.email && (
          <div className="text-center text-sm text-gray-600">
            <p>Contact: {author.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPreview; 