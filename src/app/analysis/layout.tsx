export default function Layout({
  children,
}: {
  modals: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
}