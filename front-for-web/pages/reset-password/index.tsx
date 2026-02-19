import React, { useEffect, useState } from 'react'
import Seo from '../../components/Seo'
import type { NextPage } from 'next'

const ResetPassword: NextPage = () => {
    const [step, setStep] = useState<number>(1)
    const [email, setEmail] = useState<string>('')
    const [code, setCode] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirm, setConfirm] = useState<string>('')
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    function sendCode(e: React.FormEvent) {
        e.preventDefault()
        setStep(2)
    }

    function verifyCode(e: React.FormEvent) {
        e.preventDefault()
        setStep(3)
    }

    function setNewPassword(e: React.FormEvent) {
        e.preventDefault()
        if (password !== confirm) {
            alert('Passwords do not match')
            return
        }
        alert('Password updated — you can now sign in')
        setStep(1)
    }

    useEffect(() => {
        if (typeof window === 'undefined') return
        try {
            const stored = localStorage.getItem('theme')
            if (stored === 'light' || stored === 'dark') {
                setTheme(stored)
                return
            }
        } catch { }

        try {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        } catch { }
    }, [])

    useEffect(() => {
        if (typeof document === 'undefined') return
        try {
            if (document.documentElement) document.documentElement.classList.toggle('dark', theme === 'dark')
        } catch {}
        try {
            if (document.body) document.body.classList.toggle('dark', theme === 'dark')
        } catch {}

        try { localStorage.setItem('theme', theme) } catch { }
    }, [theme])

    return (
        <>
            <Seo title="Reset password — Trezo" description="Reset your Trezo password" url="/reset-password" />

            <div className="min-h-screen flex items-center justify-center p-10 bg-gray-100 dark:bg-primary-dark">
                <button
                    aria-label="Toggle theme"
                    type="button"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="fixed right-5 top-5 z-50 p-2 rounded-full text-secondary focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                        <path d="M4.93 4.93l1.41 1.41" />
                        <path d="M17.66 17.66l1.41 1.41" />
                        <path d="M2 12h2" />
                        <path d="M20 12h2" />
                        <path d="M4.93 19.07l1.41-1.41" />
                        <path d="M17.66 6.34l1.41-1.41" />
                    </svg>
                </button>

                <div className="w-full max-w-5xl">
                    <div className="flex flex-col items-center justify-center md:flex-row bg-transparent rounded-lg overflow-hidden">
                        <div className='w-full md:w-1/2 p-16 bg-card dark:bg-primary-dark rounded-lg shadow-lg'>
                            <div className="flex mb-4 justify-center">
                                <img src="/logo-ls.png" alt="emps logo" className="w-40 h-auto mb-4 mt-4" />
                            </div>
                            {step === 1 && (
                                <form onSubmit={sendCode}>
                                    <label className="block text-sm text-gray-600 dark:text-gray-300">Enter your account email</label>
                                    <div className="relative mt-2">
                                        <input className="w-full pl-3 pr-3 py-2 mt-1 border border-gray-200 rounded-lg text-sm bg-card dark:bg-transparent dark:border-gray-700 dark:text-white" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                                    </div>

                                    <button className="w-full mt-6 py-3 rounded-lg bg-primary hover:opacity-95 text-white font-semibold" type="submit">Send verification code</button>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={verifyCode}>
                                    <label className="block text-sm text-gray-600 dark:text-gray-300">Enter verification code</label>
                                    <div className="relative mt-2">
                                        <input className="w-full pl-3 pr-3 py-2 mt-1 border border-gray-200 rounded-lg text-sm bg-card dark:bg-transparent dark:border-gray-700 dark:text-white" type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" required />
                                    </div>

                                    <div className="flex items-center justify-between mt-4 text-sm">
                                        <button type="button" onClick={() => setStep(1)} className="text-gray-600 dark:text-gray-300 hover:underline">Back</button>
                                        <button className="py-2 px-4 rounded bg-primary text-white font-semibold" type="submit">Verify</button>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <form onSubmit={setNewPassword}>
                                    <label className="block text-sm text-gray-600 dark:text-gray-300">New password</label>
                                    <div className="relative mt-2">
                                        <input className="w-full pl-3 pr-3 py-2 mt-1 border border-gray-200 rounded-lg text-sm bg-card dark:bg-transparent dark:border-gray-700 dark:text-white" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required />
                                    </div>

                                    <label className="block text-sm text-gray-600 dark:text-gray-300 mt-4">Confirm password</label>
                                    <div className="relative mt-2">
                                        <input className="w-full pl-3 pr-3 py-2 mt-1 border border-gray-200 rounded-lg text-sm bg-card dark:bg-transparent dark:border-gray-700 dark:text-white" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" required />
                                    </div>

                                    <div className="flex items-center justify-between mt-4 text-sm">
                                        <button type="button" onClick={() => setStep(2)} className="text-gray-600 dark:text-gray-300 hover:underline">Back</button>
                                        <button className="py-2 px-4 rounded bg-primary text-white font-semibold" type="submit">Set new password</button>
                                    </div>
                                </form>
                            )}
                        </div>
                       
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword
