import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import authService from '../appwrite/auth'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const [error, setError] = useState("")

  const login = async (data) => {
    setError("")
    try {
      const session = await authService.login(data)
      if (session) {
        const userdata = await authService.getCurrentUser()
        if (userdata) {
          dispatch(authLogin(userdata))
          navigate("/")
        }
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="mx-auto w-full max-w-md bg-white rounded-2xl shadow-lg p-10 border border-gray-300">
        <div className="mb-6 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-4">
          Sign in to your account
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            Sign Up
          </Link>
        </p>
        {error && (
          <p className="mb-6 text-center text-red-600 font-medium">{error}</p>
        )}
        <form onSubmit={handleSubmit(login)} className="space-y-6">
          <Input
            label="Email:"
            placeholder="Enter your email"
            type="email"
            className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("email", {
              required: true,
              validate: {
                matchPattern: (value) =>
                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
              },
            })}
          />
          <Input
            label="Password:"
            placeholder="Enter your valid password"
            type="password"
            className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("password", { required: true })}
          />
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-md transition-colors duration-200"
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
