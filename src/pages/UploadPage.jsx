import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import SectionHeader from '../components/SectionHeader'
import UploadDropzone from '../components/UploadDropzone'
import Button from '../components/Button'
import LoadingOverlay from '../components/LoadingOverlay'
import GlassCard from '../components/GlassCard'
import { useFileUpload } from '../hooks/useFileUpload'
import { useApp } from '../context/AppContext'

export default function UploadPage() {
  const navigate = useNavigate()
  const { setStorySourceName } = useApp()
  const upload = useFileUpload()
  const [busy, setBusy] = useState(false)

  const onGenerate = () => {
    if (!upload.isValid || !upload.fileName) return
    setBusy(true)
    setStorySourceName(upload.fileName)
    window.setTimeout(() => {
      setBusy(false)
      navigate('/dashboard')
    }, 1600)
  }

  return (
    <>
      <LoadingOverlay open={busy} />

      <PageContainer>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <SectionHeader
              eyebrow="Privacy-minded MVP"
              title="Upload a CSV. Get a spending story."
              description="Drop a bank-style export. We validate it locally, simulate analysis for this demo, and route you to a dashboard that feels investor-ready — without changing your dark fintech aesthetic."
            />

            <GlassCard className="p-6 sm:p-8">
              <UploadDropzone
                inputRef={upload.inputRef}
                fileName={upload.fileName}
                error={upload.error}
                isDragging={upload.isDragging}
                isValid={upload.isValid}
                onInputChange={upload.onInputChange}
                onDrop={upload.onDrop}
                onDragEnter={upload.onDragEnter}
                onDragOver={upload.onDragOver}
                onDragLeave={upload.onDragLeave}
                onBrowse={upload.openPicker}
              />

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3 text-sm text-on-surface-variant">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-secondary" aria-hidden />
                  <p className="leading-relaxed">
                    CSV only. Invalid files keep the primary action disabled — no dead-end clicks.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={onGenerate}
                  disabled={!upload.isValid}
                  loading={busy}
                  rightIcon={ArrowRight}
                >
                  Generate my story
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="space-y-4"
          >
            <GlassCard className="p-6 border-primary/15">
              <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
                What happens next
              </p>
              <ul className="mt-4 space-y-3 text-sm text-on-surface-variant leading-relaxed">
                <li>We read your filename and validate CSV structure expectations.</li>
                <li>This build uses mock spending data for charts and narrative panels.</li>
                <li>Later, swap the mock layer for a real parser — the UI is ready.</li>
              </ul>
            </GlassCard>
            <GlassCard className="p-6">
              <p className="font-headline text-base font-bold text-on-surface">Tips</p>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                Export CSV from your bank or card portal. Avoid PDFs — this uploader is strict on
                purpose so the product feels trustworthy.
              </p>
            </GlassCard>
          </motion.aside>
        </div>
      </PageContainer>
    </>
  )
}
