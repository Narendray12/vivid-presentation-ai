"use server";
import { client } from "@/lib/prisma";
import { ContentItem, ContentType, Slide } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";
import { jsonrepair } from "jsonrepair";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export const generateCreativePrompt = async (userPrompt: string) => {
  const finalPrompt = `
    Create a coherent and relevant outline for the following prompt: ${userPrompt}.
    The outline should consist of at least 6 points, with each point written as a single sentence.
    Ensure the outline is well-structured and directly related to the topic.
    Return the output in the following JSON format:

    {
        "outlines": [
            "Point 1",
            "Point 2",
            "Point 3",
            "Point 4",
            "Point 5",
            "Point 6"
        ]
    }

    Ensure that the JSON is valid and properly formatted. Do not include any other text or explanations outside the JSON.
  `;

  try {
    const result = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: finalPrompt }],
      temperature: 0.0,
      max_tokens: 1000,
    });

    let textResponse = result.choices[0].message.content;

    console.log("Raw Response Text:", textResponse);

    // Strip triple backticks and optional language tag
    if (textResponse?.startsWith("```")) {
      textResponse = textResponse
        .replace(/^```[a-z]*\n?/, "")
        .replace(/```$/, "");
    }

    if (textResponse) {
      try {
        const jsonResponse = JSON.parse(textResponse);
        if (jsonResponse.outlines) {
          return { status: 200, data: jsonResponse.outlines };
        } else {
          return { status: 400, error: "Invalid response structure" };
        }
      } catch (error) {
        console.error("JSON parse error:", error);
        return { status: 500, error: "Failed to parse JSON from AI response" };
      }
    } else {
      return { status: 400, error: "No text in AI response" };
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { status: 500, error: "Internal server error" };
  }
};

const existingLayouts = [
  {
    id: uuidv4(),
    slideName: "Blank card",
    type: "blank-card",
    className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Accent left",
    type: "accentLeft",
    className: "min-h-[300px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      restrictDropTo: true,
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Resizable column",
          restrictToDrop: true,
          content: [
            {
              id: uuidv4(),
              type: "image" as ContentType,
              name: "Image",
              content:
                "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "Title",
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Accent Right",
    type: "accentRight",
    className: "min-h-[300px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Resizable column",
          restrictToDrop: true,
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
            {
              id: uuidv4(),
              type: "image" as ContentType,
              name: "Image",
              restrictToDrop: true,
              content:
                "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "Title",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Image and text",
    type: "imageAndText",
    className: "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Image and text",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "image" as ContentType,
                  name: "Image",
                  className: "p-3",
                  content:
                    "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "Title",
                },
              ],
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Text and image",
    type: "textAndImage",
    className: "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "image" as ContentType,
                  name: "Image",
                  className: "p-3",
                  content:
                    "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "Title",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Two columns",
    type: "twoColumns",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Two columns with headings",
    type: "twoColumnsWithHeadings",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading3" as ContentType,
                  name: "Heading3",
                  content: "",
                  placeholder: "Heading 3",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading3" as ContentType,
                  name: "Heading3",
                  content: "",
                  placeholder: "Heading 3",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Three column",
    type: "threeColumns",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
          ],
        },
      ],
    },
  },
];

const findImageComponents = (layout: ContentItem): ContentItem[] => {
  const images = [];
  if (layout.type === "image") {
    images.push(layout);
  }
  if (Array.isArray(layout.content)) {
    layout.content.forEach((child) => {
      images.push(...findImageComponents(child as ContentItem));
    });
  } else if (layout.content && typeof layout.content === "object") {
    images.push(...findImageComponents(layout.content));
  }
  return images;
};

const generateImageUrl = async (prompt: string): Promise<string> => {
  try {
    const improvedPrompt = `
Create a highly realistic, professional image based on the
following description. The image should look as if captured in
real life, with attention to detail, lighting, and texture.

Description: ${prompt}

Important Notes:
- The image must be in a photorealistic style and visually compelling.
- Ensure all text, signs, or visible writing in the image are in English.
- Pay special attention to lighting, shadows, and textures to make the image as lifelike as possible.
- Avoid elements that appear abstract, cartoonish, or overly artistic. The image should be suitable for professional presentations.
- Focus on accurately depicting the concept described, including specific objects, environment, mood, and context. Maintain relevance to the description provided.

Example Use Cases: Business presentations, educational slides, professional designs.
`;

    const completion = await openai.images.generate({
      prompt: improvedPrompt,
      n: 1,
      size: "1024x1024",
    });
    const imageUrl = completion.data?.[0]?.url ?? null;
    console.log("Image generated Succesfully", imageUrl);
    return imageUrl || "https://via.placeholder.com/1024x1024";
  } catch (error) {
    console.log("Error generating image", error);
    return "https://via.placeholder.com/1024x1024";
  }
};
const replaceImagePlaceholders = async (layout: Slide) => {
  const imageComponents = findImageComponents(layout.content);
  console.log("imageComponents", imageComponents);
  for (const component of imageComponents) {
    console.log("generating image for component", component.alt);
    component.content = await generateImageUrl(
      component.alt || "Placeholder Image"
    );
  }
  return layout;
};

