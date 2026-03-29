import { analyzeExpenses } from "../../../utils/analysis";

export async function POST(req) {
  try {
    const body = await req.json();
    const { expenses } = body;

    if (!expenses || !Array.isArray(expenses)) {
      return Response.json(
        { error: "Valid expenses required" },
        { status: 400 }
      );
    }

    const result = analyzeExpenses(expenses);

    return Response.json(result);

  } catch (error) {
    console.error("Analyze API Error:", error);

    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}