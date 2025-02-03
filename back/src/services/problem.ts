import { isAxiosError } from "axios";

const axios = require("axios");
const cheerio = require("cheerio");

interface Problem {
  id: number;
  title: string;
  limitTableHtml: string;
  descriptionHtml: string;
  inputHtml: string;
  outputHtml: string;
  limitHtml: string;
  examples: string;
  associations: string;
}

export const problem = async (id: Number) => {
  const bojURL = "https://www.acmicpc.net";

  try {
    const response = await axios.get(`${bojURL}/problem/${id}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $("span#problem_title").text().trim();
    const inputHtml = $("div#problem_input").html()!.trim();
    const outputHtml = $("div#problem_output").html()!.trim();
    const limitHtml = $("div#problem_limit").html()?.trim() || null;
    const limitTableHtml = $(".table-responsive").html()!.trim();

    let descriptionHtml = $("div#problem_description").html()!.trim();

    const examples = [];
    let exampleNumber = 1;

    while (true) {
      const inputExampleHtml = $(`#sample-input-${exampleNumber}`)
        .html()
        ?.trim();
      const outputExampleHtml = $(`#sample-output-${exampleNumber}`)
        .html()
        ?.trim();
      const explainHtml = $(`#problem_sample_explain_${exampleNumber}`)
        .html()
        ?.trim();

      if (inputExampleHtml && outputExampleHtml) {
        examples.push({
          number: exampleNumber,
          input: inputExampleHtml,
          output: outputExampleHtml,
          explain: explainHtml || null,
        });
        exampleNumber += 1;
      } else {
        break;
      }
    }

    descriptionHtml = descriptionHtml
      .replaceAll('src="/upload', `src="${bojURL}/upload`)
      .replaceAll(
        'src="/JudgeOnline/upload',
        `src="${bojURL}/JudgeOnline/upload`
      );

    examples.forEach((example) => {
      if (example.explain) {
        example.explain = example.explain
          .replaceAll('src="/upload', `src="${bojURL}/upload`)
          .replaceAll(
            'src="/JudgeOnline/upload',
            `src="${bojURL}/JudgeOnline/upload`
          );
      }
    });

    return {
      id,
      title,
      limitTableHtml,
      descriptionHtml,
      inputHtml,
      outputHtml,
      limitHtml,
      examples,
    };
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 404) {
      throw Error("404");
    } else {
      throw Error("500");
    }
  }
};
