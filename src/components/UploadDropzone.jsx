import { motion } from 'framer-motion'
import { CheckCircle2, FileSpreadsheet, UploadCloud } from 'lucide-react'
import Button from './Button'

export default function UploadDropzone({
  inputRef,
  fileName,
  error,
  isDragging,
  isValid,
  onInputChange,
  onDrop,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onBrowse,
  inputId = 'csv-upload',
}) {
  return (
    <div className="space-y-4">
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        onChange={onInputChange}
      />

      <motion.div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onBrowse()
          }
        }}
        onClick={onBrowse}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        animate={{
          scale: isDragging ? 1.01 : 1,
          boxShadow: isDragging
            ? '0 0 48px -12px rgba(173,198,255,0.35)'
            : '0 0 0 0 rgba(0,0,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className={[
          'upload-dashed relative cursor-pointer overflow-hidden rounded-3xl px-6 py-10 text-center transition-colors duration-300',
          isDragging ? 'bg-primary/5' : 'bg-surface-container-low/40',
          error ? 'ring-1 ring-error/50' : '',
          isValid ? 'ring-1 ring-secondary/35' : '',
        ].join(' ')}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 bg-glow"
        />
        <div className="relative flex flex-col items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-outline-variant/60 bg-surface-container-high/80 ${
              isValid ? 'text-secondary' : 'text-primary/90'
            }`}
          >
            {isValid ? (
              <CheckCircle2 className="h-7 w-7" aria-hidden />
            ) : (
              <UploadCloud className="h-7 w-7" aria-hidden />
            )}
          </div>
          <div className="space-y-1">
            <p className="font-headline text-lg font-bold text-on-surface">
              Drop your bank CSV here
            </p>
            <p className="text-sm text-on-surface-variant">
              or click to browse — we only read CSV exports on-device for this MVP.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation()
              onBrowse()
            }}
            leftIcon={FileSpreadsheet}
          >
            Browse files
          </Button>
          {fileName ? (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm font-medium text-secondary"
            >
              <FileSpreadsheet className="h-4 w-4" aria-hidden />
              <span className="truncate max-w-[280px] sm:max-w-md">{fileName}</span>
            </motion.p>
          ) : null}
        </div>
      </motion.div>

      {error ? (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
