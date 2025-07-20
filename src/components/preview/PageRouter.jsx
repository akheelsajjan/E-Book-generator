import React from 'react';
import BookCoverPage from './BookCoverPage';
import TOCPage from './TOCPage';
import AuthorPage from './AuthorPage';
import PrefacePage from './PrefacePage';
import ChapterPage from './ChapterPage';
import PageContent from './PageContent';
import BasePageLayout from './BasePageLayout';

// Placeholder components for additional sections
const DedicationPage = ({ bookData }) => (
  <BasePageLayout>
    <div className="h-full flex flex-col">
      {/* Dedication Title - Centered, Large, Bold */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 tracking-wide">Dedication</h1>
        <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
      </div>
      
      {/* Dedication Content - Centered, Minimal */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <p className="text-lg leading-relaxed text-gray-700 mb-8 italic" style={{ textIndent: '0' }}>
            {bookData.dedication?.content}
          </p>
          <p className="text-sm text-gray-600">— {bookData.dedication?.author}</p>
        </div>
      </div>
    </div>
  </BasePageLayout>
);

const AcknowledgmentsPage = ({ bookData }) => (
  <BasePageLayout>
    <div className="h-full flex flex-col">
      {/* Acknowledgments Title - Centered, Large, Bold */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 tracking-wide">Acknowledgments</h1>
        <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
      </div>
      
      {/* Acknowledgments Content */}
      <div className="flex-1">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-gray-700" style={{ textIndent: '0' }}>
            {bookData.acknowledgments?.content}
          </p>
        </div>
      </div>
      
      {/* Author Signature */}
      <div className="mt-8 text-right">
        <p className="text-sm text-gray-600">— {bookData.acknowledgments?.author}</p>
      </div>
    </div>
  </BasePageLayout>
);

const ForewordPage = ({ bookData }) => (
  <BasePageLayout>
    <div className="h-full flex flex-col">
      {/* Foreword Title - Centered, Large, Bold */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 tracking-wide">Foreword</h1>
        <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
      </div>
      
      {/* Foreword Content */}
      <div className="flex-1">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-gray-700 mb-8" style={{ textIndent: '0' }}>
            {bookData.foreword?.content}
          </p>
        </div>
      </div>
      
      {/* Author Signature and Title */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <p className="text-sm font-semibold text-gray-900">{bookData.foreword?.author}</p>
        <p className="text-xs text-gray-600">{bookData.foreword?.title}</p>
      </div>
    </div>
  </BasePageLayout>
);

const IntroductionPage = ({ bookData }) => (
  <BasePageLayout>
    <div className="h-full flex flex-col">
      {/* Introduction Title - Centered, Large, Bold */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 tracking-wide">Introduction</h1>
        <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
      </div>
      
      {/* Introduction Content */}
      <div className="flex-1">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-gray-700" style={{ textIndent: '0' }}>
            {bookData.introduction?.content}
          </p>
        </div>
      </div>
    </div>
  </BasePageLayout>
);

const EpiloguePage = ({ bookData }) => (
  <BasePageLayout>
    <div className="h-full flex flex-col">
      {/* Epilogue Title - Centered, Large, Bold */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 tracking-wide">Epilogue</h1>
        <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
      </div>
      
      {/* Epilogue Content */}
      <div className="flex-1">
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-gray-700" style={{ textIndent: '0' }}>
            {bookData.epilogue?.content}
          </p>
        </div>
      </div>
    </div>
  </BasePageLayout>
);

const AppendixPage = ({ bookData }) => (
  <BasePageLayout>
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{bookData.appendix?.title || 'Appendix'}</h1>
        <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
      </div>
      <div className="flex-1 space-y-6">
        {bookData.appendix?.glossary && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Glossary</h3>
            <div className="space-y-3">
              {bookData.appendix.glossary.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-3">
                  <dt className="font-semibold text-gray-900">{item.term}</dt>
                  <dd className="text-gray-700 mt-1">{item.definition}</dd>
                </div>
              ))}
            </div>
          </div>
        )}
        {bookData.appendix?.references && (
          <div>
            <h3 className="text-xl font-semibold mb-4">References</h3>
            <ul className="space-y-2">
              {bookData.appendix.references.map((ref, index) => (
                <li key={index} className="text-gray-700">{ref}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </BasePageLayout>
);

const GlossaryPage = ({ bookData }) => (
  <BasePageLayout>
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">{bookData.glossary?.title || 'Glossary'}</h1>
        <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
      </div>
      <div className="flex-1 space-y-4">
        {bookData.glossary?.terms?.map((term, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <dt className="font-semibold text-gray-900 text-lg">{term.term}</dt>
            <dd className="text-gray-700 mt-2">{term.definition}</dd>
          </div>
        ))}
      </div>
    </div>
  </BasePageLayout>
);

const BibliographyPage = ({ bookData }) => (
  <BasePageLayout>
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Bibliography</h1>
        <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
      </div>
      <div className="flex-1">
        <p className="text-gray-500 text-center">Bibliography content will be displayed here.</p>
      </div>
    </div>
  </BasePageLayout>
);

const IndexPage = ({ bookData }) => (
  <BasePageLayout>
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Index</h1>
        <div className="w-24 h-1 bg-gray-300 mx-auto"></div>
      </div>
      <div className="flex-1">
        <p className="text-gray-500 text-center">Index content will be displayed here.</p>
      </div>
    </div>
  </BasePageLayout>
);

// Continuation Page Component - Text Only (No Title)
const ContinuationPage = ({ chapter, page, pageId }) => {
  if (!page) return null;

  return (
    <BasePageLayout>
      <div className="h-full flex flex-col">
        {/* Page Content - Text Only (No Title) */}
        <div className="flex-1">
          <div 
            className="prose prose-lg max-w-none"
            style={{
              textIndent: '0', // No indent for first paragraph
            }}
          >
            {/* First paragraph - no indent */}
            <p className="text-lg leading-relaxed text-gray-700 mb-4" style={{ textIndent: '0' }}>
              {page.content}
            </p>
          </div>
        </div>
      </div>
    </BasePageLayout>
  );
};

const PageRouter = ({ 
  bookData, 
  currentPage, 
  currentSection, 
  currentChapter, 
  currentPageId,
  onNavigate 
}) => {
  if (!bookData) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No book data available</p>
      </div>
    );
  }

  // Render based on current page
  switch (currentPage) {
    case 'cover':
      return <BookCoverPage bookData={bookData} />;
    
    case 'toc':
      return <TOCPage bookData={bookData} onNavigate={onNavigate} />;
    
    case 'author':
      return <AuthorPage bookData={bookData} />;
    
    case 'preface':
      return <PrefacePage bookData={bookData} />;
    
    case 'dedication':
      return <DedicationPage bookData={bookData} />;
    
    case 'acknowledgments':
      return <AcknowledgmentsPage bookData={bookData} />;
    
    case 'foreword':
      return <ForewordPage bookData={bookData} />;
    
    case 'introduction':
      return <IntroductionPage bookData={bookData} />;
    
    case 'chapter':
      if (currentChapter) {
        const chapter = bookData.chapters?.find(ch => ch.id === currentChapter);
        if (chapter) {
          return <ChapterPage chapter={chapter} />;
        }
      }
      return <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Chapter not found</p>
      </div>;
    
    case 'page':
      if (currentChapter && currentPageId) {
        const chapter = bookData.chapters?.find(ch => ch.id === currentChapter);
        const page = chapter?.pages?.find(p => p.id === currentPageId);
        if (page) {
          return <ContinuationPage chapter={chapter} page={page} pageId={currentPageId} />;
        }
      }
      return <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Page not found</p>
      </div>;
    
    case 'page-with-title':
      if (currentChapter && currentPageId) {
        const chapter = bookData.chapters?.find(ch => ch.id === currentChapter);
        const page = chapter?.pages?.find(p => p.id === currentPageId);
        if (page) {
          return <PageContent chapter={chapter} page={page} pageId={currentPageId} showTitle={true} />;
        }
      }
      return <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Page not found</p>
      </div>;
    
    case 'epilogue':
      return <EpiloguePage bookData={bookData} />;
    
    case 'appendix':
      return <AppendixPage bookData={bookData} />;
    
    case 'glossary':
      return <GlossaryPage bookData={bookData} />;
    
    case 'bibliography':
      return <BibliographyPage bookData={bookData} />;
    
    case 'index':
      return <IndexPage bookData={bookData} />;
    
    default:
      return <BookCoverPage bookData={bookData} />;
  }
};

export default PageRouter; 