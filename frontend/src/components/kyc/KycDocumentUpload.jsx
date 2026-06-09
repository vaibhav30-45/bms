import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
} from "lucide-react";
import { validatePdf } from "../../utils/fileValidation";
import Button from "../common/Button";
import Alert from "../common/Alert";

export default function KycDocumentUpload({
  onSubmit,
  loading,
  error,
  alreadyUploaded,
}) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const picked = acceptedFiles[0];
    if (!picked) return;
    const err = validatePdf(picked);
    if (err) {
      setFileError(err);
      setFile(null);
    } else {
      setFileError("");
      setFile(picked);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    multiple: false,
  });

  const handleSubmit = () => {
    if (!file) {
      setFileError("Please select a PDF file.");
      return;
    }
    onSubmit(file);
  };

  const removeFile = () => {
    setFile(null);
    setFileError("");
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-5">
      <Alert
        type="error"
        message={error || fileError}
        show={!!(error || fileError)}
        onClose={() => setFileError("")}
      />

      {/* Already uploaded notice */}
      {alreadyUploaded && (
        <div
          className="flex items-center gap-3 p-4 rounded-2xl
                        bg-emerald-50 dark:bg-emerald-900/20
                        border border-emerald-200 dark:border-emerald-800"
        >
          <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
          <div>
            <p
              className="text-sm font-bold text-emerald-800
                          dark:text-emerald-300"
            >
              Document already uploaded
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              You can upload a new document to replace the existing one.
            </p>
          </div>
        </div>
      )}

      {/* Upload instructions */}
      <div
        className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50
                      border border-gray-100 dark:border-gray-800"
      >
        <p
          className="text-xs font-bold text-gray-600 dark:text-gray-400
                      uppercase tracking-wide mb-2"
        >
          Requirements
        </p>
        <ul className="space-y-1.5">
          {[
            "PDF format only (.pdf)",
            "Maximum file size: 5MB",
            "Aadhaar card or PAN card scan",
            "Document must be clearly legible",
          ].map((req) => (
            <li
              key={req}
              className="flex items-center gap-2 text-sm
                           text-gray-600 dark:text-gray-400"
            >
              <CheckCircle2
                size={13}
                className="text-emerald-500
                                                 flex-shrink-0"
              />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8
          flex flex-col items-center justify-center gap-4
          cursor-pointer transition-all duration-200 text-center
          ${
            isDragActive
              ? "border-[#1a3c5e] bg-[#1a3c5e]/5 dark:bg-blue-400/5"
              : file
                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-[#1a3c5e] dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }
        `}
      >
        <input {...getInputProps()} />

        {file ? (
          /* File selected state */
          <div className="flex flex-col items-center gap-3 w-full">
            <div
              className="w-14 h-14 rounded-2xl bg-emerald-100
                            dark:bg-emerald-900/40 flex items-center
                            justify-center"
            >
              <FileText size={28} className="text-emerald-600" />
            </div>
            <div className="text-center">
              <p
                className="text-sm font-bold text-gray-900 dark:text-white
                            break-all"
              >
                {file.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatSize(file.size)} · PDF
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                         bg-red-50 dark:bg-red-900/20 text-red-500
                         text-xs font-bold hover:bg-red-100
                         dark:hover:bg-red-900/40 transition-colors"
            >
              <X size={12} />
              Remove
            </button>
          </div>
        ) : (
          /* Default state */
          <>
            <div
              className={`w-14 h-14 rounded-2xl flex items-center
                             justify-center transition-colors
                             ${
                               isDragActive
                                 ? "bg-[#1a3c5e]/10"
                                 : "bg-gray-100 dark:bg-gray-800"
                             }`}
            >
              <Upload
                size={28}
                className={
                  isDragActive
                    ? "text-[#1a3c5e] dark:text-blue-400"
                    : "text-gray-400"
                }
              />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {isDragActive
                  ? "Drop your PDF here"
                  : "Drag & drop your PDF here"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                or{" "}
                <span
                  className="text-[#1a3c5e] dark:text-blue-400
                                 font-bold underline"
                >
                  browse files
                </span>
              </p>
            </div>
            <p className="text-xs text-gray-400">PDF only · Max 5MB</p>
          </>
        )}
      </div>

      <Button
        size="lg"
        fullWidth
        onClick={handleSubmit}
        loading={loading}
        disabled={!file}
      >
        {file ? "Upload Document & Continue" : "Select a PDF to continue"}
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}
