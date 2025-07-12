import { useCallback, useState } from "react"
import React from 'react'
import {useForm} from 'react-hook-form'
import service from '../../appwrite/config'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {Button,RTE,Input,Select} from '../index'

function PostForm({post}) {
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    
    const{register,handleSubmit,watch,setValue,control,getValues,formState: {errors}}=useForm({
        defaultValues: {
            title:post?.title || '',
            slug:post?.slug || '',
            content:post?.content || '',
            status:post?.status || 'active'
        }
    })
    const navigate=useNavigate();
    const userData=useSelector((state)=>state.auth.userData)
    
    const submit=async(data)=>{
        setError("")
        setLoading(true)
        
        try {
            console.log("Form data:", data) // Debug log
            
            if(post){
                // Updating existing post
                const file=data.image[0]?await service.uploadFile(data.image[0]):null;
                if(file){
                    service.deleteFile(post.featuredImage)
                }
                const dbPost=await service.updatePost(post.$id,{
                    ...data,
                    featuredImage:file?file.$id:undefined
                });
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                } else {
                    setError('Failed to update post')
                }
            }
            else{
                // Creating new post
                console.log("Creating new post...")
                console.log("User data:", userData)
                
                if (!userData || !userData.$id) {
                    setError("User not authenticated")
                    return
                }
                
                if (!data.image || !data.image[0]) {
                    setError("Please select an image")
                    return
                }
                
                console.log("Uploading file...")
                const file = await service.uploadFile(data.image[0])
                console.log("File uploaded:", file)
                
                if(file && file.$id){
                    const postData = {
                        title: data.title,
                        slug: data.slug,
                        content: data.content,
                        featuredImage: file.$id,
                        status: data.status,
                        userId: userData.$id
                    }
                    
                    console.log("Creating post with data:", postData)
                    const dbPost = await service.createPost(postData)
                    console.log("Post created:", dbPost)
                    
                    if(dbPost && dbPost.$id){
                        navigate(`/post/${dbPost.$id}`)
                    } else {
                        setError('Failed to create post - no post returned or missing $id')
                    }
                } else {
                    setError('Failed to upload file')
                }
            }
        } catch (error) {
            console.error('Error in submit:', error)
            setError(error.message || 'An error occurred while saving the post')
        } finally {
            setLoading(false)
        }
    }
    
    const slugTransform=useCallback((value)=>{
        if(value && typeof value==='string')
        return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]/g, '')
        .replace(/\s+/g,'-')
        return ''
    },[])
    
    React.useEffect(()=>{
        const subscription=watch((value,{name})=>{
            if(name==='title'){
                setValue('slug',slugTransform(value.title),{
                    shouldValidate:true
                })
            }
        })
        return ()=>{
            subscription.unsubscribe()
        }
    },[watch,slugTransform,setValue])
    
    return (
        <div className="w-full max-w-6xl mx-auto">
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
                <div className="w-2/3 px-2">
                    <Input
                        label="Title :"
                        placeholder="Title"
                        className="mb-4"
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mb-2">{errors.title.message}</p>
                    )}
                    
                    <Input
                        label="Slug :"
                        placeholder="Slug"
                        className="mb-4"
                        {...register("slug", { required: "Slug is required" })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                    {errors.slug && (
                        <p className="text-red-500 text-sm mb-2">{errors.slug.message}</p>
                    )}
                    
                    <div className="mb-4">
                        <label className="inline-block mb-1 pl-1">Content:</label>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="10"
                            placeholder="Write your content here..."
                            {...register("content", { required: "Content is required" })}
                        />
                        {errors.content && (
                            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                        )}
                    </div>
                </div>
                
                <div className="w-1/3 px-2">
                    <Input
                        label="Featured Image :"
                        type="file"
                        className="mb-4"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post ? "Featured image is required" : false })}
                    />
                    {errors.image && (
                        <p className="text-red-500 text-sm mb-2">{errors.image.message}</p>
                    )}
                    
                    {post && (
                        <div className="w-full mb-4">
                            <img
                                src={service.getFileView(post.featuredImage)}
                                alt={post.title}
                                className="rounded-lg"
                            />
                        </div>
                    )}
                    
                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        className="mb-4"
                        {...register("status", { required: true })}
                    />
                    
                    <Button 
                        type="submit" 
                        bgColor={post ? "bg-green-500" : "bg-blue-500"} 
                        className="w-full hover:bg-blue-600 rounded-full p-4"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : (post ? "Update" : "Submit")}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default PostForm


