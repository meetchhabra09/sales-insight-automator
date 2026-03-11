const axios = require("axios");

async function generateSummary(data) {

  try {

    if (!data || data.length === 0) {
      throw new Error("No data received");
    }

    const prompt = `
You are a professional sales analyst.

Analyze the following sales dataset and create a short executive report.

Include:
- Total revenue
- Best performing region
- Best product category
- Key insights

Data:
${JSON.stringify(data)}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      }
    );

    const summary =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!summary) {
      throw new Error("Empty AI response");
    }

    return summary;

  } catch (error) {

    console.error("AI Error:", error.response?.data || error.message);

    // ⭐ PRO TIP FALLBACK SUMMARY
    let totalRevenue = 0;
    let regionSales = {};
    let productSales = {};

    data.forEach(row => {

      const revenue = Number(row.Revenue) || 0;

      totalRevenue += revenue;

      regionSales[row.Region] =
        (regionSales[row.Region] || 0) + revenue;

      productSales[row.Product_Category] =
        (productSales[row.Product_Category] || 0) + revenue;

    });

    const bestRegion =
      Object.keys(regionSales).reduce((a, b) =>
        regionSales[a] > regionSales[b] ? a : b
      );

    const bestProduct =
      Object.keys(productSales).reduce((a, b) =>
        productSales[a] > productSales[b] ? a : b
      );

    const fallbackSummary = `
Sales Performance Report

Total Revenue: $${totalRevenue}

Top Region: ${bestRegion}

Top Product Category: ${bestProduct}

Insight:
Sales data was processed successfully. The highest revenue contribution came from the ${bestRegion} region, primarily driven by ${bestProduct} products.
`;

    return fallbackSummary;

  }

}

module.exports = generateSummary;