import { useId, useRef, useState } from "react";

interface JsonUploadProps {
  label: string;
  hint: string;
  value: unknown | null;
  error: string | null;
  onChange: (value: unknown | null, error: string | null, fileName: string | null) => void;
}

export function JsonUpload({ label, hint, value, error, onChange }: JsonUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File | null) {
    if (!file) {
      setFileName(null);
      onChange(null, null, null);
      return;
    }

    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      setFileName(file.name);
      onChange(parsed, null, file.name);
    } catch {
      setFileName(file.name);
      onChange(null, "File is not valid JSON.", file.name);
    }
  }

  return (
    <section className="upload-panel">
      <div className="upload-panel__header">
        <h2>{label}</h2>
        <p>{hint}</p>
      </div>

      <label className="upload-drop" htmlFor={inputId}>
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          onChange={(event) => void handleFile(event.target.files?.[0] ?? null)}
        />
        <span className="upload-drop__title">
          {fileName ? fileName : "Choose a JSON file"}
        </span>
        <span className="upload-drop__meta">
          {value ? "Parsed successfully" : "Drop or browse .json"}
        </span>
      </label>

      {error ? <p className="upload-error">{error}</p> : null}
      {value && !error ? (
        <pre className="json-preview">{JSON.stringify(value, null, 2)}</pre>
      ) : null}
    </section>
  );
}
