"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  { name: "À la une", href: "/" },
  { name: "Politique", href: "/politique" },
  { name: "Économie", href: "/economie" },
  { name: "International", href: "/international" },
  { name: "Culture", href: "/culture" },
  { name: "Sport", href: "/sport" },
  { name: "Société", href: "/societe" },
  { name: "Environnement", href: "/environnement" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      {/* Top bar */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between relative">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <span className="text-xs text-muted-foreground hidden md:block capitalize">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground whitespace-nowrap">
              The Etheria Times
            </h1>
          </Link>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="h-4 w-4" />
              <span className="sr-only">Rechercher</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
              <User className="h-4 w-4" />
              <span className="sr-only">Mon compte</span>
            </Button>
            <Button size="sm" className="hidden md:flex bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold px-4">
              S&apos;abonner
            </Button>
          </div>
        </div>
      </div>
      
      {/* Desktop navigation */}
      <nav className="hidden lg:block bg-background">
        <div className="mx-auto max-w-7xl px-4">
          <ul className="flex items-center justify-center">
            {categories.map((category, index) => (
              <li key={category.name}>
                <Link
                  href={category.href}
                  className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                    index === 0 
                      ? "text-primary font-semibold" 
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav className="lg:hidden border-b border-border bg-background">
          <ul className="px-4 py-2">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={category.href}
                  className="block px-2 py-3 text-sm font-medium text-foreground hover:text-primary transition-colors border-b border-border last:border-b-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
