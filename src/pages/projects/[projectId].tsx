/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Project } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import SideBarLayout from "~/components/layouts/SideBarLayout";
import { api } from "~/utils/api";
import {BiSave} from 'react-icons/bi';
import {GiCancel} from 'react-icons/gi';
import {AiOutlineEdit} from 'react-icons/ai'
import Image from "next/image";
import { getImageUrl } from '~/utils/getImageUrl'



async function uploadFileToS3({
    getPresignedUrl,
    file,
  }: {
    getPresignedUrl: () => Promise<{
      url: string;
      fields: Record<string, string>;
    }>;
    file: File;
  }) {
    const { url, fields } = await getPresignedUrl();
    const data: Record<string, any> = {
      ...fields,
      "Content-Type": file.type,
      file,
    };
    const formData = new FormData();
    for (const name in data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      formData.append(name, data[name]);
    }
    await fetch(url, {
      method: "POST",
      body: formData,
    });
  }

const Projects: NextPage = () => {
  const [file, setFile] = useState<File | null | undefined>(null);
  const createPresignedUrlMutation = api.projects.createPresignedUrl.useMutation();

  const uploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    await uploadFileToS3({
      getPresignedUrl: () =>
        createPresignedUrlMutation.mutateAsync({
          projectId,
        }),
      file,
    });
    setFile(null);
    await projectQuery.refetch();

    // if (fileRef.current) {
    //   fileRef.current.value = "";
    // }
  };

  const router = useRouter();
  const projectId = router.query.projectId as string;
  const updateProject = api.projects.updateProjectTitle.useMutation();
  const projectQuery = api.projects.getProjectsById.useQuery(
    {
        projectId,
  },
  {
    enabled: !!projectId,
    });

  const [title, setTitle] = useState(projectQuery.data?.title as string);
  const [editingTitle, setEditingTitle] = useState(false);

  async function handleUpdateTitle(e:React.FormEvent){
    e.preventDefault();
    
    await updateProject.mutateAsync({
        title,
        projectId,
    });

    await projectQuery.refetch();
    setEditingTitle(false);
} 

    return (
      <>
      <main className="">
        <SideBarLayout >
          <div className="px-20">
            <form className="flex py-10" onSubmit={handleUpdateTitle}>
                {editingTitle ? (
                    <>
                        <input type="text" className="text-3xl font-bold w-fit text-gray-700" value={title} onChange={(e)=>{setTitle(e.target.value)}} defaultValue={projectQuery.data?.title}/>
                        <BiSave size={40} onClick={handleUpdateTitle} className="cursor-pointer"></BiSave>
                        <GiCancel size={35} className="cursor-pointer" onClick={(e)=>{setEditingTitle(!editingTitle)}}></GiCancel>
                    </>
                ):(
                    <>
                        <h1 className="text-3xl font-bold text-gray-700 px-2">{projectQuery.data?.title}</h1>
                        <button className="btn" onClick={(e)=>{setEditingTitle(!editingTitle)}}><AiOutlineEdit size={25}/></button>
                        
                    </>
                )}
            </form>
            <form className="px-10" onSubmit={uploadImage}>
                
                <label className="block mb-2 text-sm font-medium text-gray-900" htmlFor="file_input">Upload file</label>
                <div className="flex gap-1 ">
                    <input onChange={(e)=>{
                        if( !e.target.files || e.target.files === undefined)return; 
                        const i = e.target.files[0];
                        setFile(i)}} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" id="file_input" type="file"/>
                    <button type="submit" disabled={!file} className="text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Upload Image</button>
                </div>
            </form>
            {projectQuery.data && (
                <div className="">
                <img src={getImageUrl(projectQuery.data.image)} alt="project image" width={500} height={500}/>
            </div>
            )}
          </div>
        </SideBarLayout >
      </main>
      </>
      );
    }

    export default Projects;