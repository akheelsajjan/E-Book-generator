import React from 'react';
import BasePageLayout from './BasePageLayout';

const AuthorPage = ({ bookData }) => {
  if (!bookData?.author) return null;

  const { author } = bookData;

  return (
    <BasePageLayout>
      <div className="h-full flex flex-col">
        {/* Author Title - Centered, Large, Bold */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 tracking-wide">About the Author</h1>
          <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
        </div>

        {/* Author Content */}
        <div className="flex-1 grid md:grid-cols-3 gap-8">
          {/* Author Info */}
          <div className="md:col-span-1">
            <div className="text-center">
              {/* Author Avatar Placeholder */}
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {author.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">{author.name}</h2>
              <p className="text-lg text-gray-600 mb-4">{author.title}</p>
              
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">{author.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Author Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Biography */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Biography</h3>
              <p className="text-lg leading-relaxed text-gray-700" style={{ textIndent: '0' }}>
                {author.bio}
              </p>
            </div>

            {/* Credentials */}
            {author.credentials && author.credentials.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Credentials</h3>
                <ul className="space-y-2">
                  {author.credentials.map((credential, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{credential}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements */}
            {author.achievements && author.achievements.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Achievements</h3>
                <ul className="space-y-2">
                  {author.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </BasePageLayout>
  );
};

export default AuthorPage; 