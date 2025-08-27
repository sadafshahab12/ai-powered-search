import { NextResponse } from "next/server";

import { products } from "@/app/lib/product";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in .env.local file");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `Convert this search query into JSON filters.
Allowed fields: category (string), color (string), price (object with min and max numbers).
Query: "${query}"
Return only JSON. Example: {"category":"clothing","color":"red","price":{"min":500,"max":1500}}`;
    // const response = await fetch(
    //   "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    //     process.env.GEMINI_API_KEY,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       contents: [{ parts: [{ text: prompt }] }],
    //     }),
    //   }
    // );

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let filters: any = {};

    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        filters = JSON.parse(match[0]);
      }
    } catch (error) {
      console.log("Json parse error", error, "Raw Response:", text);
      filters = {};
    }

    let filtered = products;

    if (filters.category) {
      filtered = filtered.filter(
        (p) =>
          p.category &&
          p.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.color) {
      filtered = filtered.filter(
        (p) =>
          p.color && p.color.toLowerCase().includes(filters.color.toLowerCase())
      );
    }
    if (filters.price?.max) {
      filtered = filtered.filter((p) => p.price <= filters.price.max);
    }
    if (filters.price?.min) {
      filtered = filtered.filter((p) => p.price >= filters.price.min);
    }

    return NextResponse.json({ results: filtered });
  } catch (error) {
    console.log("Api Error:" + error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
