import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
});

let systemPrompt = `
You are a helpful assistant that helps a sales rep, a sales rep at Rilla, summarize information from a sales call.
Your goal is to write a summary from the comments provided by the sales rep that will highlight key points that will be relevant to making a sale.

Here is the transcript from the sales call. Do not summarize this, but instead summarize the comments about the text:

`;

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // Ensure data has the comments field
        if (!data.comments || !Array.isArray(data.comments)) {
            return new NextResponse(JSON.stringify({ error: 'Invalid input data' }), { status: 400 });
        }

        const transcriptText = data.transcript;
        systemPrompt += transcriptText + "\n\n";

        // Create prompt from comments
        const commentsText = data.comments.map((comment: any) => comment.content).join("\n");

        // Request summary from OpenAI using GPT-4
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",  // Use GPT-4 model
            messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: commentsText },],
            max_tokens: 150, // Adjust as needed
            temperature: 0.5, // Adjust as needed
        });

        // Return the summary
        return new NextResponse(JSON.stringify({ response }), { status: 200 });

    } catch (error) {
        console.error('Error summarizing comments:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to summarize comments' }), { status: 500 });
    }
}
