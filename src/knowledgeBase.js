// Pre-built knowledge base for offline/cached recommendations
// Organized by category with sub-category branching

export const SUB_CATEGORIES = {
  photo: {
    question: "What would you like to do with images?",
    options: [
      { id: "photo_generate", label: "🎨 Generate new images", prompt: "generating AI images from text prompts and descriptions" },
      { id: "photo_edit", label: "✂️ Edit existing photos", prompt: "editing, enhancing, retouching, or removing backgrounds from existing photos" },
      { id: "photo_restore", label: "🔧 Restore old photos", prompt: "restoring, colourising, or enhancing old damaged photographs" },
      { id: "photo_product", label: "📸 Product photography", prompt: "creating professional product photos for e-commerce or marketing" },
    ],
  },
  coding: {
    question: "What kind of coding help do you need?",
    options: [
      { id: "coding_build", label: "🏗️ Build something new", prompt: "building a new app, website, or software project from scratch" },
      { id: "coding_debug", label: "🐛 Fix or improve code", prompt: "debugging, fixing errors, or improving existing code" },
      { id: "coding_learn", label: "📚 Learn to code", prompt: "learning to code as a complete beginner" },
      { id: "coding_nocode", label: "🧩 No-code app builder", prompt: "building an app or website without writing any code using drag-and-drop tools" },
      { id: "coding_automate", label: "⚙️ Automate tasks", prompt: "automating repetitive tasks, scripts, or workflows with code" },
    ],
  },
  video: {
    question: "What kind of video work?",
    options: [
      { id: "video_generate", label: "🎬 Generate video from text", prompt: "generating video content from text descriptions using AI" },
      { id: "video_edit", label: "✂️ Edit existing video", prompt: "editing, trimming, adding effects to existing video footage" },
      { id: "video_avatar", label: "🧑‍💼 AI avatar / talking head", prompt: "creating AI avatar or talking head videos for presentations or marketing" },
      { id: "video_subtitle", label: "💬 Subtitles & captions", prompt: "automatically generating subtitles, captions, or transcriptions for video" },
    ],
  },
  writing: {
    question: "What are you writing?",
    options: [
      { id: "writing_blog", label: "📝 Blog or article", prompt: "writing blog posts, articles, or long-form content" },
      { id: "writing_marketing", label: "📣 Marketing copy", prompt: "writing marketing copy, ads, social media posts, or email campaigns" },
      { id: "writing_creative", label: "✨ Creative writing", prompt: "creative writing, fiction, scripts, or storytelling" },
      { id: "writing_academic", label: "🎓 Academic writing", prompt: "writing academic papers, essays, research reports, or thesis" },
      { id: "writing_email", label: "📧 Emails & communication", prompt: "drafting professional emails, cover letters, or business communications" },
    ],
  },
  music: {
    question: "What would you like to create?",
    options: [
      { id: "music_generate", label: "🎶 Generate music", prompt: "generating music tracks, beats, or background music using AI" },
      { id: "music_voice", label: "🎙️ Voice & speech", prompt: "text-to-speech, voice cloning, or voice-over generation" },
      { id: "music_audiobook", label: "📖 Audiobooks & narration", prompt: "converting text or books into natural-sounding audiobook narration" },
      { id: "music_podcast", label: "🎧 Podcast production", prompt: "recording, editing, and producing podcast episodes with AI assistance" },
      { id: "music_sfx", label: "🔊 Sound effects", prompt: "generating sound effects, ambient audio, or foley sounds" },
    ],
  },
  research: {
    question: "What kind of research?",
    options: [
      { id: "research_web", label: "🔍 Web research", prompt: "searching the web for current information, fact-checking, or gathering data" },
      { id: "research_academic", label: "📄 Academic research", prompt: "finding academic papers, analysing studies, or literature reviews" },
      { id: "research_summarise", label: "📋 Summarise documents", prompt: "summarising long documents, PDFs, reports, or articles" },
      { id: "research_market", label: "📊 Market research", prompt: "researching markets, competitors, industry trends, or customer insights" },
    ],
  },
  business: {
    question: "What business task do you need help with?",
    options: [
      { id: "business_presentation", label: "📊 Presentations", prompt: "creating professional presentations, slide decks, or pitch decks" },
      { id: "business_spreadsheet", label: "📑 Spreadsheets & data", prompt: "building spreadsheets, formulas, data analysis, or reports" },
      { id: "business_automation", label: "⚡ Workflow automation", prompt: "automating business workflows between apps and services" },
      { id: "business_project", label: "📋 Project management", prompt: "managing projects, tracking tasks, team collaboration, or planning" },
      { id: "business_crm", label: "🤝 Sales & CRM", prompt: "managing customer relationships, sales pipelines, or lead generation" },
    ],
  },
  design: {
    question: "What kind of design?",
    options: [
      { id: "design_logo", label: "💎 Logo design", prompt: "creating professional logos and brand identity" },
      { id: "design_graphic", label: "🎯 Social media graphics", prompt: "creating social media graphics, banners, or marketing materials" },
      { id: "design_ui", label: "📱 UI/UX design", prompt: "designing user interfaces, app mockups, or website layouts" },
      { id: "design_3d", label: "🧊 3D modeling", prompt: "creating 3D models, renders, or animations" },
      { id: "design_brand", label: "🏷️ Full brand kit", prompt: "creating a complete brand identity with colours, fonts, logo, and guidelines" },
    ],
  },
  legal: {
    question: "What legal help do you need?",
    options: [
      { id: "legal_contract", label: "📄 Contract review", prompt: "reviewing, understanding, or drafting contracts and agreements" },
      { id: "legal_research", label: "🔍 Legal research", prompt: "researching laws, regulations, case law, or legal precedents" },
      { id: "legal_compliance", label: "✅ Compliance & policy", prompt: "understanding compliance requirements, privacy policies, or terms of service" },
      { id: "legal_ip", label: "🛡️ Intellectual property", prompt: "understanding trademarks, copyrights, patents, or IP protection" },
      { id: "legal_personal", label: "👤 Personal legal matters", prompt: "general guidance on personal legal matters like disputes, tenancy, or consumer rights" },
    ],
  },
  companion: {
    question: "What kind of AI companion are you looking for?",
    options: [
      { id: "companion_chat", label: "💬 Conversational partner", prompt: "having meaningful conversations, debating ideas, or general chat with AI" },
      { id: "companion_emotional", label: "❤️ Emotional support", prompt: "AI for emotional support, mindfulness, journaling, or mental wellness" },
      { id: "companion_story", label: "📖 Interactive storytelling", prompt: "AI-driven interactive fiction, role-playing games, or collaborative storytelling" },
      { id: "companion_coach", label: "🎯 Personal coaching", prompt: "AI life coach, career coaching, goal setting, or accountability partner" },
      { id: "companion_language", label: "🗣️ Language practice", prompt: "practicing speaking or writing in a foreign language with AI" },
    ],
  },
  marketing: {
    question: "What marketing task?",
    options: [
      { id: "marketing_social", label: "📱 Social media management", prompt: "scheduling, creating, and managing social media posts and content" },
      { id: "marketing_seo", label: "🔍 SEO & search", prompt: "search engine optimisation, keyword research, or improving search rankings" },
      { id: "marketing_ads", label: "💰 Ad campaigns", prompt: "creating and managing paid ad campaigns on Google, Meta, or social platforms" },
      { id: "marketing_email", label: "📧 Email marketing", prompt: "creating email campaigns, newsletters, or drip sequences" },
      { id: "marketing_analytics", label: "📊 Marketing analytics", prompt: "tracking marketing performance, attribution, conversions, or ROI analysis" },
    ],
  },
  education: {
    question: "What educational goal?",
    options: [
      { id: "education_tutor", label: "👨‍🏫 Personal tutor", prompt: "getting personalised tutoring or explanations on any school or university subject" },
      { id: "education_course", label: "📚 Create a course", prompt: "building online courses, lesson plans, or educational content" },
      { id: "education_study", label: "📝 Study aids & flashcards", prompt: "creating flashcards, study guides, practice quizzes, or revision materials" },
      { id: "education_exam", label: "🎯 Exam preparation", prompt: "preparing for exams, standardised tests, or professional certifications" },
      { id: "education_kids", label: "👶 Kids & early learning", prompt: "educational activities, interactive learning, or homework help for children" },
    ],
  },
  health: {
    question: "What health area interests you?",
    options: [
      { id: "health_fitness", label: "💪 Fitness & exercise", prompt: "creating workout plans, exercise routines, or fitness tracking" },
      { id: "health_nutrition", label: "🥗 Nutrition & meal planning", prompt: "meal planning, calorie tracking, dietary advice, or recipe generation" },
      { id: "health_mental", label: "🧘 Mental wellness", prompt: "mindfulness, meditation, stress management, or mental health support" },
      { id: "health_symptoms", label: "🩺 Symptom checker", prompt: "understanding symptoms, health conditions, or when to see a doctor" },
      { id: "health_sleep", label: "😴 Sleep improvement", prompt: "improving sleep quality, tracking sleep patterns, or sleep hygiene" },
    ],
  },
  finance: {
    question: "What financial task?",
    options: [
      { id: "finance_bookkeeping", label: "📒 Bookkeeping", prompt: "managing books, tracking expenses, recording transactions, or reconciling accounts" },
      { id: "finance_tax", label: "🧾 Tax preparation", prompt: "preparing taxes, understanding deductions, or tax filing assistance" },
      { id: "finance_budget", label: "💳 Budgeting & planning", prompt: "creating personal or business budgets, financial planning, or savings goals" },
      { id: "finance_invoice", label: "🧾 Invoicing & billing", prompt: "creating invoices, managing billing, or tracking payments" },
      { id: "finance_invest", label: "📈 Investment research", prompt: "researching stocks, crypto, investment opportunities, or portfolio analysis" },
    ],
  },
  data: {
    question: "What do you need to do with data?",
    options: [
      { id: "data_analysis", label: "📊 Analyse data", prompt: "analysing datasets, finding patterns, or creating statistical reports" },
      { id: "data_visualise", label: "📈 Visualise & chart", prompt: "creating charts, graphs, dashboards, or data visualisations" },
      { id: "data_clean", label: "🧹 Clean & transform", prompt: "cleaning messy data, removing duplicates, or transforming data formats" },
      { id: "data_ml", label: "🤖 Machine learning", prompt: "building machine learning models, predictions, or AI training for beginners" },
      { id: "data_scrape", label: "🕷️ Web scraping", prompt: "extracting data from websites, web scraping, or data collection automation" },
    ],
  },
  translation: {
    question: "What language task?",
    options: [
      { id: "translation_translate", label: "🔄 Translate text", prompt: "translating documents, text, or conversations between languages" },
      { id: "translation_learn", label: "📚 Learn a language", prompt: "learning a new language with AI tutoring, practice, and exercises" },
      { id: "translation_localise", label: "🌐 Localise content", prompt: "localising websites, apps, or marketing content for different regions" },
      { id: "translation_live", label: "🎤 Live interpretation", prompt: "real-time speech translation or live interpretation for meetings or travel" },
    ],
  },
};

