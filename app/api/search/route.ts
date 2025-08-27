import { NextResponse } from "next/server";

import { products } from "@/app/data/product";

function extractJson(text: string) {
  const match = text.match(/\[.*\]/s);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (error) {
      console.log("Error while match:" + error);
      return [];
    }
  }
  return [];
}
export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const prompt = `You are a smart search assistant. 
    Give this product list: ${JSON.stringify(
      products
    )} And this user query: "${query}" Return only the products (in JSON) that match the query. Example format : [{"id":1,"name":"Red T-Shirt","price":1500,"category":"clothing"}] Do not write anything else, only JSON.`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    //   try to parse json

    const results = extractJson(reply);
    return NextResponse.json({ results });
  } catch (error) {
    console.log("Api Error:" + error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
