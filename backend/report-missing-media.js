const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Movie = require("./models/Movie");
const Series = require("./models/Series");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/moviemania";

const hasValue = (value) => Boolean(String(value || "").trim());

const buildRows = (items) => {
  return items.map((item) => {
    const id = item._id ? String(item._id) : String(item.id || "");
    const title = String(item.title || "Untitled");
    const videoOk = hasValue(item.videoUrl);
    const trailerOk = hasValue(item.trailerUrl) || hasValue(item.trailer);

    let status = "OK";
    if (!videoOk && !trailerOk) status = "Missing video + trailer";
    else if (!videoOk) status = "Missing videoUrl";
    else if (!trailerOk) status = "Missing trailerUrl";

    return {
      id,
      title,
      status,
      videoUrl: item.videoUrl || "",
      trailerUrl: item.trailerUrl || item.trailer || "",
    };
  });
};

const toMarkdownTable = (rows) => {
  const header = "| Title | ID | Status |\n|---|---|---|";
  const body = rows
    .map((row) => `| ${row.title.replace(/\|/g, "\\|")} | ${row.id} | ${row.status} |`)
    .join("\n");

  return body ? `${header}\n${body}` : `${header}\n| None | - | - |`;
};

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const [movies, series] = await Promise.all([
      Movie.find({}).lean(),
      Series.find({}).lean(),
    ]);

    const movieRows = buildRows(movies);
    const seriesRows = buildRows(series);

    const missingMovies = movieRows.filter((r) => r.status !== "OK");
    const missingSeries = seriesRows.filter((r) => r.status !== "OK");

    const report = [
      "# Missing Media Checklist",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      "## Summary",
      `- Movies scanned: ${movieRows.length}`,
      `- Series scanned: ${seriesRows.length}`,
      `- Movies missing media fields: ${missingMovies.length}`,
      `- Series missing media fields: ${missingSeries.length}`,
      "",
      "## Movies With Missing Media",
      toMarkdownTable(missingMovies),
      "",
      "## Series With Missing Media",
      toMarkdownTable(missingSeries),
      "",
      "## Notes",
      "- Missing videoUrl means Full Movie watch cannot play directly.",
      "- Missing trailerUrl means Trailer button will fall back to search.",
    ].join("\n");

    const outPath = path.join(__dirname, "..", "MISSING_MEDIA_REPORT.md");
    fs.writeFileSync(outPath, report, "utf8");

    console.log(`Report written to ${outPath}`);
    console.log(`Movies missing: ${missingMovies.length}`);
    console.log(`Series missing: ${missingSeries.length}`);
  } catch (error) {
    console.error("Failed to generate media report:", error.message || error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
