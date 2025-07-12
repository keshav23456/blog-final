import React, { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import service from '../appwrite/config'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Move the API call inside useEffect
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const response = await service.getPosts([])
                if (response) {
                    setPosts(response.documents)
                }
            } catch (err) {
                setError(err.message)
                console.error('Error fetching posts:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, []) // Empty dependency array means this runs once on mount

    if (loading) {
        return (
            <div className='w-full py-8'>
                <Container>
                    <div className='text-center'>Loading posts...</div>
                </Container>
            </div>
        )
    }

    if (error) {
        return (
            <div className='w-full py-8'>
                <Container>
                    <div className='text-center text-red-500'>
                        Error loading posts: {error}
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard {...post} />
                            </div>
                        ))
                    ) : (
                        <div className='w-full text-center'>
                            No posts available
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts