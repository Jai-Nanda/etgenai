import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Upload, FileText } from 'lucide-react'
import PageContainer from '../components/PageContainer'
import SectionHeader from '../components/SectionHeader'
import UploadDropzone from '../components/UploadDropzone'
import Button from '../components/Button'
import LoadingOverlay from '../components/LoadingOverlay'
import GlassCard from '../components/GlassCard'
import { useFileUpload } from '../hooks/useFileUpload'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { uploadService } from '../services/uploadService'

export default function UploadPage() {
  const navigate = useNavigate()
  const { setStorySourceName } = useApp()
  const { user, isGuest } = useAuth()
  const upload = useFileUpload()
  const [busy, setBusy] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [error, setError] = useState(null)

  const onGenerate = async () => {
    if (!upload.isValid || !upload.file) return
    
    if (isGuest) {
      setError('Please sign up or login to upload files')
      return
    }

    setBusy(true)
    setError(null)
    setUploadResult(null)

    try {
      const response = await uploadService.uploadCSV(upload.file)
      
      if (response.success) {
        setUploadResult(response.data)
        setStorySourceName(upload.file.name)
        
        // Navigate to dashboard after successful upload
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      } else {
        setError(response.message || 'Upload failed')
        setUploadResult(null)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Upload failed. Please check your connection and try again.')
      setUploadResult(null)
    } finally {
      setBusy(false)
    }
  }

  if (isGuest) {
    // Demo upload experience for guest users
    const onDemoUpload = () => {
      if (!upload.isValid || !upload.fileName) return
      
      setBusy(true)
      setError(null)
      setUploadResult(null)

      // Simulate demo upload processing
      setTimeout(() => {
        setUploadResult({
          summary: {
            transactionsCreated: Math.floor(Math.random() * 50) + 20,
            categoriesFound: 5,
            dateRange: '3 months',
            totalAmount: Math.floor(Math.random() * 5000) + 1000
          }
        })
        setStorySourceName(upload.fileName)
        setBusy(false)
        
        // Navigate to dashboard after successful demo upload
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      }, 2000)
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
                eyebrow="Demo Mode"
                title="Upload Your Financial Data"
                description={`Welcome ${user?.name || 'there'}! Try our CSV upload with demo processing. Your data will be processed temporarily for this demo session.`}
              />

              {/* Demo Mode Notice */}
              <GlassCard className="p-4 border border-primary/30 bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-primary">Demo Mode Active</h4>
                    <p className="text-sm text-on-surface-variant">
                      Uploads are processed temporarily and not saved. <span className="underline cursor-pointer" onClick={() => navigate('/signup')}>Sign up</span> to save your data permanently.
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Error Display */}
              {error && (
                <GlassCard className="p-4 border border-error/30 bg-error/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-error" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-error">Upload Failed</h4>
                      <p className="text-sm text-on-surface-variant">{error}</p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Success Display */}
              {uploadResult && (
                <GlassCard className="p-4 border border-secondary/30 bg-secondary/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-secondary">Upload Successful!</h4>
                      <p className="text-sm text-on-surface-variant">
                        {uploadResult.summary.transactionsCreated} transactions processed. Redirecting to dashboard...
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

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
                      CSV only. Max 5MB. Demo processing only - data not permanently stored.
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={onDemoUpload}
                    disabled={!upload.isValid || busy}
                    loading={busy}
                    rightIcon={ArrowRight}
                  >
                    Process Demo Data
                  </Button>
                </div>
              </GlassCard>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="space-y-8"
            >
              <GlassCard className="p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-on-surface mb-4">Demo Features</h3>
                <ul className="space-y-3 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>Process your CSV file with our smart parser</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>Auto-categorize transactions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>View dashboard with your data</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>Get AI-powered insights</span>
                  </li>
                </ul>
              </GlassCard>

              <GlassCard className="p-6 sm:p-8 border-secondary/20">
                <h3 className="text-lg font-semibold text-secondary mb-4">Upgrade to Save</h3>
                <p className="text-sm text-on-surface-variant mb-4">
                  Sign up to save your data permanently and access advanced features.
                </p>
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/signup')}
                  className="w-full"
                >
                  Create Free Account
                </Button>
              </GlassCard>
            </motion.aside>
          </div>
        </PageContainer>
      </>
    )
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
              title="Upload a CSV. Get intelligent insights."
              description={`Welcome ${user?.name || 'back'}! Drop a bank-style export. We validate it locally, process it securely, and route you to a dashboard with real insights.`}
            />

            {/* Error Display */}
            {error && (
              <GlassCard className="p-4 border border-error/30 bg-error/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-error" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-error">Upload Failed</h4>
                    <p className="text-sm text-on-surface-variant">{error}</p>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Success Display */}
            {uploadResult && (
              <GlassCard className="p-4 border border-secondary/30 bg-secondary/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-secondary">Upload Successful!</h4>
                    <p className="text-sm text-on-surface-variant">
                      {uploadResult.summary.transactionsCreated} transactions processed. Redirecting to dashboard...
                    </p>
                  </div>
                </div>
              </GlassCard>
            )}

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
                    CSV only. Max 5MB. Your data is processed securely and stored privately.
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={onGenerate}
                  disabled={!upload.isValid || busy}
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
                <li>This build uses mock expense data for charts and analysis panels.</li>
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
