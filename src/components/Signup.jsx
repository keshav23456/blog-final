import { useState } from "react"
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from "../appwrite/auth"
import { login } from "../store/authSlice"
import { Button, Input, Logo } from './index'
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"

function Signup() {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const [error, setError] = useState("")

  const create = async (data) => {
    setError("")
    try {
      const userData = await authService.createAccount(data)
      if (userData) {
        const userData = await authService.getCurrentUser()
        if (userData) {
          dispatch(login(userData))
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
          Sign up to create account
        </h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            Sign In
          </Link>
        </p>
        {error && (
          <p className="mb-6 text-center text-red-600 font-medium">{error}</p>
        )}
        <form onSubmit={handleSubmit(create)} className="space-y-6">
          <Input
            label="Name:"
            placeholder="Enter Name"
            className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("name", { required: true })}
          />
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
            placeholder="Enter your password"
            type="password"
            className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register("password", { required: true })}
          />
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold py-3 rounded-md transition-colors duration-200"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Signup
