// Pre-built knowledge base for offline/cached recommendations
// Organized by category with sub-category branching

export const SUB_CATEGORIES = {
  photo: {
    question: "What would you like to do with images?",
    options: [
      { id: "photo_generate", label: "🎨 Generate new images", prompt: "generating AI images from text prompts and descriptions" },
      { id: "photo_edit", label: "✂️ Edit existing photos", prompt: "editing, enhancing, retouching, or removing backgrounds from existing photos" },
    ],
  },
  coding: {
    question: "What kind of coding help do you need?",
    options: [
      { id: "coding_build", label: "🏗️ Build something new", prompt: "building a new app, website, or software project from scratch" },
      { id: "coding_debug", label: "🐛 Fix or improve code", prompt: "debugging, fixing errors, or improving existing code" },
      { id: "coding_learn", label: "📚 Learn to code", prompt: "learning to code as a complete beginner" },
    ],
  },
  video: {
    question: "What kind of video work?",
    options: [
      { id: "video_generate", label: "🎬 Generate video from text", prompt: "generating video content from text descriptions using AI" },
      { id: "video_edit", label: "✂️ Edit existing video", prompt: "editing, trimming, adding effects to existing video footage" },
    ],
  },
  writing: {
    question: "What are you writing?",
    options: [
      { id: "writing_blog", label: "📝 Blog or article", prompt: "writing blog posts, articles, or long-form content" },
      { id: "writing_marketing", label: "📣 Marketing copy", prompt: "writing marketing copy, ads, social media posts, or email campaigns" },
      { id: "writing_creative", label: "✨ Creative writing", prompt: "creative writing, fiction, scripts, or storytelling" },
    ],
  },
  music: {
    question: "What would you like to create?",
    options: [
      { id: "music_generate", label: "🎶 Generate music", prompt: "generating music tracks, beats, or background music using AI" },
      { id: "music_voice", label: "🎙️ Voice & speech", prompt: "text-to-speech, voice cloning, or voice-over generation" },
    ],
  },
  design: {
    question: "What kind of design?",
    options: [
      { id: "design_graphic", label: "🎯 Graphic design", prompt: "creating logos, social media graphics, or marketing materials" },
      { id: "design_ui", label: "📱 UI/UX design", prompt: "designing user interfaces, app mockups, or website layouts" },
      { id: "design_3d", label: "🧊 3D modeling", prompt: "creating 3D models, renders, or animations" },
    ],
  },
};

