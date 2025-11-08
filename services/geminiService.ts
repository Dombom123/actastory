import { GoogleGenAI, Type, Modality } from "@google/genai";
import { StoryStructure } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCharacterImage = async (description: string, userImageBase64: string): Promise<string> => {
    const prompt = `**Crucially, you must edit the input image of a person.** Transform the person into a new character based on this description: '${description}'. You MUST retain the person's exact facial expression and body pose from the input image. Place the final character on a neutral grey background. The final image must be a cinematic, high-detail, 16:9 aspect ratio shot that clearly defines the character's appearance.`;

    const userImagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: userImageBase64,
        },
    };

    const textPart = {
        text: prompt,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [userImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    // FIX: Iterate through parts to find the image data, which is safer than assuming the first part is the image.
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("No character image was generated.");
}

export const generateStyleImage = async (theme: string): Promise<string> => {
    const prompt = `Create a single piece of concept art that defines a unique visual style for a story about '${theme}'. The image should establish the color palette, lighting, texture, and overall mood. Do not include any characters or text. High detail, cinematic, 16:9 aspect ratio.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    // FIX: Iterate through parts to find the image data, which is safer than assuming the first part is the image.
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("No style image was generated.");
};

export const generateStoryStructure = async (theme: string, numBeats: number, characterDescription: string): Promise<StoryStructure[]> => {
    const prompt = `You are a creative director. For a story with the theme '${theme}' and a character described as '${characterDescription}', create a structure with ${numBeats} scenes. 
    For each scene, provide: 
    1. A short 'actingDirection' for an actor to perform. 
    2. A detailed 'imagePrompt' for an AI image generator. The AI will receive THREE input images: the first is a style reference, the second is the character reference sheet, and the third is a photo of an actor. The prompt MUST be an explicit instruction to edit the actor's photo. A good prompt is: '**Crucially, you must edit the third input image which contains a person.** Transform the person into the character shown in the second input image, making them fit the description of '${characterDescription}'. You MUST retain the actor's exact facial expression and body pose. Use the first input image *only* as a style reference for the overall artistic mood, color palette, and lighting. Place the transformed character into a [environment based on theme] environment, performing the action of [action from actingDirection]. The final image must be a cinematic, high-detail, 16:9 aspect ratio shot.'
    3. A short 'storyText' to be read aloud as a narrative for the scene. 
    
    Return a JSON array of objects, each containing 'actingDirection', 'imagePrompt', and 'storyText'.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        actingDirection: { type: Type.STRING },
                        imagePrompt: { type: Type.STRING },
                        storyText: { type: Type.STRING }
                    },
                    required: ["actingDirection", "imagePrompt", "storyText"]
                }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        const structures = JSON.parse(jsonText);
        if (Array.isArray(structures)) {
            return structures;
        }
        throw new Error("Invalid format for story structure.");
    } catch (e) {
        console.error("Failed to parse story structure JSON:", response.text);
        throw new Error("Could not understand the AI's response for story structure.");
    }
};

export const generateImageForBeat = async (imagePrompt: string, userImageBase64: string, styleImageBase64: string, characterImageBase64: string): Promise<string> => {
    const styleImagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: styleImageBase64,
        },
    };

    const characterImagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: characterImageBase64,
        }
    }
    
    const userImagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: userImageBase64,
        },
    };

    const textPart = {
        text: imagePrompt,
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [styleImagePart, characterImagePart, userImagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    // FIX: Iterate through parts to find the image data, which is safer than assuming the first part is the image.
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("No image was generated.");
};


export const generateSpeech = async (text: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Read the following story with a clear, narrative voice: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, // A nice narrative voice
                },
            },
        },
    });

    // FIX: Iterate through parts to find the audio data, which is safer than assuming the first part is the audio.
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
            return part.inlineData.data;
        }
    }

    throw new Error("Failed to generate speech from text.");
};
