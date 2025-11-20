import { useState, useRef } from "react";
import { api } from "../api/api";

export default function ProfilePictureUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef();

  // Handle file selection
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // Allow clicking the preview area to open file select
  const openFilePicker = () => inputRef.current.click();

  // Drag & drop handling
  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;

    setFile(dropped);
    setPreview(URL.createObjectURL(dropped));
  };

  const handleDragOver = (e) => e.preventDefault();

  // Upload profile picture
  const upload = async () => {
    if (!file) return alert("Please choose an image.");

    setUploading(true);

    try {
      await api.uploadProfilePic(file);

      alert("Profile picture uploaded!");

      // refresh user profile
      if (onUploaded) onUploaded();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border p-4 rounded-md max-w-md">
      <h3 className="font-semibold mb-2">Profile Picture</h3>

      {/* Upload Area */}
      <div
        className="border-dashed border-2 border-gray-400 rounded-md p-4 text-center cursor-pointer mb-3"
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-full mx-auto"
          />
        ) : (
          <p className="text-gray-500">Click or drag & drop an image here</p>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* Upload Button */}
      <button
        onClick={upload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50 w-full"
      >
        {uploading ? "Uploading..." : "Upload Picture"}
      </button>
    </div>
  );
}