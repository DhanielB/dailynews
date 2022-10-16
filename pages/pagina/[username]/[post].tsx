import { useRouter } from "next/router"
import Layout from "../../../components/Layout"

export default function username() {
  const router = useRouter()
  const { username, post } = router.query
  
  return (
    <Layout>
      {username} {post}
    </Layout>
  )
}