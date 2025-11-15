import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API);

/**
 * Analyzes post content and provides improvement suggestions
 * @param {string} content - The post content to analyze
 * @param {string} tag - The post tag/category
 * @returns {Promise<Object>} Analysis results with suggestions
 */
export const analyzePostContent = async (content, tag = 'general') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are a helpful AI assistant for a student community platform called SITVault. 
Analyze the following post and provide constructive feedback.

Post Category: ${tag}
Post Content:
"""
${content}
"""

Please provide your analysis in the following JSON format (respond ONLY with valid JSON, no markdown formatting):
{
  "score": <number 1-10>,
  "isAppropriate": <boolean>,
  "tone": "<positive/neutral/negative/mixed>",
  "clarity": "<clear/moderate/unclear>",
  "improvements": [
    "<suggestion 1>",
    "<suggestion 2>",
    "<suggestion 3>"
  ],
  "enhancedVersion": "<improved version of the post content>",
  "warningFlags": [
    "<any concerning elements like spam, inappropriate language, etc.>"
  ]
}

Guidelines:
- Check for clarity, grammar, and tone
- Ensure content is appropriate for a student community
- Provide 2-3 actionable improvement suggestions
- Enhanced version should be polite, clear, and well-structured
- Flag any inappropriate content, spam, or harassment
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response to extract JSON
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    const analysis = JSON.parse(jsonText);
    return {
      success: true,
      data: analysis
    };
  } catch (error) {
    console.error('Error analyzing content with Gemini:', error);
    return {
      success: false,
      error: error.message || 'Failed to analyze content'
    };
  }
};

/**
 * Quick check if content needs moderation
 * @param {string} content - The content to check
 * @returns {Promise<Object>} Moderation results
 */
export const moderateContent = async (content) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Analyze this content for a student community platform and check if it's appropriate.

Content:
"""
${content}
"""

Respond ONLY with valid JSON (no markdown formatting):
{
  "isAppropriate": <boolean>,
  "severity": "<none/low/medium/high>",
  "issues": [
    "<list any issues found>"
  ],
  "recommendation": "<approve/flag-for-review/reject>"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    // Clean markdown formatting
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }
    
    const moderation = JSON.parse(text);
    return {
      success: true,
      data: moderation
    };
  } catch (error) {
    console.error('Error moderating content:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate content suggestions based on partial input
 * @param {string} partialContent - Partial content typed by user
 * @param {string} tag - Post category
 * @returns {Promise<Object>} Content suggestions
 */
export const getSuggestions = async (partialContent, tag = 'general') => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are helping a student write a post on SITVault community platform.

Category: ${tag}
Current draft:
"""
${partialContent}
"""

Provide 2-3 short suggestions to help them complete or improve their post.
Respond with valid JSON only (no markdown):
{
  "suggestions": [
    "<suggestion 1>",
    "<suggestion 2>"
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();
    
    if (text.startsWith('```json')) {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }
    
    const suggestions = JSON.parse(text);
    return {
      success: true,
      data: suggestions
    };
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
