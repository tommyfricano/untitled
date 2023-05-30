import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { SetStateAction, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import SideBarLayout from "~/components/layouts/SideBarLayout";
import { api } from "~/utils/api";


const CreateProject: NextPage= () => {

    const createProjectMutation = api.projects.createProject.useMutation();

    const router = useRouter();
    const userId = useSession().data?.user.id;

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Personal");
    const [dates, setDates] = useState({ 
        startDate: new Date(),
        endDate: new Date()
        }); 
    const [successCriteria, setSuccessCriteria] = useState("");
    const [favorite, setFavorite] = useState(false);
        //todo check for max favorites
        const handleDateChange = (newValue)=> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setDates(newValue);
            setDates({
                startDate: new Date(dates.startDate),
                endDate: new Date(dates.endDate),
            }) 
        } 

        async function handleSubmitProject(e:React.FormEvent){
            e.preventDefault();
            
            await createProjectMutation.mutateAsync({
                title,
                favorite,
                category,
                status: "Initial stage",
                startDate: dates.startDate,
                endDate: dates.endDate,
                successCriteria,
            });

            void router.push("/dashboard");

        }

   return (
       <>
       <SideBarLayout>
            <div className=" px-3 pt-3 sm:pt-10 md:pt-10 lg:px-40 lg:pt-24 flex flex-col"> 
                <h1 className="text-lg lg:text-3xl ">Your project starts now!</h1>
                <form className="py-3 lg:py-6 flex flex-col" onSubmit={handleSubmitProject}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                        <input type="" id="title" onChange={(e)=>{setTitle(e.target.value)}} className="text-sm rounded-lg block w-full p-2.5 bg-gray-500 border-gray-300 placeholder-gray-300 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Untitled?" required/>
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                        <div>
                            <label  htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Select a category</label>
                            <select id="category" value={category} onChange={(e)=>{setCategory(e.target.value)}} className=" text-sm rounded-lg block w-full p-2.5 dark:bg-gray-500 border-gray-300 placeholder-gray-300 text-white focus:ring-blue-500 focus:border-blue-500" required>
                            <option value={"Personal"}>Personal</option>
                            <option value={"School"}>School</option>
                            <option value={"Software"}>Software</option>
                            <option value={"Design"}>Design</option>
                            <option value={"DIY"}>DIY</option>
                            <option value={"Other"}>Other</option>
                            </select>
                        </div>
                        <div className="">
                        <label  className="block mb-2 text-sm font-medium text-gray-900">Select dates</label>
                            <Datepicker 
                            primaryColor={"sky"}
                            value={dates} 
                            onChange={handleDateChange} 
                            showShortcuts={true} 
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Success Criteria</label>
                        <textarea id="message" rows={3} onChange={(e)=>{setSuccessCriteria(e.target.value)}} className="block p-2.5 w-full text-sm rounded-lg border bg-gray-500 border-gray-300 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Shoot for the stars! and use some bullet points!" required></textarea>
                    </div>
                    <div className="flex items-center mb-4">
                        <input id="default-checkbox" onChange={(e)=>{setFavorite(!favorite)}} type="checkbox" value="true" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "/>
                        <label  className="ml-2 block text-sm font-medium text-gray-900">Favorite this project?</label>
                    </div>
                    <button type="submit" className="text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Create my Project</button>
                </form>
           </div>
       </SideBarLayout>
       </>
   );
 };
 
 export default CreateProject;