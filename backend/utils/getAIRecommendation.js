export async function getAIRecommendation(req, res, userPrompt, products) {
    if (!Array.isArray(products) || products.length === 0) {
        return { success: true, products: [] };
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        console.warn("Gemini API key missing. Falling back to local product filtering.");
        return { success: true, products };
    }

    const modelCandidates = [
        process.env.GEMINI_MODEL,
        "gemini-2.5-flash",
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
    ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

    try {
        // Slim down product data to avoid exceeding Gemini token limits
        const slimProducts = products.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            category: p.category,
            price: p.price,
            ratings: p.ratings,
            stock: p.stock,
        }));

        const geminiPrompt = `
You are a product recommendation assistant for an e-commerce store.

Here is a list of available products (JSON):
${JSON.stringify(slimProducts)}

The user is looking for: "${userPrompt}"

Return ONLY a valid JSON array of the best matching product objects from the list above (same structure).
Do NOT include any explanation, markdown, or extra text — only the raw JSON array.`;

        let lastError = null;

        for (const modelName of modelCandidates) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: geminiPrompt }] }],
                        generationConfig: {
                            temperature: 0.2,
                            maxOutputTokens: 2048,
                            responseMimeType: "application/json",
                        },
                    }),
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok || data?.error) {
                    const errMsg = data?.error?.message || `Gemini API error (status ${response.status})`;
                    lastError = errMsg;
                    console.warn(`Gemini model ${modelName} failed:`, errMsg);
                    continue;
                }

                const aiResponseText = data?.candidates?.[0]?.content?.parts
                    ?.map((part) => part.text)
                    .filter(Boolean)
                    .join("\n")
                    .trim() || "";

                if (!aiResponseText) {
                    const finishReason = data?.candidates?.[0]?.finishReason || "UNKNOWN";
                    console.warn(`Gemini model ${modelName} returned empty content. finishReason:`, finishReason);
                    lastError = `AI returned no content (reason: ${finishReason}). Try a more specific prompt.`;
                    continue;
                }

                const cleanedText = aiResponseText
                    .replace(/^```(?:json)?\s*/i, "")
                    .replace(/```\s*$/i, "")
                    .trim();

                let parsedProducts = JSON.parse(cleanedText);
                if (!Array.isArray(parsedProducts)) {
                    parsedProducts = parsedProducts?.products || Object.values(parsedProducts || {})[0] || [];
                }

                if (!Array.isArray(parsedProducts)) {
                    throw new Error("Gemini response is not a JSON array.");
                }

                const productMapById = new Map(products.map((p) => [String(p.id), p]));
                const productMapByName = new Map(products.map((p) => [String(p?.name || "").toLowerCase().trim(), p]));

                const fullProducts = parsedProducts
                    .map((p) => productMapById.get(String(p.id)) || productMapByName.get(String(p?.name || "").toLowerCase().trim()))
                    .filter(Boolean);

                return {
                    success: true,
                    products: fullProducts.length > 0 ? fullProducts : (parsedProducts.length === 0 ? [] : products),
                };
            } catch (parseError) {
                console.error(`Failed to parse Gemini response from ${modelName}:`, parseError.message || parseError);
                lastError = parseError.message || "AI response format was invalid.";
            }
        }

        console.warn("AI recommendation failed. Falling back to local filtered products.", lastError);
        return { success: true, products };
    } catch (error) {
        console.error("getAIRecommendation error:", error);
        return { success: true, products };
    }
}
