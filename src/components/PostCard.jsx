import React from 'react'
import service from '../appwrite/config'
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`} className="block group">
      <div className="w-full bg-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="w-full flex justify-center mb-4 overflow-hidden rounded-xl">
          <img
            src={service.getFileView(featuredImage)}
            alt={title}
            className="rounded-xl object-cover w-full h-48 group-hover:scale-105 transform transition-transform duration-300"
          />
        </div>
        <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
          {title}
        </h2>
      </div>
    </Link>
  )
}

export default PostCard