// ============================================
// Knowledge Base — Pre-built recommendations
// ============================================

export const KNOWLEDGE_BASE = {
  // --- PHOTO ---
  photo_generate: {
    summary: "To generate images from text, you'll describe what you want and AI creates it. Start with free tools like Google's ImageFX, then explore paid options for more control.",
    tools: [
      { name: "Google ImageFX", emoji: "✨", color: "#6ee7f7", model: "Imagen 3", free: true, rank: 1, why_best: "Completely free with Google's best image model — no account needed", description: "Google's free AI image generator powered by Imagen 3. Type a description and get stunning images in seconds.", steps: ["Go to imagefx.google.com", "Type what you want to see (e.g. 'a cat astronaut on the moon')", "Click Generate and pick your favourite result"], url: "https://imagefx.google.com" },
      { name: "Adobe Firefly", emoji: "🦋", color: "#a78bfa", model: "Firefly Image 3", free: true, rank: 2, why_best: "Commercially safe images with great style controls", description: "Adobe's AI generator with 25 free credits/month. Results are commercially safe to use.", steps: ["Visit firefly.adobe.com and sign up free", "Choose 'Text to Image' and type your description", "Use style options to refine your result"], url: "https://firefly.adobe.com" },
      { name: "Midjourney", emoji: "🎨", color: "#f97316", model: "Midjourney v6.1", free: false, rank: 3, why_best: "Unmatched artistic quality for creative projects", description: "The gold standard for AI art. Incredibly artistic and detailed. $10/mo subscription.", steps: ["Subscribe at midjourney.com", "Use the web app to type prompts", "Select and upscale your favourites"], url: "https://midjourney.com" },
    ],
  },
  photo_edit: {
    summary: "For editing photos with AI, you can remove objects, enhance quality, or change backgrounds. These tools make professional edits easy for anyone.",
    tools: [
      { name: "Canva Magic Studio", emoji: "🪄", color: "#34d399", model: "Canva AI", free: true, rank: 1, why_best: "One-click AI edits with the easiest interface", description: "Remove backgrounds, erase objects, and enhance photos with one click.", steps: ["Go to canva.com and upload your photo", "Click 'Edit Image' and choose Magic Eraser or Background Remover", "Download your edited image"], url: "https://www.canva.com" },
      { name: "Cleanup.pictures", emoji: "🧹", color: "#fb7185", model: "LaMa inpainting", free: true, rank: 2, why_best: "Dead-simple object removal with no signup", description: "Paint over what you want gone and AI fills in the background naturally.", steps: ["Go to cleanup.pictures", "Upload your photo", "Paint over the object you want removed"], url: "https://cleanup.pictures" },
      { name: "Adobe Photoshop", emoji: "🖌️", color: "#6ee7f7", model: "Generative Fill", free: false, rank: 3, why_best: "Most powerful AI editing for professional results", description: "Industry standard with AI Generative Fill to add, remove, or modify anything.", steps: ["Subscribe to Photoshop or use the free trial", "Select an area with the Lasso tool", "Click Generative Fill and describe what you want"], url: "https://www.adobe.com/products/photoshop.html" },
    ],
  },
  photo: {
    summary: "Great AI tools exist for both creating and editing images. For generating new images try Google ImageFX (free) or Midjourney (paid). For editing, try Canva or Cleanup.pictures.",
    tools: [
      { name: "Google ImageFX", emoji: "✨", color: "#6ee7f7", model: "Imagen 3", free: true, rank: 1, why_best: "Best free image generator available", description: "Google's free AI image generator. Type a description and get stunning images.", steps: ["Go to imagefx.google.com", "Describe your image in words", "Generate and download"], url: "https://imagefx.google.com" },
      { name: "Canva Magic Studio", emoji: "🪄", color: "#34d399", model: "Canva AI", free: true, rank: 2, why_best: "All-in-one design and editing tool", description: "AI photo editing, background removal, and image generation built in.", steps: ["Sign up at canva.com", "Upload a photo or start a new design", "Use Magic Studio tools"], url: "https://www.canva.com" },
      { name: "Midjourney", emoji: "🎨", color: "#f97316", model: "v6.1", free: false, rank: 3, why_best: "Premium artistic quality for creative work", description: "Premium AI art generator producing incredibly artistic results.", steps: ["Subscribe at midjourney.com ($10/mo)", "Use the web app to type prompts", "Select and upscale your favourites"], url: "https://midjourney.com" },
    ],
  },

  // --- CODING ---
  coding_build: {
    summary: "To build something new, AI coding assistants can write code for you. Cursor is like having a senior developer — describe what you want and it builds it.",
    tools: [
      { name: "Cursor", emoji: "⚡", color: "#a78bfa", model: "Claude claude-sonnet-4-20250514", free: true, rank: 1, why_best: "AI-first editor that builds entire apps from descriptions", description: "Describe what you want and Cursor generates the code. Generous free tier.", steps: ["Download Cursor from cursor.com", "Describe what you want to build in the chat", "Accept the generated code"], url: "https://cursor.com" },
      { name: "Replit", emoji: "🔄", color: "#f97316", model: "Replit AI Agent", free: true, rank: 2, why_best: "Build and deploy in the browser with zero setup", description: "Code in your browser with AI. Describe your app and Replit builds it.", steps: ["Go to replit.com and sign up", "Click 'Create Repl' and describe your project", "Use the AI Agent to build"], url: "https://replit.com" },
      { name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true, rank: 3, why_best: "Best for getting complete code snippets explained", description: "Excels at writing, explaining, and debugging code.", steps: ["Go to claude.ai", "Describe what you want to build", "Copy generated code into your project"], url: "https://claude.ai" },
    ],
  },
  coding_debug: {
    summary: "AI is excellent at finding and fixing bugs. Paste your error message or code and get an explanation and fix in plain English.",
    tools: [
      { name: "Cursor", emoji: "⚡", color: "#a78bfa", model: "Claude claude-sonnet-4-20250514", free: true, rank: 1, why_best: "Understands your whole project context for better fixes", description: "Open your buggy code, select the error, and let AI fix it.", steps: ["Open your project in Cursor", "Select the broken code or paste the error", "Press Cmd+K and describe the problem"], url: "https://cursor.com" },
      { name: "ChatGPT", emoji: "💬", color: "#34d399", model: "GPT-4o", free: true, rank: 2, why_best: "Great at explaining bugs in beginner-friendly language", description: "Paste your error and code — it explains and fixes it.", steps: ["Go to chat.openai.com", "Paste your error message and code", "Ask 'What's wrong and how do I fix it?'"], url: "https://chat.openai.com" },
    ],
  },
  coding_learn: {
    summary: "AI makes learning to code much easier with personalised explanations, practice exercises, and real-time feedback.",
    tools: [
      { name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true, rank: 1, why_best: "Best at teaching with clear, patient explanations", description: "Excellent at explaining concepts, creating exercises, and reviewing code.", steps: ["Go to claude.ai", "Ask 'Teach me Python basics'", "Follow along and ask questions"], url: "https://claude.ai" },
      { name: "Replit", emoji: "🔄", color: "#f97316", model: "Replit AI", free: true, rank: 2, why_best: "Learn by doing — code and run instantly in the browser", description: "Write code, run it instantly, get AI help when stuck.", steps: ["Sign up at replit.com", "Choose a tutorial or start a new project", "Use the AI assistant to learn"], url: "https://replit.com" },
    ],
  },
  coding: {
    summary: "AI coding tools can help you build apps, fix bugs, and learn programming. Cursor and Claude are the top choices.",
    tools: [
      { name: "Cursor", emoji: "⚡", color: "#a78bfa", model: "Claude claude-sonnet-4-20250514", free: true, rank: 1, why_best: "AI-first code editor — describe and build", description: "Describe what you want, and it writes the code.", steps: ["Download from cursor.com", "Describe your project", "Accept generated code"], url: "https://cursor.com" },
      { name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true, rank: 2, why_best: "Best for code generation, debugging, and learning", description: "Excellent for generating, explaining, and debugging code.", steps: ["Go to claude.ai", "Describe what you want", "Copy the code"], url: "https://claude.ai" },
      { name: "Replit", emoji: "🔄", color: "#f97316", model: "Replit Agent", free: true, rank: 3, why_best: "Build and deploy entirely in the browser", description: "Build and deploy apps in the browser with AI.", steps: ["Go to replit.com", "Describe your app", "Deploy with one click"], url: "https://replit.com" },
    ],
  },

  // --- VIDEO ---
  video: {
    summary: "AI video tools can generate clips from text or help edit footage. Most have free trials to experiment with.",
    tools: [
      { name: "Runway", emoji: "🎬", color: "#a78bfa", model: "Gen-3 Alpha", free: true, rank: 1, why_best: "Industry-leading AI video generation from text or images", description: "Create short video clips from text descriptions or images.", steps: ["Sign up at runwayml.com", "Choose 'Text to Video'", "Describe your clip and generate"], url: "https://runwayml.com" },
      { name: "CapCut", emoji: "✂️", color: "#34d399", model: "CapCut AI", free: true, rank: 2, why_best: "Best free editor with auto-captions and smart tools", description: "Free video editor with AI auto-captions, background removal, and smart editing.", steps: ["Download CapCut or use the web version", "Import your video", "Use AI tools like auto-captions"], url: "https://www.capcut.com" },
      { name: "Pika", emoji: "🎞️", color: "#f97316", model: "Pika 2.0", free: true, rank: 3, why_best: "Simple creative AI video generation", description: "Turn text or images into short animated clips.", steps: ["Go to pika.art", "Type a description", "Choose a style and generate"], url: "https://pika.art" },
    ],
  },

  // --- WRITING ---
  writing: {
    summary: "AI writing assistants can help draft, edit, and improve any text. Claude and ChatGPT are top choices for quality.",
    tools: [
      { name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true, rank: 1, why_best: "Best for nuanced, well-structured long-form writing", description: "Excels at long-form content, analysis, and matching your tone.", steps: ["Go to claude.ai", "Describe your writing task and tone", "Refine with feedback"], url: "https://claude.ai" },
      { name: "ChatGPT", emoji: "💬", color: "#34d399", model: "GPT-4o", free: true, rank: 2, why_best: "Versatile writer great for brainstorming and drafting", description: "Great at brainstorming, drafting, and rewriting in different styles.", steps: ["Go to chat.openai.com", "Describe your writing task", "Ask for revisions"], url: "https://chat.openai.com" },
      { name: "Notion AI", emoji: "📓", color: "#a78bfa", model: "Notion AI", free: false, rank: 3, why_best: "Integrated into your workspace for seamless writing", description: "AI built into Notion's workspace. Generates, edits, and summarises in-place.", steps: ["Open a Notion page", "Press Space and select an AI action", "Choose Write, Summarise, or Edit"], url: "https://www.notion.so/product/ai" },
    ],
  },

  // --- MUSIC ---
  music: {
    summary: "AI can generate full music tracks, sound effects, and clone voices. Most tools offer free tiers.",
    tools: [
      { name: "Suno", emoji: "🎵", color: "#fb7185", model: "Suno v4", free: true, rank: 1, why_best: "Creates complete songs with vocals from a text description", description: "Generate complete songs with vocals. Pick genre, mood, and topic.", steps: ["Go to suno.com", "Describe your song", "Generate and download"], url: "https://suno.com" },
      { name: "Udio", emoji: "🎶", color: "#a78bfa", model: "Udio v1.5", free: true, rank: 2, why_best: "Impressive vocal quality with customisable lyrics", description: "Create songs in any genre with customisable lyrics.", steps: ["Visit udio.com", "Enter a prompt", "Extend or remix"], url: "https://udio.com" },
      { name: "ElevenLabs", emoji: "🎙️", color: "#6ee7f7", model: "ElevenLabs v3", free: true, rank: 3, why_best: "Industry-leading voice cloning and text-to-speech", description: "Realistic voiceovers in hundreds of voices and languages.", steps: ["Sign up at elevenlabs.io", "Choose or clone a voice", "Type your script and generate"], url: "https://elevenlabs.io" },
    ],
  },

  // --- RESEARCH ---
  research: {
    summary: "AI research tools find, understand, and summarise information quickly. Like having a research assistant 24/7.",
    tools: [
      { name: "Perplexity", emoji: "🔍", color: "#6ee7f7", model: "Perplexity Pro", free: true, rank: 1, why_best: "AI search engine with direct answers and cited sources", description: "Gives direct answers with citations. Shows exactly where info comes from.", steps: ["Go to perplexity.ai", "Ask your question", "Check the cited sources"], url: "https://perplexity.ai" },
      { name: "Claude.ai", emoji: "🧠", color: "#a78bfa", model: "Claude claude-opus-4-6", free: true, rank: 2, why_best: "Deep analysis and document summarisation", description: "Excellent for analysis, summarising documents, and explaining complex topics.", steps: ["Go to claude.ai", "Upload a document or ask your question", "Ask follow-ups to dig deeper"], url: "https://claude.ai" },
      { name: "NotebookLM", emoji: "📒", color: "#34d399", model: "Google Gemini", free: true, rank: 3, why_best: "Chat with your own documents and notes", description: "Upload PDFs, articles, or notes and ask questions about them.", steps: ["Go to notebooklm.google.com", "Upload your documents", "Ask questions about the content"], url: "https://notebooklm.google.com" },
    ],
  },

  // --- BUSINESS ---
  business: {
    summary: "AI can automate tasks, create presentations, and manage workflows. Save hours of manual work each week.",
    tools: [
      { name: "Gamma", emoji: "📊", color: "#f97316", model: "Gamma AI", free: true, rank: 1, why_best: "Creates beautiful presentations in seconds from a description", description: "Describe your topic and Gamma generates a full slide deck.", steps: ["Go to gamma.app", "Click 'Generate' and describe your presentation", "Customise and share"], url: "https://gamma.app" },
      { name: "Zapier", emoji: "⚡", color: "#a78bfa", model: "Zapier AI", free: true, rank: 2, why_best: "Automate workflows between 6000+ apps", description: "Connect tools and let AI handle repetitive tasks.", steps: ["Sign up at zapier.com", "Describe the workflow", "Connect apps and activate"], url: "https://zapier.com" },
      { name: "Microsoft Copilot", emoji: "🤖", color: "#6ee7f7", model: "GPT-4o", free: false, rank: 3, why_best: "AI built into Word, Excel, PowerPoint, and Outlook", description: "Automates document creation, data analysis, and email drafting.", steps: ["Get Microsoft 365 Copilot", "Open any Office app", "Click the Copilot icon"], url: "https://copilot.microsoft.com" },
    ],
  },

  // --- DESIGN ---
  design: {
    summary: "AI design tools make professional design accessible to everyone. Create logos, graphics, and UI without experience.",
    tools: [
      { name: "Canva", emoji: "🎨", color: "#34d399", model: "Magic Studio", free: true, rank: 1, why_best: "All-in-one design with drag-and-drop ease", description: "Create social media graphics, presentations, logos, and more.", steps: ["Sign up at canva.com", "Choose a template or start blank", "Use Magic Studio AI to generate or edit"], url: "https://www.canva.com" },
      { name: "Figma AI", emoji: "📐", color: "#a78bfa", model: "Figma AI", free: true, rank: 2, why_best: "Professional UI/UX design with AI generation", description: "Design tool with AI features. Generate designs from descriptions.", steps: ["Sign up at figma.com", "Create a new design file", "Use AI to generate components"], url: "https://www.figma.com" },
      { name: "Looka", emoji: "💎", color: "#fb7185", model: "Looka AI", free: false, rank: 3, why_best: "AI logo maker — dozens of options instantly", description: "Enter your brand name, pick styles, get professional logos.", steps: ["Go to looka.com", "Enter brand name and preferences", "Browse and customise logos"], url: "https://looka.com" },
    ],
  },

  // --- LEGAL ---
  legal: {
    summary: "AI legal tools can help you understand contracts, research laws, and draft basic legal documents. They're great for initial guidance, though always consult a lawyer for important matters.",
    tools: [
      { name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true, rank: 1, why_best: "Best at analysing long legal documents and explaining complex terms", description: "Upload contracts or legal documents and get plain-English explanations. Great for understanding complex legal language.", steps: ["Go to claude.ai", "Upload your contract or paste legal text", "Ask 'Explain this in simple terms' or 'What should I watch out for?'"], url: "https://claude.ai" },
      { name: "Spellbook", emoji: "📜", color: "#a78bfa", model: "Spellbook AI", free: false, rank: 2, why_best: "Purpose-built for contract drafting and review", description: "AI legal assistant built for drafting, reviewing, and negotiating contracts directly in Microsoft Word.", steps: ["Sign up at spellbook.legal", "Install the Word add-in", "Open a contract and let Spellbook suggest edits"], url: "https://www.spellbook.legal" },
      { name: "Perplexity", emoji: "🔍", color: "#34d399", model: "Perplexity Pro", free: true, rank: 3, why_best: "Web-searched legal research with cited sources", description: "Research laws, regulations, and legal precedents with cited sources.", steps: ["Go to perplexity.ai", "Ask your legal question", "Check the cited legal sources"], url: "https://perplexity.ai" },
    ],
  },

  // --- AI COMPANIONS ---
  companion: {
    summary: "AI companions can be conversational partners, emotional support, coaches, or language practice partners. Here are the best options depending on what you're looking for.",
    tools: [
      { name: "Character.ai", emoji: "🎭", color: "#a78bfa", model: "Character AI", free: true, rank: 1, why_best: "Millions of unique AI personalities to talk to", description: "Chat with AI characters — fictional, historical, or custom. Great for conversation and entertainment.", steps: ["Go to character.ai", "Browse characters or create your own", "Start chatting"], url: "https://character.ai" },
      { name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true, rank: 2, why_best: "Most thoughtful and nuanced conversational partner", description: "Excellent for deep conversations, brainstorming, coaching, and thoughtful discussion.", steps: ["Go to claude.ai", "Start a conversation about any topic", "Ask follow-up questions naturally"], url: "https://claude.ai" },
      { name: "Replika", emoji: "💜", color: "#fb7185", model: "Replika AI", free: true, rank: 3, why_best: "Designed specifically for emotional companionship", description: "AI companion focused on emotional support, daily check-ins, and building a relationship over time.", steps: ["Download Replika app", "Create your AI companion", "Chat daily — it learns and adapts"], url: "https://replika.ai" },
    ],
  },

  // --- MARKETING ---
  marketing: {
    summary: "AI marketing tools handle everything from social media scheduling to ad campaign creation. They save hours of work and often improve results.",
    tools: [
      { name: "Buffer", emoji: "📱", color: "#34d399", model: "Buffer AI", free: true, rank: 1, why_best: "Simplest social media scheduler with AI content suggestions", description: "Schedule posts, get AI content ideas, and manage multiple social accounts.", steps: ["Sign up at buffer.com", "Connect your social accounts", "Use AI to generate and schedule posts"], url: "https://buffer.com" },
      { name: "Jasper", emoji: "✍️", color: "#f97316", model: "Jasper AI", free: false, rank: 2, why_best: "Purpose-built for marketing content at scale", description: "AI marketing platform for ads, emails, blogs, and social media copy.", steps: ["Sign up at jasper.ai", "Choose a content template", "Provide context and generate"], url: "https://jasper.ai" },
      { name: "Canva", emoji: "🎨", color: "#a78bfa", model: "Magic Studio", free: true, rank: 3, why_best: "Create visual marketing content with AI design tools", description: "Design social media graphics, ads, and marketing materials.", steps: ["Go to canva.com", "Choose a social media template", "Use Magic Studio to customise"], url: "https://www.canva.com" },
    ],
  },

  // --- EDUCATION ---
  education: {
    summary: "AI tutoring tools give you a personal teacher available 24/7. They adapt to your level, explain concepts clearly, and create practice exercises.",
    tools: [
      { name: "Khan Academy Khanmigo", emoji: "🎓", color: "#34d399", model: "Khanmigo AI", free: true, rank: 1, why_best: "Purpose-built AI tutor integrated with world-class curriculum", description: "AI tutor from Khan Academy. Guides you through problems, gives hints, and adapts to your level.", steps: ["Go to khanmigo.ai", "Choose a subject", "Ask questions and work through problems"], url: "https://www.khanmigo.ai" },
      { name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true, rank: 2, why_best: "Excellent at explaining any topic at any level", description: "Patient, clear explanations on any subject. Great for deep understanding.", steps: ["Go to claude.ai", "Say 'Teach me [topic] for a beginner'", "Ask follow-up questions"], url: "https://claude.ai" },
      { name: "Quizlet", emoji: "📝", color: "#a78bfa", model: "Quizlet AI", free: true, rank: 3, why_best: "Best for flashcards, quizzes, and active recall study", description: "AI-generated flashcards, practice tests, and study materials.", steps: ["Go to quizlet.com", "Search for your topic or create a set", "Use AI study tools to practise"], url: "https://quizlet.com" },
    ],
  },

  // --- HEALTH ---
  health: {
    summary: "AI health tools can help with fitness planning, nutrition, and wellness tracking. They're great for general guidance — always consult a doctor for medical concerns.",
    tools: [
      { name: "MyFitnessPal", emoji: "🥗", color: "#34d399", model: "AI Nutrition", free: true, rank: 1, why_best: "Best calorie and nutrition tracker with huge food database", description: "Track meals, count calories, and get AI nutritional insights. Huge food database.", steps: ["Download MyFitnessPal", "Set your goals", "Log meals by searching or scanning barcodes"], url: "https://www.myfitnesspal.com" },
      { name: "ChatGPT", emoji: "💬", color: "#6ee7f7", model: "GPT-4o", free: true, rank: 2, why_best: "Create personalised workout and meal plans from a conversation", description: "Generate custom workout plans, meal plans, and health routines.", steps: ["Go to chat.openai.com", "Describe your fitness goals and constraints", "Ask for a weekly plan"], url: "https://chat.openai.com" },
      { name: "Headspace", emoji: "🧘", color: "#a78bfa", model: "Headspace AI", free: false, rank: 3, why_best: "Guided meditation and mindfulness with personalised recommendations", description: "Meditation, sleep, and mindfulness with AI-personalised programs.", steps: ["Download Headspace", "Take the introductory course", "Follow daily recommendations"], url: "https://www.headspace.com" },
    ],
  },

  // --- FINANCE ---
  finance: {
    summary: "AI finance tools simplify bookkeeping, tax prep, and budgeting. They automate tedious work and help you make better financial decisions.",
    tools: [
      { name: "QuickBooks", emoji: "📒", color: "#34d399", model: "QuickBooks AI", free: false, rank: 1, why_best: "Most popular small business accounting with AI automation", description: "Automated bookkeeping, invoicing, and expense tracking with AI categorisation.", steps: ["Sign up at quickbooks.com", "Connect your bank account", "Let AI categorise your transactions"], url: "https://quickbooks.intuit.com" },
      { name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true, rank: 2, why_best: "Analyse financial data and get plain-English insights", description: "Upload financial documents, spreadsheets, or data for analysis and insights.", steps: ["Go to claude.ai", "Upload your financial data or spreadsheet", "Ask specific questions about your finances"], url: "https://claude.ai" },
      { name: "YNAB", emoji: "💳", color: "#a78bfa", model: "YNAB", free: false, rank: 3, why_best: "Best personal budgeting tool with zero-based budgeting", description: "Zero-based budgeting app that helps you give every dollar a job.", steps: ["Sign up at ynab.com", "Connect your accounts", "Assign every dollar to a budget category"], url: "https://www.ynab.com" },
    ],
  },

  // --- DATA ---
  data: {
    summary: "AI data tools help you analyse, visualise, and clean data without needing to code. Upload a spreadsheet and get instant insights.",
    tools: [
      { name: "Julius AI", emoji: "📊", color: "#6ee7f7", model: "Julius", free: true, rank: 1, why_best: "Upload data and ask questions in plain English", description: "Upload CSV, Excel, or Google Sheets and ask questions. Creates charts automatically.", steps: ["Go to julius.ai", "Upload your data file", "Ask questions like 'What are the trends?'"], url: "https://julius.ai" },
      { name: "ChatGPT Data Analysis", emoji: "💬", color: "#34d399", model: "GPT-4o", free: true, rank: 2, why_best: "Analyse data, create charts, and write Python code", description: "Upload spreadsheets and get analysis, charts, and insights.", steps: ["Go to chat.openai.com", "Upload a CSV or Excel file", "Ask for analysis or visualisations"], url: "https://chat.openai.com" },
      { name: "Tableau", emoji: "📈", color: "#a78bfa", model: "Tableau AI", free: false, rank: 3, why_best: "Professional-grade dashboards and data visualisation", description: "Industry-standard data visualisation with AI-powered insights.", steps: ["Sign up at tableau.com", "Connect your data source", "Drag and drop to create visualisations"], url: "https://www.tableau.com" },
    ],
  },

  // --- TRANSLATION ---
  translation: {
    summary: "AI translation tools have become remarkably accurate. For quick translations use DeepL; for learning a new language, try Duolingo's AI features.",
    tools: [
      { name: "DeepL", emoji: "🔄", color: "#6ee7f7", model: "DeepL AI", free: true, rank: 1, why_best: "Most accurate AI translator — beats Google Translate for most languages", description: "Translate text, documents, and PDFs with remarkable accuracy and natural phrasing.", steps: ["Go to deepl.com", "Paste text or upload a document", "Choose your target language"], url: "https://www.deepl.com" },
      { name: "Duolingo", emoji: "🦉", color: "#34d399", model: "Duolingo Max", free: true, rank: 2, why_best: "Best app for learning a new language with AI conversation practice", description: "Learn any language with AI lessons, conversation practice, and gamification.", steps: ["Download Duolingo", "Choose your language", "Complete daily lessons"], url: "https://www.duolingo.com" },
      { name: "Claude.ai", emoji: "🧠", color: "#a78bfa", model: "Claude claude-opus-4-6", free: true, rank: 3, why_best: "Translate with cultural context and explanations of nuance", description: "Translate text with cultural nuance, explain idioms, and practice conversations.", steps: ["Go to claude.ai", "Paste text and ask to translate", "Ask about nuances or practice dialogue"], url: "https://claude.ai" },
    ],
  },
};

// Fallback for general/unmatched queries
export const FALLBACK_RESULT = {
  summary: "Here are some versatile AI tools that can help with almost any task. They're all beginner-friendly and have free options.",
  tools: [
    { name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true, rank: 1, why_best: "Most versatile AI assistant for any task", description: "Great for writing, coding, analysis, research, and creative tasks.", steps: ["Go to claude.ai", "Type your question in plain English", "Refine with follow-up messages"], url: "https://claude.ai" },
    { name: "ChatGPT", emoji: "💬", color: "#34d399", model: "GPT-4o", free: true, rank: 2, why_best: "Good at everything with image and voice features", description: "Versatile assistant with writing, coding, brainstorming, and multimedia.", steps: ["Go to chat.openai.com", "Sign up free and start chatting", "Try uploading images or using voice"], url: "https://chat.openai.com" },
    { name: "Perplexity", emoji: "🔍", color: "#a78bfa", model: "Perplexity Pro", free: true, rank: 3, why_best: "Best for research and finding up-to-date information", description: "AI-powered search with cited sources for research and fact-checking.", steps: ["Go to perplexity.ai", "Ask any question", "Check the sources it cites"], url: "https://perplexity.ai" },
  ],
};
