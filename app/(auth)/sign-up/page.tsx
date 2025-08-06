"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from "zod"
import Link from 'next/link'
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/app/schemas/signupSchema"
import axios,{AxiosError} from "axios"
import { ApiResponse } from "@/app/types/apiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Loader2} from "lucide-react"



const Page = () => {
    const [username, setUsername] = useState("")
    const [usernamemsg, setUsernamemsg] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debouncedUsername=useDebounceCallback(setUsername, 500)
    const router=useRouter()
    // zod
    const form=useForm<z.infer<typeof signupSchema>>({
        resolver:zodResolver(signupSchema),
        defaultValues:{
            username: "",
            email: "",
            password: ""
        }
    })
    useEffect(()=>{
        const checkUsername= async () => {
            console.log("Checking username:", username)
            if(!username) return;
            setIsCheckingUsername(true)
            setUsernamemsg("")
      try {
           const res = await axios.get(`/api/checkusername?username=${username}`)
           console.log(res.data.message)
           setUsernamemsg(res.data.message)
          }
          catch (error) {
        const axiosError= error as AxiosError<ApiResponse>
        setUsernamemsg(axiosError.response?.data.message || "An error occurred while checking username")
          }
          finally {
            setIsCheckingUsername(false)
          }      
      } 
        checkUsername()
    },[username])

    const onSubmit=async (data:z.infer<typeof signupSchema>)=>{
setIsSubmitting(true)
try {
   const res= await axios.post("/api/sign-up", data)
    if(res.status===201){
     toast.success("Account created successfully")
     router.replace(`verify/${data.username}`)
     setIsSubmitting(false)
    }
} catch (error) {
    const axiosError = error as AxiosError<ApiResponse>
    if(axiosError.response?.status===409){
      toast.error(axiosError.response.data.message)
    } else {
      toast.error("An error occurred while creating account")
    }
    setIsSubmitting(false)
  }
}
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
<Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} onChange={(e)=>{
                    field.onChange(e)
                    debouncedUsername(e.target.value)
                }} />
              </FormControl>
              {
                isCheckingUsername && <Loader2 className="ml-2 h-4 w-4 animate-spin inline-block" />
              }
              <p>
                {usernamemsg && (
                  <span className={`text-sm ${usernamemsg.includes("available") ? "text-green-600" : "text-red-600"}`}>
                    {usernamemsg}
                  </span>
                )}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
            ) : "Create Account"}
        </Button>
    </form>

</Form>
        <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
                Sign In
            </Link>
        </div>

    </div>
    </div>
    )
}
export default Page
