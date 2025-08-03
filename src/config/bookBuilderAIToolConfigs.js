// AI Tool Configurations for Book Builder
export const bookBuilderAIToolConfigs = {
  'ai-enhance': {
    label: 'AI Enhance',
    tooltip: 'Enhances and improves your content',
    icon: 'Sparkles',
    minCharRequired: 5,
    isAdditive: false,
    promptBuilder: (content) => `
      Enhance and improve the following content while maintaining its core message and meaning:
      
      "${content}"
      
      Please:
      1. Improve clarity and readability
      2. Enhance the writing style
      3. Fix any grammatical issues
      4. Make it more engaging and professional
      5. Keep the same length or slightly shorter
      
      Return only the enhanced content without any explanations.
    `,
    onResponse: (originalContent, response) => {
      return response.trim();
    }
  },

  'refactor': {
    label: 'Refactor',
    tooltip: 'Refactors content for better structure and flow',
    icon: 'RotateCcw',
    minCharRequired: 10,
    isAdditive: false,
    promptBuilder: (content) => `
      Refactor the following content to improve its structure, flow, and organization:
      
      "${content}"
      
      Please:
      1. Reorganize the content for better logical flow
      2. Improve sentence structure and paragraph organization
      3. Maintain the same key information and message
      4. Make it more coherent and well-structured
      5. Keep similar length
      
      Return only the refactored content without any explanations.
    `,
    onResponse: (originalContent, response) => {
      return response.trim();
    }
  },

  'simplify': {
    label: 'Simplify Text',
    tooltip: 'Simplifies complex language for better readability',
    icon: 'Zap',
    minCharRequired: 10,
    isAdditive: false,
    promptBuilder: (content) => `
      Simplify the following content to make it more readable and accessible:
      
      "${content}"
      
      Please:
      1. Use simpler, clearer language
      2. Break down complex sentences
      3. Replace jargon with everyday terms
      4. Maintain the same meaning and information
      5. Make it easier to understand
      
      Return only the simplified content without any explanations.
    `,
    onResponse: (originalContent, response) => {
      return response.trim();
    }
  },

  'convert-pov': {
    label: 'Convert to POV',
    tooltip: 'Converts between first and third person perspective',
    icon: 'User',
    minCharRequired: 10,
    isAdditive: false,
    promptBuilder: (content) => `
      Convert the following content to the opposite point of view (if it's in first person, convert to third person, and vice versa):
      
      "${content}"
      
      Please:
      1. Change the perspective while maintaining the same message
      2. Adjust pronouns and verb forms accordingly
      3. Keep the same tone and style
      4. Maintain all key information
      5. Ensure it reads naturally in the new perspective
      
      Return only the converted content without any explanations.
    `,
    onResponse: (originalContent, response) => {
      return response.trim();
    }
  },

  'translate': {
    label: 'Translate',
    tooltip: 'Translates content to the selected language',
    icon: 'Languages',
    minCharRequired: 5,
    isAdditive: false,
    hasLanguageDropdown: true,
    languages: {
      'English': 'en',
      'Spanish': 'es',
      'French': 'fr',
      'German': 'de',
      'Italian': 'it',
      'Portuguese': 'pt',
      'Russian': 'ru',
      'Japanese': 'ja',
      'Korean': 'ko',
      'Chinese': 'zh',
      'Arabic': 'ar',
      'Hindi': 'hi'
    },
    promptBuilder: (content, selectedLanguage) => {
      const languageMap = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi'
      };
      
      const targetLanguage = languageMap[selectedLanguage] || 'English';
      
      return `
        Translate the following content to ${targetLanguage}:
        
        "${content}"
        
        Please:
        1. Provide an accurate translation
        2. Maintain the same tone and style
        3. Preserve the meaning and intent
        4. Use natural language for the target language
        5. Keep the same length and structure where possible
        
        Return only the translated content without any explanations.
      `;
    },
    onResponse: (originalContent, response) => {
      return response.trim();
    }
  }
};

// AI Categories for Book Builder
export const bookBuilderAICategories = {
  writing: {
    label: 'Writing Tools',
    tools: ['ai-enhance']
  },
  editing: {
    label: 'Editing Aids',
    tools: ['refactor', 'simplify', 'convert-pov']
  },
  translation: {
    label: 'Translation',
    tools: ['translate']
  }
}; 