export const KNOWLEDGE_BASE = {
  photo_generate: {
    summary: "To generate images from text, you'll describe what you want and AI creates it. Start with free tools like Google's ImageFX, then explore paid options for more control.",
    tools: [
      {
        name: "Google ImageFX",
        emoji: "✨",
        color: "#6ee7f7",
        model: "Imagen 3",
        free: true,
        description: "Google's free AI image generator powered by Imagen 3. Type a description and get stunning images in seconds. Great for beginners with no account needed.",
        steps: ["Go to imagefx.google.com", "Type what you want to see (e.g. 'a cat astronaut on the moon')", "Click Generate and pick your favourite result"],
        url: "https://imagefx.google.com",
      },
      {
        name: "Adobe Firefly",
        emoji: "🦋",
        color: "#a78bfa",
        model: "Firefly Image 3",
        free: true,
        description: "Adobe's AI image generator with great style controls. Free tier gives 25 credits/month. Results are commercially safe to use, which is unique among free tools.",
        steps: ["Visit firefly.adobe.com and sign up free", "Choose 'Text to Image' and type your description", "Use the style options to refine your result"],
        url: "https://firefly.adobe.com",
      },
      {
        name: "Midjourney",
        emoji: "🎨",
        color: "#f97316",
        model: "Midjourney v6.1",
        free: false,
        description: "The gold standard for AI art. Produces incredibly artistic and detailed images. Requires a paid subscription ($10/mo) but the quality is unmatched.",
        steps: ["Go to midjourney.com and subscribe to Basic plan", "Open the web app and type /imagine followed by your prompt", "Pick your favourite from 4 options and upscale it"],
        url: "https://midjourney.com",
      },
    ],
  },
  photo_edit: {
    summary: "For editing photos with AI, you can remove objects, enhance quality, or change backgrounds. These tools make professional edits easy for anyone.",
    tools: [
      {
        name: "Canva Magic Studio",
        emoji: "🪄",
        color: "#34d399",
        model: "Canva AI",
        free: true,
        description: "Canva's built-in AI tools let you remove backgrounds, erase objects, and enhance photos with one click. Free tier includes basic AI edits.",
        steps: ["Go to canva.com and upload your photo", "Click 'Edit Image' and choose Magic Eraser or Background Remover", "Download your edited image"],
        url: "https://www.canva.com",
      },
      {
        name: "Cleanup.pictures",
        emoji: "🧹",
        color: "#fb7185",
        model: "LaMa inpainting",
        free: true,
        description: "Dead-simple tool for removing unwanted objects from photos. Just paint over what you want gone and AI fills in the background naturally.",
        steps: ["Go to cleanup.pictures", "Upload your photo", "Paint over the object you want removed — done!"],
        url: "https://cleanup.pictures",
      },
      {
        name: "Adobe Photoshop",
        emoji: "🖌️",
        color: "#6ee7f7",
        model: "Firefly + Generative Fill",
        free: false,
        description: "The industry standard now has powerful AI built in. Generative Fill lets you add, remove, or modify anything in your photos with text descriptions.",
        steps: ["Subscribe to Photoshop ($22/mo) or use the free trial", "Open your image, select an area with the Lasso tool", "Click Generative Fill and describe what you want"],
        url: "https://www.adobe.com/products/photoshop.html",
      },
    ],
  },
  photo: {
    summary: "There are great AI tools for both creating and editing images. For generating new images try Google ImageFX (free) or Midjourney (paid). For editing, try Canva or Cleanup.pictures.",
    tools: [
      {
        name: "Google ImageFX", emoji: "✨", color: "#6ee7f7", model: "Imagen 3", free: true,
        description: "Google's free AI image generator. Type a description and get stunning images. No account required.",
        steps: ["Go to imagefx.google.com", "Describe your image in words", "Generate and download"],
        url: "https://imagefx.google.com",
      },
      {
        name: "Canva Magic Studio", emoji: "🪄", color: "#34d399", model: "Canva AI", free: true,
        description: "All-in-one design tool with AI photo editing, background removal, and image generation built in.",
        steps: ["Sign up at canva.com", "Upload a photo or start a new design", "Use Magic Studio tools to edit or generate"],
        url: "https://www.canva.com",
      },
      {
        name: "Midjourney", emoji: "🎨", color: "#f97316", model: "v6.1", free: false,
        description: "Premium AI art generator producing incredibly artistic results. The best for creative image generation.",
        steps: ["Subscribe at midjourney.com ($10/mo)", "Use the web app to type prompts", "Select and upscale your favourites"],
        url: "https://midjourney.com",
      },
    ],
  },
  coding_build: {
    summary: "To build something new, AI coding assistants can write code for you as you describe what you want. Start with Cursor — it's like having a senior developer pair-programming with you.",
    tools: [
      {
        name: "Cursor", emoji: "⚡", color: "#a78bfa", model: "Claude claude-sonnet-4-20250514", free: true,
        description: "An AI-first code editor that can build entire apps from descriptions. Has a generous free tier and supports Claude and GPT models. Perfect for beginners.",
        steps: ["Download Cursor from cursor.com", "Open it and describe what you want to build in the chat", "Let Cursor generate the code, then click 'Accept' to apply"],
        url: "https://cursor.com",
      },
      {
        name: "Replit", emoji: "🔄", color: "#f97316", model: "Replit AI Agent", free: true,
        description: "Code in your browser with an AI assistant. No setup needed — just describe your app and Replit builds, runs, and deploys it for you.",
        steps: ["Go to replit.com and sign up free", "Click 'Create Repl' and describe your project", "Use the AI Agent to build and iterate"],
        url: "https://replit.com",
      },
      {
        name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true,
        description: "Anthropic's AI assistant excels at writing, explaining, and debugging code. Great for getting complete code snippets you can paste into any editor.",
        steps: ["Go to claude.ai and sign up free", "Describe what you want to build in plain English", "Copy the generated code into your project"],
        url: "https://claude.ai",
      },
    ],
  },
  coding_debug: {
    summary: "AI is excellent at finding and fixing bugs. Paste your error message or code, and these tools will explain the problem and suggest fixes in plain English.",
    tools: [
      {
        name: "Cursor", emoji: "⚡", color: "#a78bfa", model: "Claude claude-sonnet-4-20250514", free: true,
        description: "Open your buggy code in Cursor, select the error, and ask the AI to fix it. It understands your whole project context.",
        steps: ["Open your project in Cursor", "Select the broken code or paste the error", "Press Cmd+K and describe the problem"],
        url: "https://cursor.com",
      },
      {
        name: "ChatGPT", emoji: "💬", color: "#34d399", model: "GPT-4o", free: true,
        description: "Paste your error message and code into ChatGPT. It'll explain the bug in beginner-friendly language and give you the fix.",
        steps: ["Go to chat.openai.com", "Paste your error message and the relevant code", "Ask 'What's wrong and how do I fix it?'"],
        url: "https://chat.openai.com",
      },
    ],
  },
  coding_learn: {
    summary: "AI makes learning to code much easier. These tools can explain concepts, generate practice exercises, and give you feedback as you write code.",
    tools: [
      {
        name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true,
        description: "Excellent at teaching coding concepts. Ask it to explain anything, create exercises, or review your code with detailed feedback.",
        steps: ["Go to claude.ai", "Ask 'Teach me Python basics' or any topic", "Follow along and ask questions as you go"],
        url: "https://claude.ai",
      },
      {
        name: "Replit", emoji: "🔄", color: "#f97316", model: "Replit AI", free: true,
        description: "Learn by doing in the browser. Write code, run it instantly, and get AI help when you're stuck. No setup required.",
        steps: ["Sign up at replit.com", "Choose a tutorial or start a new project", "Use the AI assistant to help you learn"],
        url: "https://replit.com",
      },
    ],
  },
  coding: {
    summary: "AI coding tools can help you build apps, fix bugs, and learn programming. Cursor and Claude are the top choices for writing code with AI assistance.",
    tools: [
      {
        name: "Cursor", emoji: "⚡", color: "#a78bfa", model: "Claude claude-sonnet-4-20250514", free: true,
        description: "AI-first code editor: describe what you want, and it writes the code. Free tier available.",
        steps: ["Download from cursor.com", "Describe your project in the chat", "Accept generated code and iterate"],
        url: "https://cursor.com",
      },
      {
        name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true,
        description: "Excellent for generating, explaining, and debugging code. Great as a coding tutor.",
        steps: ["Go to claude.ai", "Describe what you want to build", "Copy the code into your project"],
        url: "https://claude.ai",
      },
      {
        name: "Replit", emoji: "🔄", color: "#f97316", model: "Replit Agent", free: true,
        description: "Build and deploy apps entirely in the browser with AI assistance. Zero setup needed.",
        steps: ["Go to replit.com", "Describe your app to the Agent", "Deploy with one click"],
        url: "https://replit.com",
      },
    ],
  },
  video: {
    summary: "AI video tools can generate clips from text or help you edit existing footage. Most have free trials so you can experiment.",
    tools: [
      {
        name: "Runway", emoji: "🎬", color: "#a78bfa", model: "Gen-3 Alpha", free: true,
        description: "Industry-leading AI video generation. Create short video clips from text descriptions or images. Free trial included.",
        steps: ["Sign up at runwayml.com", "Choose 'Text to Video' or 'Image to Video'", "Describe your clip and generate"],
        url: "https://runwayml.com",
      },
      {
        name: "CapCut", emoji: "✂️", color: "#34d399", model: "CapCut AI", free: true,
        description: "Free video editor with powerful AI features: auto-captions, background removal, and smart editing tools.",
        steps: ["Download CapCut or use the web version", "Import your video footage", "Use AI tools like auto-captions and smart cut"],
        url: "https://www.capcut.com",
      },
      {
        name: "Pika", emoji: "🎞️", color: "#f97316", model: "Pika 2.0", free: true,
        description: "Simple AI video generator focused on creativity. Turn text or images into short animated clips with unique styles.",
        steps: ["Go to pika.art and sign up", "Type a description of your video", "Choose a style and generate"],
        url: "https://pika.art",
      },
    ],
  },
  writing: {
    summary: "AI writing assistants can help draft, edit, and improve any kind of text. Claude and ChatGPT are the top choices for quality writing.",
    tools: [
      {
        name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true,
        description: "Best-in-class for nuanced, well-structured writing. Excels at long-form content, analysis, and matching your tone.",
        steps: ["Go to claude.ai", "Describe what you need written and the tone", "Refine by giving feedback on the draft"],
        url: "https://claude.ai",
      },
      {
        name: "ChatGPT", emoji: "💬", color: "#34d399", model: "GPT-4o", free: true,
        description: "Versatile writing assistant for any task. Great at brainstorming, drafting, and rewriting content in different styles.",
        steps: ["Go to chat.openai.com", "Describe your writing task", "Ask for revisions or different approaches"],
        url: "https://chat.openai.com",
      },
      {
        name: "Notion AI", emoji: "📓", color: "#a78bfa", model: "Notion AI", free: false,
        description: "AI built into Notion's workspace. Perfect if you already use Notion — generates, edits, and summarises content in-place.",
        steps: ["Open a Notion page", "Press Space and select an AI action", "Choose 'Write', 'Summarise', or 'Edit'"],
        url: "https://www.notion.so/product/ai",
      },
    ],
  },
  music: {
    summary: "AI can now generate full music tracks, sound effects, and even clone voices. Most tools offer free tiers to get you started.",
    tools: [
      {
        name: "Suno", emoji: "🎵", color: "#fb7185", model: "Suno v4", free: true,
        description: "Generate complete songs with vocals from a text description. Pick a genre, describe the mood, and Suno creates a full track.",
        steps: ["Go to suno.com and sign up", "Describe your song (genre, mood, topic)", "Generate and download your track"],
        url: "https://suno.com",
      },
      {
        name: "Udio", emoji: "🎶", color: "#a78bfa", model: "Udio v1.5", free: true,
        description: "AI music generator with impressive vocal quality. Create songs in any genre with customisable lyrics and styles.",
        steps: ["Visit udio.com and create an account", "Enter a prompt describing your song", "Extend or remix the generated music"],
        url: "https://udio.com",
      },
      {
        name: "ElevenLabs", emoji: "🎙️", color: "#6ee7f7", model: "ElevenLabs v3", free: true,
        description: "Industry-leading text-to-speech and voice cloning. Create realistic voiceovers in hundreds of voices and languages.",
        steps: ["Sign up at elevenlabs.io", "Choose a voice or clone your own", "Type your script and generate audio"],
        url: "https://elevenlabs.io",
      },
    ],
  },
  research: {
    summary: "AI research tools can help you find, understand, and summarise information quickly. They're like having a research assistant available 24/7.",
    tools: [
      {
        name: "Perplexity", emoji: "🔍", color: "#6ee7f7", model: "Perplexity Pro", free: true,
        description: "AI-powered search engine that gives direct answers with citations. Perfect for research — it shows you exactly where information comes from.",
        steps: ["Go to perplexity.ai", "Ask your research question in plain English", "Check the cited sources for verification"],
        url: "https://perplexity.ai",
      },
      {
        name: "Claude.ai", emoji: "🧠", color: "#a78bfa", model: "Claude claude-opus-4-6", free: true,
        description: "Excellent for deep analysis, summarising long documents, and explaining complex topics in simple terms.",
        steps: ["Go to claude.ai", "Upload a document or ask your question", "Ask follow-up questions to dig deeper"],
        url: "https://claude.ai",
      },
      {
        name: "NotebookLM", emoji: "📒", color: "#34d399", model: "Google Gemini", free: true,
        description: "Google's AI notebook that reads your documents and lets you chat with them. Upload PDFs, articles, or notes and ask questions.",
        steps: ["Go to notebooklm.google.com", "Upload your research documents", "Ask questions about the content"],
        url: "https://notebooklm.google.com",
      },
    ],
  },
  business: {
    summary: "AI can automate repetitive tasks, create presentations, and manage workflows. These tools save hours of manual work each week.",
    tools: [
      {
        name: "Microsoft Copilot", emoji: "🤖", color: "#6ee7f7", model: "GPT-4o + Microsoft Graph", free: false,
        description: "AI built into Word, Excel, PowerPoint, and Outlook. Automates document creation, data analysis, and email drafting.",
        steps: ["Get Microsoft 365 Copilot subscription", "Open any Office app and click the Copilot icon", "Describe what you need in plain English"],
        url: "https://copilot.microsoft.com",
      },
      {
        name: "Gamma", emoji: "📊", color: "#f97316", model: "Gamma AI", free: true,
        description: "Create beautiful presentations in seconds. Describe your topic and Gamma generates a full slide deck with design.",
        steps: ["Go to gamma.app", "Click 'Generate' and describe your presentation", "Customise the slides and share"],
        url: "https://gamma.app",
      },
      {
        name: "Zapier", emoji: "⚡", color: "#a78bfa", model: "Zapier AI", free: true,
        description: "Automate workflows between apps. Connect your tools and let AI handle repetitive tasks like data entry and notifications.",
        steps: ["Sign up at zapier.com", "Describe the workflow you want to automate", "Connect your apps and activate"],
        url: "https://zapier.com",
      },
    ],
  },
  design: {
    summary: "AI design tools make professional graphic design accessible to everyone. Create logos, social graphics, and UI mockups without design experience.",
    tools: [
      {
        name: "Canva", emoji: "🎨", color: "#34d399", model: "Magic Studio", free: true,
        description: "All-in-one design platform with AI tools for creating social media graphics, presentations, logos, and more. Drag-and-drop interface.",
        steps: ["Sign up at canva.com", "Choose a template or start blank", "Use Magic Studio AI to generate or edit designs"],
        url: "https://www.canva.com",
      },
      {
        name: "Figma AI", emoji: "📐", color: "#a78bfa", model: "Figma AI", free: true,
        description: "Professional UI/UX design tool with AI features. Generate designs from descriptions and auto-layout. Free for personal use.",
        steps: ["Sign up at figma.com", "Create a new design file", "Use AI features to generate UI components"],
        url: "https://www.figma.com",
      },
      {
        name: "Looka", emoji: "💎", color: "#fb7185", model: "Looka AI", free: false,
        description: "AI logo maker. Enter your brand name, pick styles you like, and get dozens of professional logo options instantly.",
        steps: ["Go to looka.com", "Enter your brand name and preferences", "Browse generated logos and customise your favourite"],
        url: "https://looka.com",
      },
    ],
  },
};

