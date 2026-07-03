import React, { useState } from 'react';

const Github = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.4 5 1.8 5 1.8a5.4 5.4 0 0 0-.1 3.8A5.4 5.4 0 0 0 3 9.4c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path><path d="M9 18c-4.5 1.5-5-2.5-7-3"></path></svg>;
const Linkedin = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
const Instagram = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;

export default function Footer() {
  const [showContact, setShowContact] = useState(false);

  return (
    <footer className="border-t border-white/10 bg-[#05050A] pt-20 pb-10 relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="text-xl font-bold tracking-tight mb-6">CourseFlow</div>
            <p className="text-white/40 text-sm mb-6">The intelligent academic planning platform built for modern students.</p>
            <div className="flex gap-4">
              <a href="https://github.com/Himanshu-kushwaha9654" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white"><Github className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/in/himanshu-kushwaha-410097330/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white"><Linkedin className="w-5 h-5" /></a>
              <a href="https://www.instagram.com/_itx_himanshu_kushwaha/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#dashboard" className="hover:text-white">Dashboard</a></li>
              <li><a href="#roadmap" className="hover:text-white">Roadmap</a></li>
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="/login" className="hover:text-white">Courses</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-white">Documentation</a></li>
              <li><a href="https://github.com/Himanshu-kushwaha9654" target="_blank" rel="noopener noreferrer" className="hover:text-white">GitHub</a></li>
              <li><a href="#" className="hover:text-white">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li>
                {showContact ? (
                  <a href="tel:+919654527702" className="text-teal-400 font-bold hover:text-teal-300 transition-colors">
                    +91 9654527702
                  </a>
                ) : (
                  <button onClick={() => setShowContact(true)} className="hover:text-white transition-colors">
                    Contact
                  </button>
                )}
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-center text-white/30 text-sm">
          © 2026 CourseFlow Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}