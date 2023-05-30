/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Project } from "@prisma/client";
import { NextPage } from "next";
import Card from "~/components/card";
import SideBarLayout from "~/components/layouts/SideBarLayout";
import { api } from "~/utils/api";

const Dashboard: NextPage = () => {


  const projects = api.projects.getFavoritedProjects.useQuery();

    return (
      <>
      <main className="">
        <SideBarLayout >
          <div className="flex flex-col sm:grid sm:grid-cols-2 mt-8">
            <div className="p-10"> 
              <h1 className="text-3xl px-3  text-gray-700">Favorited Projects</h1>
              <div className=" sm:grid sm:grid-rows-3 sm:grid-cols-2 sm:gap-2 mt-8 px-5 "> 
                {projects.data?.map((project) => (  
                  <Card key={project.id} project={project}></Card>
              ))}
              </div>
            </div>
            <div className="px-5 mt-10">
                <div className="p-5 mt-5 border border-red-600 h-5/6">
                  chart for progress
                </div>
                <div className="px-5 mt-2 border border-teal-500 h-2/6">
                  idk yet
                </div>
            </div>
          </div>
          
        </SideBarLayout >
      </main>
      </>
    );
  };
  
  export default Dashboard;