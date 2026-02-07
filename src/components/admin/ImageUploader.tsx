'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ImageUploaderProps {
  bucket?: string
  onUpload: (url: string) => void
  currentImage?: string
  label?: string
}

export default function ImageUploader({
  bucket = 'pages',
  onUpload,
  currentImage,
  label = 'Upload Image',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || '')
  const [error, setError] = useState('')

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      setPreview(URL.createObjectURL(file))
      setUploading(true)
      setError('')

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('bucket', bucket)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const data = await response.json()

        if (data.url) {
          setPreview(data.url)
          onUpload(data.url)
        }
      } catch (err) {
        console.error('Upload error:', err)
        setError(err instanceof Error ? err.message : 'Failed to upload image')
        setPreview(currentImage || '')
      } finally {
        setUploading(false)
      }
    },
    [bucket, onUpload, currentImage]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const removeImage = () => {
    setPreview('')
    onUpload('')
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {preview ? (
        <div className="relative w-full h-64 border-2 border-gray-300 rounded-lg overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          {uploading ? (
            <div>
              <p className="text-blue-600 font-medium">Uploading...</p>
              <div className="mt-2 w-48 mx-auto bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          ) : (
            <div>
              {isDragActive ? (
                <p className="text-blue-600 font-medium">Drop the image here</p>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
