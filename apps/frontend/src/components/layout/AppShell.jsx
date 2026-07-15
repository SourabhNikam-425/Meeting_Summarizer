
import { Navbar } from './Navbar';





export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-slide-up">{children}</div>
      </main>
    </div>);

}