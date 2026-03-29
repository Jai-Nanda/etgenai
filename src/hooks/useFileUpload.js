import { useCallback, useRef, useState } from 'react'
import { validateCsvFile } from '../utils/fileValidation'

export function useFileUpload() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  const processFile = useCallback((candidate) => {
    const result = validateCsvFile(candidate)
    if (!result.ok) {
      setError(result.message)
      setFile(null)
      return
    }
    setError(null)
    setFile(candidate)
  }, [])

  const reset = useCallback(() => {
    setFile(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [])

  const openPicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const onInputChange = useCallback(
    (e) => {
      const next = e.target.files?.[0]
      if (next) processFile(next)
    },
    [processFile]
  )

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      const next = e.dataTransfer.files?.[0]
      if (next) processFile(next)
    },
    [processFile]
  )

  const onDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const onDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget.contains(e.relatedTarget)) return
    setIsDragging(false)
  }, [])

  return {
    file,
    fileName: file?.name ?? null,
    error,
    isDragging,
    isValid: Boolean(file) && !error,
    inputRef,
    openPicker,
    reset,
    onInputChange,
    onDrop,
    onDragEnter,
    onDragOver,
    onDragLeave,
  }
}
