// AI Tool Configurations
// Each tool has a label, tooltip, prompt builder, and optional custom response handler

export const aiToolConfigs = {
  // Writing Tools
  aiWriter: {
    label: 'AI Writer',
    tooltip: 'Generate continuation or enhanced version of current content',
    icon: 'Lightbulb',
    isAdditive: true,
    minCharRequired: 10,
    promptBuilder: (text) => `Continue writing the following content in a natural, engaging way:\n\n${text}`,
    onResponse: (originalText, response) => {
      // Append the AI response to the original text
      return originalText + '\n\n' + response;
    }
  },

  continueWriting: {
    label: 'Continue Writing',
    tooltip: 'Continue writing from where you left off',
    icon: 'Zap',
    isAdditive: true,
    minCharRequired: 10,
    promptBuilder: (text) => `Continue writing the following passage with consistent tone and depth:\n\n${text}`,
    onResponse: (originalText, response) => {
      // Append the continuation
      return originalText + '\n\n' + response;
    }
  },

  generatePageSummary: {
    label: 'Generate Page Summary',
    tooltip: 'Create a concise summary of the current page content',
    icon: 'FileText',
    isAdditive: true,
    minCharRequired: 10,
    promptBuilder: (text) => `Create a brief, professional summary of this content:\n\n${text}`,
    onResponse: (originalText, response) => {
      // Add summary at the beginning
      return `## Summary\n${response}\n\n---\n\n${originalText}`;
    }
  },

  // Clarity & Style
  refactorText: {
    label: 'Refactor Text',
    tooltip: 'Improve clarity and structure of the content',
    icon: 'RefreshCw',
    isAdditive: false,
    minCharRequired: 5,
    promptBuilder: (text) => `Refactor this text to improve clarity, structure, and readability while maintaining the same meaning:\n\n${text}`,
    onResponse: (originalText, response) => {
      // Replace the original text with the refactored version
      return response;
    }
  },

  enhanceStyle: {
    label: 'AI Enhance',
    tooltip: 'Improve grammar, clarity, and sentence flow',
    icon: 'Palette',
    isAdditive: false,
    minCharRequired: 5,
    promptBuilder: (text) => `Please enhance the following text for grammar, clarity, and flow without changing the core meaning:\n\n${text}`,
    onResponse: (originalText, response) => {
      // Replace with enhanced version
      return response;
    }
  },

  simplifyLanguage: {
    label: 'Simplify Language',
    tooltip: 'Simplify complex language and make it more accessible',
    icon: 'Type',
    isAdditive: false,
    minCharRequired: 5,
    promptBuilder: (text) => `Simplify this text to make it more accessible and easier to understand, while maintaining the key information:\n\n${text}`,
    onResponse: (originalText, response) => {
      // Replace with simplified version
      return response;
    }
  },

  convertPOV: {
    label: 'Convert POV',
    tooltip: 'Convert between first and third person perspective',
    icon: 'Users',
    isAdditive: false,
    minCharRequired: 5,
    promptBuilder: (text) => `Convert this text from its current perspective to the opposite perspective (if it's in first person, convert to third person, and vice versa):\n\n${text}`,
    onResponse: (originalText, response) => {
      // Replace with converted version
      return response;
    }
  },

  // Content Helpers
  addExamples: {
    label: 'Add Examples',
    tooltip: 'Add relevant examples and analogies to illustrate points',
    icon: 'Lightbulb',
    isAdditive: true,
    minCharRequired: 20,
    promptBuilder: (text) => `Add relevant examples, analogies, or case studies to illustrate the key points in this content:\n\n${text}`,
    onResponse: (originalText, response) => {
      // Append examples
      return originalText + '\n\n' + response;
    }
  },

  insertFacts: {
    label: 'Insert Facts',
    tooltip: 'Add supporting facts, statistics, and quotes',
    icon: 'BookOpen',
    isAdditive: true,
    minCharRequired: 20,
    promptBuilder: (text) => `Add relevant facts, statistics, research findings, or quotes to support the claims in this content:\n\n${text}`,
    onResponse: (originalText, response) => {
      // Append facts
      return originalText + '\n\n' + response;
    }
  },

  expandToList: {
    label: 'Expand to List',
    tooltip: 'Convert content into a structured list or step-by-step format',
    icon: 'List',
    isAdditive: false,
    minCharRequired: 20,
    promptBuilder: (text) => `Convert this content into a well-structured list or step-by-step format:\n\n${text}`,
    onResponse: (originalText, response) => {
      // Replace with list format
      return response;
    }
  },

  // Other
  translate: {
    label: 'Translate',
    tooltip: 'Translate current page into another language',
    icon: 'Globe',
    isAdditive: false,
    minCharRequired: 10,
    hasLanguageDropdown: true,
    languages: {
      'Kannada': 'Kannada',
      'Hindi': 'Hindi', 
      'Spanish': 'Spanish',
      'Chinese': 'Simplified Chinese'
    },
    defaultLanguage: 'Kannada',
    promptBuilder: (text, selectedLanguage = 'Kannada') => `Translate the following text into ${selectedLanguage}. Keep formatting natural.\n\n${text}`,
    onResponse: (originalText, response) => {
      // Replace with translated version
      return response;
    }
  }
};

// Category configurations for the AI Toolbar
export const aiCategories = {
  writing: {
    label: 'Writing Tools',
    icon: '✍️',
    description: 'AI Writer, Continue Writing, AI Enhance, Generate Summary',
    tools: ['aiWriter', 'continueWriting', 'enhanceStyle', 'generatePageSummary']
  },
  clarity: {
    label: 'Editing Aids',
    icon: '🧠',
    description: 'Refactor, Simplify Language, Convert POV',
    tools: ['refactorText', 'simplifyLanguage', 'convertPOV']
  },
  content: {
    label: 'Content Helpers',
    icon: '📚',
    description: 'Add Examples, Insert Facts, Expand to List',
    tools: ['addExamples', 'insertFacts', 'expandToList']
  },
  other: {
    label: 'Translation',
    icon: '🌐',
    description: 'Translate to different languages',
    tools: ['translate']
  },
  utilities: {
    label: 'Utilities',
    icon: '📊',
    description: 'Plagiarism Check, Analytics',
    tools: []
  }
}; 