// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UserProfile({params}:any){
    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Profile</h1>
            <hr/>
            <p className="text-4xl text-amber-50 bg-black">Profile Page 
                <span className="p-2 rounded  bg-amber-600">{params.id}</span>
            </p>
        </div>
    )
}