const generateLayoutJson = async (outlines: string[]) => {
  const prompt = `
### ROLE
You are a creative JSON layout generator for presentations. Strictly follow these rules:

### OUTPUT REQUIREMENTS
1. Generate ONLY these layout types: 
   "accentLeft", "accentRight", "imageAndText", "textAndImage", "twoColumns", 
   "twoColumnswithHeadings", "threeColumns", "threeColumnswithHeadings", 
   "fourColumns", "twoImageColumns", "threeImageColumns", "fourImageColumns", "tableLayout"

2. Use ONLY these content types:
   "heading1", "heading2", "heading3", "heading4", "title", "paragraph", 
   "table", "resizable-column", "image", "blockquote", "numberedList", 
   "bulletList", "todolist", "calloutBox", "codeBlock", "tableOfContents", 
   "divider", "column"

3. Output format: Array of JSON objects

### CONTENT RULES
- ALL layouts must start with a 'column' as root container
- For multi-element containers (resizable-column/column): 
   • 'content' must be ARRAY of objects
   • Minimum 2 elements when used
- For static elements (title/paragraph): 
   • 'content' must be STRING 
   • Generate REALISTIC placeholder text matching outline topics
- Images: 
   • Use descriptive Unsplash placeholders (1024x768) 
   • Format: "https://source.unsplash.com/random/1024x768/?[TOPIC]"
- Ensure 3 levels of uniqueness:
   1. Layout combinations
   2. Content hierarchy
   3. Placeholder text/images

### STRUCTURE TEMPLATE
{
  "slideName": "Unique Slide Name",  // Descriptive name
  "type": "layoutType",             // From approved list
  "className": "tailwind-classes",  // Maintain given patterns
  "content": {                      // MUST start with column!
    "id": "uuidv4()",
    "type": "column",
    "name": "Column",
    "content": [                    // Array of elements
      {
        "id": "uuidv4()",
        "type": "elementType",      // From content types
        "name": "Descriptive Name",
        "content": "" | [] | {},   // Type-appropriate
        "placeholder": "Text hint"  // When empty string
        // ... other properties
      }
    ]
  }
}

### CRITICAL INSTRUCTIONS
1. Use ${outlines} for thematic content
2. NEVER invent new layout/content types
3. Maintain EXACT property casing shown in examples
4. For tables: Include 'headers' array and 'rows' matrix
5. In resizable-column: 
   • Always include 'restrictToDrop: true' 
   • Minimum 2 child elements
6. Generate 5-7 layouts per outline with:
   • Varied structure depth (1-3 nesting levels)
   • Logical content grouping
   • Semantic placeholder text

### EXAMPLES
Simple layout:
{
  "slideName": "Introduction",
  "type": "accentLeft",
  "className": "min-h-[300px]",
  "content": {
    "id": "col-001",
    "type": "column",
    "content": [
      {
        "id": "title-001",
        "type": "title",
        "content": "Digital Transformation",
        "placeholder": "Main Topic Title"
      }
    ]
  }
}

Complex layout (note nesting):
{
  "slideName": "Market Analysis",
  "type": "twoColumnswithHeadings",
  "content": {
    "id": "root-col",
    "type": "column",
    "content": [
      {
        "id": "res-col-1",
        "type": "resizable-column",
        "restrictToDrop": true,
        "content": [
          {
            "id": "img-01",
            "type": "image",
            "content": "https://source.unsplash.com/random/1024x768/?tech,innovation"
          },
          {
            "id": "col-sub1",
            "type": "column",
            "content": [
              {
                "id": "h3-01",
                "type": "heading3",
                "content": "Key Trends",
                "placeholder": "Section Header"
              },
              {
                "id": "list-01",
                "type": "bulletList",
                "content": [
                  "AI adoption rates",
                  "Remote work infrastructure",
                  "Cybersecurity investments"
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}`;

  try {
    console.log("Genration Started");
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "You generate JSON layouts for presentations",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const responseContent = completion.choices?.[0]?.message?.content;

    if (!responseContent) {
      return { status: 400, error: "No response from AI" };
    }
    let jsonResponse;
    try {
      const cleaned = jsonrepair(
        responseContent.replace(/^```json|```$/g, "").trim()
      );
      jsonResponse = JSON.parse(cleaned);
      await Promise.all(jsonResponse.map(replaceImagePlaceholders));
    } catch (error) {
      console.error("JSON parse error:", error);
      return { status: 500, error: "Failed to parse JSON from AI response" };
    }
    return { status: 200, data: jsonResponse };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { status: 500, error: "Internal server error" };
  }
};
export const generateLayouts = async (projectId: string, theme: string) => {
  try {
    if (!projectId) {
      return { status: 400, error: "Project not found" };
    }
    const user = await currentUser();
    if (!user) {
      return { status: 403, error: "User not authenticated" };
    }
    const userExist = await client.user.findUnique({
      where: {
        clerk_id: user.id,
      },
    });

    if (!userExist || !userExist.subscription) {
      return {
        status: 403,
        error: !userExist?.subscription
          ? "User not subscribed"
          : "User not authenticated",
      };
    }
    const project = await client.projects.findUnique({
      where: {
        id: projectId,
        isDeleted: false,
      },
    });

    if (!project) {
      return { status: 404, error: "Project not found" };
    }

    if (!project.outlines || project.outlines.length === 0) {
      return { status: 400, error: "No outlines found" };
    }

    const layouts = await generateLayoutJson(project.outlines);

    if (layouts.status !== 200) {
      return layouts;
    }
    await client.projects.update({
      where: {
        id: projectId,
      },
      data: {
        slides: layouts.data,
        themeName: theme,
      },
    });
    return { status: 200, data: layouts.data };
  } catch (error) {
    console.log(error);
    return { status: 500, error: "Internal server error" };
  }
};
