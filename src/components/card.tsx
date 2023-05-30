/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type Project } from "@prisma/client";


const Card= ( {project}: {project: Project} ) => {

   return (
       <>
            <a href={`/projects/${project.id}`} className="block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-500 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{project.title}</h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">{project.status} <br/> {project.category} <br/> {project.endDate.toDateString()} <br/> </p> 
            </a>
       </>
   );
 };
 
 export default Card;