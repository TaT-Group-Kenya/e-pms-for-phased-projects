import React, { useEffect, useState } from 'react'
import Seo from '../../components/common/Seo'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAppDispatch } from '../../store/hooks'
import { setCredentials } from '../../store/auth/slice'
import { TOKEN_EXPIRY_BUFFER } from '../../constants'
import { z } from 'zod'

const ResetPassword: NextPage = () => {
    const [step, setStep] = useState<number>(1)
    const [email, setEmail] = useState<string>('')
    const [token, setToken] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirm, setConfirm] = useState<string>('')
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [info, setInfo] = useState<string | null>(null)
    const dispatch = useAppDispatch()
    const router = useRouter()

    async function handleSubmitForgot(e: React.FormEvent) {
        e.preventDefault()

        setError(null)
        setInfo(null)
        setLoading(true)
        const schema = z.object({ email: z.string().email({ message: 'Please enter a valid email' }) })
        const parsed = schema.safeParse({ email })
        if (!parsed.success) {
            const first = parsed.error.issues[0]
            setError(first.message)
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/auth/forgot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.message || 'Failed to send reset link')
                return
            }
            setStep(2)
            setInfo(data.message || 'Reset link sent — check your email')
        } catch (err: any) {
            setError(err.message || 'Unexpected error')
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmitReset(e: React.FormEvent) {
        e.preventDefault()

        setError(null)
        setInfo(null)
        setLoading(true)
        const schema = z.object({
            token: z.string().min(1, { message: 'Verification code is required' }),
            password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
            password_confirmation: z.string().min(1),
        }).superRefine((vals, ctx) => {
            if (vals.password !== vals.password_confirmation) {
                ctx.addIssue({ code: 'custom', message: 'Passwords must match', path: ['password_confirmation'] })
            }
        })

        const parsed = schema.safeParse({ token, password, password_confirmation: confirm })
        if (!parsed.success) {
            const first = parsed.error.issues[0]
            setError(first.message)
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/auth/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, password, password_confirmation: confirm }),
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.message || 'Failed to reset password')
                setLoading(false)
                return
            }

            if (data.access_token && data.user) {
                const expiry = Date.now() + TOKEN_EXPIRY_BUFFER
                dispatch(setCredentials({ user: data.user, accessToken: data.access_token, expiry }))
            }

            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Unexpected error')
        } finally {
            setLoading(false)
        }
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
        } catch { }
        try {
            if (document.body) document.body.classList.toggle('dark', theme === 'dark')
        } catch { }

        try { localStorage.setItem('theme', theme) } catch { }
    }, [theme])

    return (
        <>
            <Seo title="Reset password — e-PMS" description="Reset your e-PMS password" url="/reset-password" />

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
                                <Link href="/" aria-label="Home">
                                    <img src="/logo-ls.png" alt="emps logo" className="w-40 h-auto mb-4 mt-4" />
                                </Link>
                            </div>
                            {error && <div className="mb-4 text-red-600 dark:text-red-400 text-sm text-center">{error}</div>}
                            {info && <div className="mb-4 text-green-600 dark:text-green-400 text-sm text-center">{info}</div>}

                            {step === 1 && (
                                <form onSubmit={handleSubmitForgot}>
                                    <label className="block text-sm text-gray-600 dark:text-gray-300">Email</label>
                                    <div className="relative mt-2">
                                        <input className="w-full pl-3 pr-3 py-2 mt-1 border border-gray-200 rounded-lg text-sm text-gray-600 bg-card dark:bg-transparent dark:border-gray-700 dark:text-white" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                                    </div>

                                    <div className="flex items-center justify-between mt-4 text-sm">
                                        <Link href="/sign-in" className="text-gray-600 dark:text-gray-300 hover:underline">Back to sign in</Link>
                                        <button className="py-2 px-4 rounded bg-primary text-white font-semibold" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send verification code'}</button>
                                    </div>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleSubmitReset}>
                                    <label className="block text-sm text-gray-600 dark:text-gray-300">Verification code</label>
                                    <div className="relative mt-2">
                                        <input className="w-full pl-3 pr-3 py-2 mt-1 border border-gray-200 rounded-lg text-sm text-gray-600 bg-card dark:bg-transparent dark:border-gray-700 dark:text-white" type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Paste verification code from email" required />
                                    </div>

                                    <label className="block text-sm text-gray-600 dark:text-gray-300 mt-4">New password</label>
                                    <div className="relative mt-2">
                                        <input className="w-full pl-3 pr-3 py-2 mt-1 border border-gray-200 rounded-lg text-sm text-gray-600 bg-card dark:bg-transparent dark:border-gray-700 dark:text-white" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" required />
                                    </div>

                                    <label className="block text-sm text-gray-600 dark:text-gray-300 mt-4">Confirm password</label>
                                    <div className="relative mt-2">
                                        <input className="w-full pl-3 pr-3 py-2 mt-1 border border-gray-200 rounded-lg text-sm text-gray-600 bg-card dark:bg-transparent dark:border-gray-700 dark:text-white" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" required />
                                    </div>

                                    <div className="flex items-center justify-between mt-4 text-sm">
                                        <button type="button" onClick={() => setStep(1)} className="text-gray-600 dark:text-gray-300 hover:underline">Back</button>
                                        <button className="py-2 px-4 rounded bg-primary text-white font-semibold" type="submit" disabled={loading}>{loading ? 'Working…' : 'Set new password'}</button>
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
