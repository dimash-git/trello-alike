import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // todos in the body of the POST request
  const { todos } = await req.json();

  //   communicate with OpenAI API
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content:
          "When responding, welcome the user. Limit the response to 180 characters.",
      },
      {
        role: "user",
        content: `Hello, provide the summary of the following todos. 
        Count how many todos are in each category (To-Do, In Progress, Done). 
        Here is the data: ${JSON.stringify(todos)})`,
      },
    ],
  });

  const { data } = response;

  return NextResponse.json(data.choices[0].message);
}
