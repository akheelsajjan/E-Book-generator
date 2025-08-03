Implement AI-powered book generation in the "Create New Book" modal.

🎯 Goal:
When the user fills in the inputs (idea, genre, target audience, chapters) and clicks "Generate with AI", the app should:
1. Send a prompt to Gemini/ChatGPT to generate a book (title, description, chapters, and pages).
2. Parse the returned JSON response.
3. Create a new book in Firebase Firestore and store all details.
4. Redirect the user to the book editor screen and show the content.

📥 Input Fields (already present):
- Input Text (book idea)
- Genre
- Target Audience
- Number of Chapters

✅ Task:
1. On "Generate with AI" button click:
   - Construct this prompt string dynamically:



You're an AI writing assistant. Based on the following user input, generate a complete book structure in JSON format.

Inputs:

Book Idea: "{{user_input}}"

Genre: "{{genre}}"

Target Audience: "{{audience}}"

Chapters: {{chapter_count}}

Output JSON schema:
{
"title": "Book Title",
"description": "Short overview of the book",
"chapters": [
{
"title": "Chapter 1 Title",
"pages": [
{
"title": "Page 1 Title",
"content": "Full page content here"
}
]
}
]
}

Keep chapter count limited to {{chapter_count}}. Each chapter should have 1–3 pages max and max 1000 characters per page.
Return only the JSON object. No extra explanation or formatting.

2. Send this prompt to the AI (using Gemini or OpenAI API).
3. On receiving response:-
         Parse the JSON.
         Follow the same way you create book when we click on "create book" 
         (this we already are doing , do the same i.e. creating the book, storing it in firebase and navigating to editor screen and showing the content)

🛠 Notes:
-Create sepearte component for this so that it is easy to maintain 
- Show loading state while content is generating.
- Handle API failures gracefully (with an error toast).
-After reciving response from from gemeni handle the response and create the book
