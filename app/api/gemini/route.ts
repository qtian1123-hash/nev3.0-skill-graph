import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. 在服务器端安全地获取 API Key
    // Next.js 会自动从 .env.local 读取 process.env.API_KEY
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "服务器端未配置 API Key" },
            { status: 500 }
        );
    }

    // 2. 解析前端传来的数据
    const body = await req.json();
    const { prompt, systemContext } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt 不能为空" },
        { status: 400 }
      );
    }

    // 3. 初始化 Gemini (只在服务器端进行)
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 4. 调用模型
    // 组合 System Context 和 User Prompt
    const fullContent = systemContext 
      ? `${systemContext}\n\n用户问题: ${prompt}`
      : prompt;

    // 使用 gemini-2.5-flash 模型 (根据最新的 SDK 指南)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullContent,
    });

    // 5. 获取文本结果
    const text = response.text;

    // 6. 返回结果给前端
    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "AI 服务响应异常" },
      { status: 500 }
    );
  }
}