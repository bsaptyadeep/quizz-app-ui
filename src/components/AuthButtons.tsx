import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react'

export default function AuthButtons() {
  const { isSignedIn, user } = useUser()

  if (isSignedIn) {
    // Get user's email or name
    const displayName = user?.fullName || 
                       user?.firstName || 
                       user?.primaryEmailAddress?.emailAddress || 
                       'User'
    
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700 font-medium">
          {displayName}
        </span>
        <UserButton />
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <SignInButton mode="modal">
        <button className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition-colors font-medium">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
          Sign Up
        </button>
      </SignUpButton>
    </div>
  )
}

