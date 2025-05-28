"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Trash2, UploadCloud } from "lucide-react";
import Swal from "sweetalert2";
import { uploadImage } from "@/lib/cloudinary";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const url = await uploadImage(file);
        return url as string;
      });
      
      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...value, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload failed:', error);
      Swal.fire('Upload Error', 'Failed to upload images', 'error');
    }
  }, [onChange, value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: true
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${isDragActive 
            ? 'border-indigo-500 bg-indigo-50/50 animate-pulse-shadow' 
            : 'border-gray-200 hover:border-indigo-300'} 
          bg-gradient-to-br from-white to-indigo-50/30`}
      >
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 p-4">
          <UploadCloud className="h-6 w-6 text-indigo-600" />
        </div>
        <p className="text-sm text-gray-600">
          {isDragActive ? 'Drop to upload' : 'Drag & drop images or browse'}
        </p>
        <p className="mt-1 text-xs text-gray-500">Recommended size: 800x800px</p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {value.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Preview ${index}`}
                  className="rounded-md h-32 w-full object-cover border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 