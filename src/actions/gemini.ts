"use server";
import layout from "@/app/(protected)/layout";
import { client } from "@/lib/prisma";
import { ContentItem, ContentType, Slide } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { Content, GoogleGenAI, Modality } from "@google/genai";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const ai = new GoogleGenAI({ apiKey: process.env.GEMENI_KEY });

export const generateCreativePrompt = async (userPrompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMENI_KEY });

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
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
      config: {
        maxOutputTokens: 1000,
        temperature: 0.0,
      },
    });

    let textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

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
      slideName: 'Blank card',
      type: 'blank-card',
      className: 'p-8 mx-auto flex justify-center items-center min-h-[200px]',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        content: [
          {
            id: uuidv4(),
            type: 'title' as ContentType,
            name: 'Title',
            content: '',
            placeholder: 'Untitled Card',
          },
        ],
      },
    },
  
    {
      id: uuidv4(),
      slideName: 'Accent left',
      type: 'accentLeft',
      className: 'min-h-[300px]',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        restrictDropTo: true,
        content: [
          {
            id: uuidv4(),
            type: 'resizable-column' as ContentType,
            name: 'Resizable column',
            restrictToDrop: true,
            content: [
              {
                id: uuidv4(),
                type: 'image' as ContentType,
                name: 'Image',
                content:
                  'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                alt: 'Title',
              },
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: 'Column',
                content: [
                  {
                    id: uuidv4(),
                    type: 'heading1' as ContentType,
                    name: 'Heading1',
                    content: '',
                    placeholder: 'Heading1',
                  },
                  {
                    id: uuidv4(),
                    type: 'paragraph' as ContentType,
                    name: 'Paragraph',
                    content: '',
                    placeholder: 'start typing here',
                  },
                ],
                className: 'w-full h-full p-8 flex justify-center items-center',
                placeholder: 'Heading1',
              },
            ],
          },
        ],
      },
    },
  
    {
      id: uuidv4(),
      slideName: 'Accent Right',
      type: 'accentRight',
      className: 'min-h-[300px]',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        content: [
          {
            id: uuidv4(),
            type: 'resizable-column' as ContentType,
            name: 'Resizable column',
            restrictToDrop: true,
            content: [
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: 'Column',
                content: [
                  {
                    id: uuidv4(),
                    type: 'heading1' as ContentType,
                    name: 'Heading1',
                    content: '',
                    placeholder: 'Heading1',
                  },
                  {
                    id: uuidv4(),
                    type: 'paragraph' as ContentType,
                    name: 'Paragraph',
                    content: '',
                    placeholder: 'start typing here',
                  },
                ],
                className: 'w-full h-full p-8 flex justify-center items-center',
                placeholder: 'Heading1',
              },
              {
                id: uuidv4(),
                type: 'image' as ContentType,
                name: 'Image',
                restrictToDrop: true,
                content:
                  'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                alt: 'Title',
              },
            ],
          },
        ],
      },
    },
  
    {
      id: uuidv4(),
      slideName: 'Image and text',
      type: 'imageAndText',
      className: 'min-h-[200px] p-8 mx-auto flex justify-center items-center',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        content: [
          {
            id: uuidv4(),
            type: 'resizable-column' as ContentType,
            name: 'Image and text',
            className: 'border',
            content: [
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: 'Column',
                content: [
                  {
                    id: uuidv4(),
                    type: 'image' as ContentType,
                    name: 'Image',
                    className: 'p-3',
                    content:
                      'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    alt: 'Title',
                  },
                ],
              },
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: 'Column',
                content: [
                  {
                    id: uuidv4(),
                    type: 'heading1' as ContentType,
                    name: 'Heading1',
                    content: '',
                    placeholder: 'Heading1',
                  },
                  {
                    id: uuidv4(),
                    type: 'paragraph' as ContentType,
                    name: 'Paragraph',
                    content: '',
                    placeholder: 'start typing here',
                  },
                ],
                className: 'w-full h-full p-8 flex justify-center items-center',
                placeholder: 'Heading1',
              },
            ],
          },
        ],
      },
    },
  
    {
      id: uuidv4(),
      slideName: 'Text and image',
      type: 'textAndImage',
      className: 'min-h-[200px] p-8 mx-auto flex justify-center items-center',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        content: [
          {
            id: uuidv4(),
            type: 'resizable-column' as ContentType,
            name: 'Text and image',
            className: 'border',
            content: [
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: '',
                content: [
                  {
                    id: uuidv4(),
                    type: 'heading1' as ContentType,
                    name: 'Heading1',
                    content: '',
                    placeholder: 'Heading1',
                  },
                  {
                    id: uuidv4(),
                    type: 'paragraph' as ContentType,
                    name: 'Paragraph',
                    content: '',
                    placeholder: 'start typing here',
                  },
                ],
                className: 'w-full h-full p-8 flex justify-center items-center',
                placeholder: 'Heading1',
              },
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: 'Column',
                content: [
                  {
                    id: uuidv4(),
                    type: 'image' as ContentType,
                    name: 'Image',
                    className: 'p-3',
                    content:
                      'https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    alt: 'Title',
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
      slideName: 'Two columns',
      type: 'twoColumns',
      className: 'p-4 mx-auto flex justify-center items-center',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        content: [
          {
            id: uuidv4(),
            type: 'title' as ContentType,
            name: 'Title',
            content: '',
            placeholder: 'Untitled Card',
          },
          {
            id: uuidv4(),
            type: 'resizable-column' as ContentType,
            name: 'Text and image',
            className: 'border',
            content: [
              {
                id: uuidv4(),
                type: 'paragraph' as ContentType,
                name: 'Paragraph',
                content: '',
                placeholder: 'Start typing...',
              },
              {
                id: uuidv4(),
                type: 'paragraph' as ContentType,
                name: 'Paragraph',
                content: '',
                placeholder: 'Start typing...',
              },
            ],
          },
        ],
      },
    },
  
    {
      id: uuidv4(),
      slideName: 'Two columns with headings',
      type: 'twoColumnsWithHeadings',
      className: 'p-4 mx-auto flex justify-center items-center',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        content: [
          {
            id: uuidv4(),
            type: 'title' as ContentType,
            name: 'Title',
            content: '',
            placeholder: 'Untitled Card',
          },
          {
            id: uuidv4(),
            type: 'resizable-column' as ContentType,
            name: 'Text and image',
            className: 'border',
            content: [
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: 'Column',
                content: [
                  {
                    id: uuidv4(),
                    type: 'heading3' as ContentType,
                    name: 'Heading3',
                    content: '',
                    placeholder: 'Heading 3',
                  },
                  {
                    id: uuidv4(),
                    type: 'paragraph' as ContentType,
                    name: 'Paragraph',
                    content: '',
                    placeholder: 'Start typing...',
                  },
                ],
              },
              {
                id: uuidv4(),
                type: 'column' as ContentType,
                name: 'Column',
                content: [
                  {
                    id: uuidv4(),
                    type: 'heading3' as ContentType,
                    name: 'Heading3',
                    content: '',
                    placeholder: 'Heading 3',
                  },
                  {
                    id: uuidv4(),
                    type: 'paragraph' as ContentType,
                    name: 'Paragraph',
                    content: '',
                    placeholder: 'Start typing...',
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
      slideName: 'Three column',
      type: 'threeColumns',
      className: 'p-4 mx-auto flex justify-center items-center',
      content: {
        id: uuidv4(),
        type: 'column' as ContentType,
        name: 'Column',
        content: [
          {
            id: uuidv4(),
            type: 'title' as ContentType,
            name: 'Title',
            content: '',
            placeholder: 'Untitled Card',
          },
          {
            id: uuidv4(),
            type: 'resizable-column' as ContentType,
            name: 'Text and image',
            className: 'border',
            content: [
              {
                id: uuidv4(),
                type: 'paragraph' as ContentType,
                name: '',
                content: '',
                placeholder: 'Start typing...',
              },
              {
                id: uuidv4(),
                type: 'paragraph' as ContentType,
                name: '',
                content: '',
                placeholder: 'Start typing...',
              },
              {
                id: uuidv4(),
                type: 'paragraph' as ContentType,
                name: '',
                content: '',
                placeholder: 'Start typing...',
              },
            ],
          },
        ],
      },
    },
  ]

const findImageComponents = (layout:ContentItem):ContentItem[] => {
  const images=[]
  if(layout.type==='image'){
    images.push(layout)
  }
  if(Array.isArray(layout.content)){
    layout.content.forEach((child)=>{
      images.push(...findImageComponents(child as ContentItem))
    })
  }
  else if (layout.content && typeof layout.content === 'object'){
    images.push(...findImageComponents(layout.content))
  }
  return images
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
    })
    const imageUrl = completion.data?.[0]?.url ?? null;
    console.log('Image generated Succesfully', imageUrl)
    return imageUrl || 'https//www.via.placeholder.com/1024x1024'
  } catch (error) {
    console.log('Error generating image', error)
    return 'https//www.via.placeholder.com/1024x1024'
  }
}
const replaceImagePlaceholders = async (layout: Slide) => {
  const imageComponents = findImageComponents(layout.content);
  console.log('imageComponents', imageComponents)
  for(const component of imageComponents){
    console.log('generating image for component',component.alt);
    component.content = await generateImageUrl(
      component.alt || 'Placeholder Image'
    );
  }
  return layout
};

const generateLayoutJson = async (outlines: string[]) => {
  const prompt = `
You are a highly creative AI that generates JSON-based layouts for presentations. I will provide you with an array of outlines, and for each outline, you must generate a unique and creative layout. Use the existing layouts as examples for structure and design, and generate unique designs based on the provided outline.

### Guidelines:
1. Write layouts based on the specific outline provided.
2. Use diverse and engaging designs, ensuring each layout is unique.
3. Adhere to the structure of existing layouts but add new styles or components if needed.
4. Fill placeholder data into content fields where required.
5. Generate unique image placeholders for the 'content' property of image components and also alt text according to the outline.
6. Ensure proper formatting and schema alignment for the output JSON.

###Example Layouts:
${JSON.stringify(existingLayouts, null, 2)}

### Outline Array:
 ${JSON.stringify(outlines)}

 For each entry in the outline array, generate:
 - A unique JSON layout with creative Designs. 
 - Properlyu Filled Content, including placeholders for image components.
 - clear and well-structured JSON data.
 - The alt text should describe the image clearly and consisely
 -focus on the main subject(s) of the image and any relevant details such as colors, shapes, people, or objects
 - Ensure the alt text aligns with the context of the presentation slide it will be used on (e.g., professionalm educationalm business-related).
 - Avoid using terms like "image of" or "picture of," and no duplicate layouts across the array.
`;


try {
  console.log('Genration Started')
  const completion = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        maxOutputTokens: 5000,
        temperature: 0.7,
      },
    });


  const responseContent = completion.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/^```json|json```/g, '');

  if(!responseContent){
    return {status:400,error:'No response from AI'}
  }
  let jsonResponse
  try {
    jsonResponse = JSON.parse(responseContent.replace(/^```json|json```/g, '').replace(/```$/, ''));
    await Promise.all(jsonResponse.map(replaceImagePlaceholders));
  } catch (error) {
    console.error("JSON parse error:", error);
    return { status: 500, error: "Failed to parse JSON from AI response" };
  }
  return {status:200,data:jsonResponse}
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { status: 500, error: "Internal server error" };
}
}
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