// Fallback for general/unmatched queries
export const FALLBACK_RESULT = {
  summary: "Here are some versatile AI tools that can help with almost any task. They're all beginner-friendly and have free options.",
  tools: [
    {
      name: "Claude.ai", emoji: "🧠", color: "#6ee7f7", model: "Claude claude-opus-4-6", free: true,
      description: "Anthropic's AI assistant — great for writing, coding, analysis, research, and creative tasks. Excellent at following complex instructions.",
      steps: ["Go to claude.ai and sign up free", "Type your question or task in plain English", "Refine the results with follow-up messages"],
      url: "https://claude.ai",
    },
    {
      name: "ChatGPT", emoji: "💬", color: "#34d399", model: "GPT-4o", free: true,
      description: "OpenAI's versatile assistant. Good at everything from writing to coding to brainstorming. Has image and voice features built in.",
      steps: ["Go to chat.openai.com", "Sign up free and start chatting", "Try uploading images or using voice mode"],
      url: "https://chat.openai.com",
    },
    {
      name: "Perplexity", emoji: "🔍", color: "#a78bfa", model: "Perplexity Pro", free: true,
      description: "AI-powered search with cited sources. Best for research, fact-checking, and finding up-to-date information.",
      steps: ["Go to perplexity.ai", "Ask any question", "Check the sources it cites"],
      url: "https://perplexity.ai",
    },
  ],
};
