"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    type: "famous-people" | "landmarks";
}

export default function ImageUpload({ value, onChange, type }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        try {
            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                onChange(data.url);
            }
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    if (value) {
        return (
            <div className="relative w-full h-48 bg-white/5 rounded-lg overflow-hidden border border-white/10 group">
                <Image
                    src={value}
                    alt="Uploaded image"
                    fill
                    className="object-cover"
                />
                <button
                    onClick={() => onChange("")}
                    type="button"
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                    <Loader2 className="w-10 h-10 text-white/40 animate-spin mb-3" />
                ) : (
                    <Upload className="w-10 h-10 text-white/40 mb-3" />
                )}
                <p className="text-sm text-white/60">
                    {isUploading ? "Uploading..." : "Click to upload image"}
                </p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
        </label>
    );
}
