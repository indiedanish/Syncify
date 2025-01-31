import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Header from "../components/header";
import { Toaster } from "sonner";
import { Github, Linkedin, Send } from "lucide-react";

export const metadata = {
  title: "Syncify - AI Career Coach",
  description: "An AI-powered platform that helps job seekers with mock interviews, resume building, personalized cover letters, and industry insights to boost their career success.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">
              {children}
              <Toaster />
            </main>
          </ThemeProvider>
          <footer className="bg-black text-white text-center h-10 flex items-center justify-center fixed bottom-0 left-auto w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
            <div className="space-x-4 flex justify-center items-center">
              <p>Made by Danish Butt ❤️ @indiedanish</p>
              <a
                href="https://www.linkedin.com/in/indiedanish"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 flex items-center justify-center gap-1"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="https://github.com/indiedanish"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 flex items-center justify-center gap-1"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="https://indiedanish.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 flex items-center justify-center gap-1"
              >
                <Send className="h-4 w-4" />
                Portfolio
              </a>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
