import React, { useState } from 'react'
import Seo from '../../components/common/Seo'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { setCredentials, type UserProfile } from '../../store/auth/slice'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { TOKEN_EXPIRY_BUFFER } from '../../constants'
import { z } from 'zod'

const SignIn: NextPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [remember, setRemember] = useState<boolean>(false)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

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

    const dispatch = useAppDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    type LoginResponse = {
        access_token: string
        token_type: string
        user: UserProfile
        [key: string]: any
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        const schema = z.object({
            email: z.string().email({ message: 'Please enter a valid email address' }),
            password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
        })

        const parsed = schema.safeParse({ email, password })
        if (!parsed.success) {
            const first = parsed.error.issues[0]
            setError(first.message)
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            const data: LoginResponse = await res.json()
            if (!res.ok) {
                setError(data?.message || (data?.errors && JSON.stringify(data.errors)) || 'Login failed')
                setLoading(false)
                return
            }

            const expiry = Date.now() + TOKEN_EXPIRY_BUFFER
            dispatch(setCredentials({ user: data.user, accessToken: data.access_token, tokenType: data.token_type, expiry }))

            try {
                if (remember) {
                    localStorage.setItem('auth', JSON.stringify({ user: data.user, accessToken: data.access_token, tokenType: data.token_type, expiry }))
                }
            } catch { }

            void router.push('/dashboard')
        } catch (err) {
            console.error('login error', err)
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Seo
                title="Sign in — e-PMS"
                description="Sign in to e-PMS to manage your projects, invoices and payments."
                keywords={["sign in", "login", "e-PMS", "project management"]}
                url="/sign-in"
            />

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
                        <form onSubmit={handleSubmit} className="w-full md:w-1/2 p-16 bg-card dark:bg-primary-dark rounded-lg shadow-lg">
                            <div className="flex mb-4 justify-center">
                                <Link href="/" aria-label="Home">
                                    <img src="/logo-ls.png" alt="emps logo" className="w-40 h-auto" />
                                </Link>
                            </div>

                            {error && <div className="mb-4 text-red-600 dark:text-red-400 text-sm text-center">{error}</div>}

                            <label className="block text-sm text-gray-600 dark:text-gray-300">Email</label>
                            <div className="relative mt-2">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16v16H4z" fill="none"></path>
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <input className="w-full pl-10 pr-3 py-2 mt-1 border border-gray-200 rounded-lg text-sm text-gray-600 bg-card dark:bg-transparent dark:border-gray-700 dark:text-white" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                            </div>

                            <label className="block text-sm text-gray-600 dark:text-gray-300 mt-4">Password</label>
                            <div className="relative mt-2">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                                </svg>
                                <input className="w-full pl-10 pr-3 py-2 mt-1 border border-gray-200 rounded-lg text-sm text-gray-600 bg-card dark:bg-transparent dark:border-gray-700 dark:text-white" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                            </div>

                            <div className="flex items-center justify-between mt-4 text-sm">
                                <label className="flex items-center text-gray-600 dark:text-gray-300"><input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="mr-2 text-gray-600" /> Remember me</label>
                                <a className="text-primary hover:underline" href="/reset-password">Forgot password?</a>
                            </div>

                            <button className="w-full mt-6 py-3 rounded-lg bg-primary hover:opacity-95 text-white font-semibold" type="submit">
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignIn
