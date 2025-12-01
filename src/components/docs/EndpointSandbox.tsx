"use client";

import { useState } from "react";

type KeyValue = { key: string; value: string; description?: string };

interface Endpoint<T> {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: KeyValue[];
  query: KeyValue[];
  body: T & { raw: string };
}

interface DataParsed<T> {
  status: number;
  data: T;
}

interface Props<T extends object> {
  endpoint: Endpoint<T>;
}

export default function EndpointSandbox<T extends object>(
  { endpoint }: Props<T>,
) {
  const [queryParams, setQueryParams] = useState(endpoint.query || []);
  const [headers, setHeaders] = useState(endpoint.headers || []);
  const [body, setBody] = useState(endpoint.body?.raw || "");
  const [response, setResponse] = useState<DataParsed<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    list: KeyValue[],
    setList: (v: KeyValue[]) => void,
    index: number,
    field: "key" | "value",
    value: string,
  ) {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  }

  function buildUrl() {
    const q = queryParams
      .filter((q) => q.key && q.value)
      .map((q) => `${encodeURIComponent(q.key)}=${encodeURIComponent(q.value)}`)
      .join("&");

    return q ? `${endpoint.url}?${q}` : endpoint.url;
  }

  async function sendRequest() {
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const requestHeaders: Record<string, string> = {};
      headers
        .filter((h) => h.key && h.value)
        .forEach((h) => (requestHeaders[h.key] = h.value));

      const opts: RequestInit = {
        method: endpoint.method,
        headers: requestHeaders,
      };

      if (body && ["POST", "PUT", "PATCH"].includes(endpoint.method)) {
        opts.body = body;
      }

      const res = await fetch(buildUrl(), opts);
      const text = await res.text();

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }

      setResponse({
        status: res.status,
        data: parsed,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full border rounded p-4 space-y-4 bg-white">
      <h2 className="text-xl font-semibold">{endpoint.name} Sandbox</h2>

      <div>
        <h3 className="font-medium mb-2">Query Parameters</h3>
        {queryParams.map((q, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={q.key}
              onChange={(e) =>
                handleChange(
                  queryParams,
                  setQueryParams,
                  i,
                  "key",
                  e.target.value,
                )}
              placeholder="key"
              className="border p-1 flex-1"
            />
            <input
              value={q.value}
              onChange={(e) =>
                handleChange(
                  queryParams,
                  setQueryParams,
                  i,
                  "value",
                  e.target.value,
                )}
              placeholder="value"
              className="border p-1 flex-1"
            />
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-medium mb-2">Headers</h3>
        {headers.map((h, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              value={h.key}
              onChange={(e) =>
                handleChange(headers, setHeaders, i, "key", e.target.value)}
              placeholder="key"
              className="border p-1 flex-1"
            />
            <input
              value={h.value}
              onChange={(e) =>
                handleChange(headers, setHeaders, i, "value", e.target.value)}
              placeholder="value"
              className="border p-1 flex-1"
            />
          </div>
        ))}
      </div>

      {["POST", "PUT", "PATCH"].includes(endpoint.method) && (
        <div>
          <h3 className="font-medium mb-2">Body</h3>
          <label htmlFor="body"></label>
          <textarea
            id="body"
            name="body"
            title="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border p-2 h-40 font-mono"
          />
        </div>
      )}

      <button
        onClick={sendRequest}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Sending..." : "Send Request"}
      </button>

      {error && (
        <div className="text-red-600 font-medium">
          {error}
        </div>
      )}

      {response && (
        <div className="border rounded p-3 bg-gray-50">
          <div className="font-medium mb-2">Status: {response.status}</div>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
