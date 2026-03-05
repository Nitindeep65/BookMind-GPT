import { useState } from "react";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg"];

function Dnd() {
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Invalid file type. Only PDF, PNG, and JPEG are allowed.");
      setFile(null);
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-neutral-900 rounded-xl shadow w-full max-w-md mx-auto">
      <label className="w-full cursor-pointer flex flex-col items-center border-2 border-dashed border-neutral-700 py-8 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
        <span className="text-white mb-2">Drag & drop or select a file</span>
        <input
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
      {file && (
        <div className="text-green-400 mt-4 text-sm">
          Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}
    </div>
  );
}

export default Dnd;