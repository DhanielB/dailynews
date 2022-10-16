import { useUser } from '../lib/auth/hooks'

const Profile = () => {
  const user = useUser({ redirectTo: '/login' })

  return (
    <div>
      <h1>Profile</h1>

      {user && (
        <>
          <p>Your session:</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )}

      <style jsx>{`
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  )
}

export default Profile
