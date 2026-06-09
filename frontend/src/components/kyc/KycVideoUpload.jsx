import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  Video,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  X,
  Play,
  Pause,
} from "lucide-react";
import { validateVideo } from "../../utils/fileValidation";
import Button from "../common/Button";
import Alert from "../common/Alert";

export default function KycVideoUpload({
  onSubmit,
  loading,
  error,
  alreadyUploaded,
}) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [preview, setPreview] = useState(null);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    const picked = acceptedFiles[0];
    if (!picked) return;
    const err = validateVideo(picked);
    if (err) {
      setFileError(err);
      setFile(null);
      setPreview(null);
    } else {
      setFileError("");
      setFile(picked);
      const url = URL.createObjectURL(picked);
      setPreview(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/ogg": [".ogg"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setFileError("");
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setPlaying(false);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying((p) => !p);
  };

  const handleSubmit = () => {
    if (!file) {
      setFileError("Please select a video file.");
      return;
    }
    onSubmit(file);
  };

  const formatSize = (bytes) => {
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

      {/* Already uploaded */}
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
              Video already uploaded
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              You can upload a new video to replace the existing one.
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div
        className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20
                      border border-purple-100 dark:border-purple-800"
      >
        <p
          className="text-xs font-bold text-purple-800 dark:text-purple-300
                      uppercase tracking-wide mb-3 flex items-center gap-1.5"
        >
          <Video size={13} />
          Recording Instructions
        </p>
        <ul className="space-y-1.5">
          {[
            "Hold your Aadhaar card clearly visible",
            "State your full name and today's date",
            "Keep the video under 2 minutes",
            "Ensure good lighting and clear audio",
            "MP4, WebM or OGG format · Max 50MB",
          ].map((inst) => (
            <li
              key={inst}
              className="flex items-start gap-2 text-sm
                           text-purple-700 dark:text-purple-400"
            >
              <CheckCircle2
                size={13}
                className="text-purple-500 flex-shrink-0 mt-0.5"
              />
              {inst}
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
              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
              : file
                ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }
        `}
      >
        <input {...getInputProps()} />

        {file && preview ? (
          /* Video preview */
          <div
            className="flex flex-col items-center gap-3 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-xs rounded-xl overflow-hidden
                            bg-black shadow-lg"
            >
              <video
                ref={videoRef}
                src={preview}
                className="w-full max-h-40 object-contain"
                onEnded={() => setPlaying(false)}
              />
              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center
                           bg-black/20 hover:bg-black/30 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-full bg-white/90
                                flex items-center justify-center shadow-lg"
                >
                  {playing ? (
                    <Pause size={16} className="text-gray-900" />
                  ) : (
                    <Play size={16} className="text-gray-900 ml-0.5" />
                  )}
                </div>
              </button>
            </div>
            <div className="text-center">
              <p
                className="text-sm font-bold text-gray-900 dark:text-white
                            break-all"
              >
                {file.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatSize(file.size)} ·{" "}
                {file.type.split("/")[1].toUpperCase()}
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
                         text-xs font-bold hover:bg-red-100 transition-colors"
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
                                 ? "bg-purple-100 dark:bg-purple-900/40"
                                 : "bg-gray-100 dark:bg-gray-800"
                             }`}
            >
              <Video
                size={28}
                className={isDragActive ? "text-purple-500" : "text-gray-400"}
              />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {isDragActive
                  ? "Drop your video here"
                  : "Drag & drop your video here"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                or{" "}
                <span className="text-purple-500 font-bold underline">
                  browse files
                </span>
              </p>
            </div>
            <p className="text-xs text-gray-400">MP4 · WebM · OGG · Max 50MB</p>
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
        {file ? "Submit Video & Complete KYC" : "Select a video to continue"}
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}
