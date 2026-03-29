export default function PageContainer({ children, className = '' }) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14 ${className}`.trim()}
    >
      {children}
    </div>
  )
}
