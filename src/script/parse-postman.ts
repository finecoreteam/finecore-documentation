/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from "fs";
import * as path from "path";

type KeyValue = { key: string; value: any; description?: string };

function readJSON(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function extractQuery(params: any[]): KeyValue[] {
  if (!params) return [];
  return params.map((p: any) => ({
    key: p.key,
    value: p.value,
    description: p.description || "",
  }));
}

function extractHeaders(headers: any[]): KeyValue[] {
  if (!headers) return [];
  return headers
    .filter((h: any) => !h.disabled)
    .map((h: any) => ({
      key: h.key,
      value: h.value,
      description: h.description || "",
    }));
}

function extractBody(body: any) {
  if (!body) return null;

  switch (body.mode) {
    case "raw":
      return {
        mode: "raw",
        raw: body.raw,
      };

    case "urlencoded":
      return {
        mode: "urlencoded",
        urlencoded: body.urlencoded?.map((u: any) => ({
          key: u.key,
          value: u.value,
          description: u.description || "",
        })),
      };

    case "formdata":
      return {
        mode: "formdata",
        formdata: body.formdata?.map((f: any) => ({
          key: f.key,
          value: f.value,
          type: f.type,
          description: f.description || "",
        })),
      };

    case "graphql":
      return {
        mode: "graphql",
        query: body.graphql?.query,
        variables: body.graphql?.variables,
      };

    default:
      return null;
  }
}

function normalizeItem(item: any) {
  const req = item.request || {};
  const url = req.url?.raw ||
    (req.url?.path ? "/" + req.url.path.join("/") : "") ||
    "";

  return {
    id: item.id || item.name.replace(/\s+/g, "-").toLowerCase(),
    name: item.name,
    method: req.method,
    url,
    headers: extractHeaders(req.header),
    query: extractQuery(req.url?.query),
    body: extractBody(req.body),
    responses: item.response?.map((r: any) => ({
      name: r.name,
      status: r.code,
      body: r.body,
      headers: extractHeaders(r.header),
    })) || [],
  };
}

function parseGroup(item: any) {
  if (item.item) {
    return {
      name: item.name,
      endpoints: item.item
        .filter((e: any) => e.request)
        .map((e: any) => normalizeItem(e)),
    };
  }

  return null;
}

function parsePostmanCollection(collectionPath: string, outputPath: string) {
  const raw = readJSON(collectionPath);
  const items = raw.item || [];

  const groups = items
    .map((grp: any) => parseGroup(grp))
    .filter(Boolean);

  const result = { groups };

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log("Generated:", outputPath);
}

// run
const input = path.join(__dirname, "../postman-collection.json");
const output = path.join(__dirname, "../output/api.json");

parsePostmanCollection(input, output);
