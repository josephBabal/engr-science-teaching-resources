
// "use client"
import { redirect } from 'next/navigation'
import { FileUploadForm } from '../_components/FileUploadForm'
import { getCurrentUser } from '@/utils/authHelpers'
import { LinkUpload } from '../_components/LinkUpload'
import Link from 'next/link'



const DashboardPage = async () => {
  const user = await getCurrentUser()
  if (user?.role != "admin") {
    console.log("-- not admin")
    redirect("/unauthorized")
  }

  return (
    <div>
      <p> Admin page only </p>
      <Link href={`/dashboard/upload-resource?${new URLSearchParams({
        type: "file"
      })}`}> Upload resource </Link>
      {/* <FileUploadForm /> */}
     
    </div>
  )
}

export default DashboardPage


// export async function getServerData() {
//   const user = await getCurrentUser()
  
//   if (user.role != "admin") {
//     return redirect('/auth/login')
//   }
//   return {
//     props: {
//       userData,
//     },
//   };
// }