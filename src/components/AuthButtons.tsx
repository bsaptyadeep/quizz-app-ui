import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react'

export default function AuthButtons() {
  const { isSignedIn } = useUser()

  if (isSignedIn) {    
    return (
      <div className="flex items-center gap-3">
        <UserButton />
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <SignInButton mode="modal">
        <button className="px-4 py-2 text-gray-700 font-medium cursor-pointer">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="px-4 py-2 text-[#720dff] border-2 border-[#720dff] rounded-lg font-medium cursor-pointer">
          Sign Up
        </button>
      </SignUpButton>
    </div>
  )
}

