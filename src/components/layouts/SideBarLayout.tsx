import React, { FC, ReactNode, useState } from "react";
import {BsArrowLeftSquare, BsSearch, BsChevronDown} from 'react-icons/bs';
import {RiDashboardLine} from 'react-icons/ri';
import {SlLogout, SlLogin} from 'react-icons/sl';
import {AiOutlineProject, AiOutlineUser, AiOutlineExperiment} from 'react-icons/ai';
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";


interface Props {
     children?: ReactNode
    // any props that come into the component
}


const SideBarLayout:FC<Props> = ( {children, ...props} ) => {
    const [open, setOpen] = useState(true);
    const [subOpen, setSubOpen] = useState(false);

    const user = useSession();

    const  menu = [
        {title: "Dashboard", icon: <RiDashboardLine/>, spacing: false, link: "/dashboard",},
        {title: "Projects", icon: <AiOutlineProject/>, spacing: false, link: "",
            submenu: true,
            items: [
                {title: "Plan new project", link: "/projects/plan"},
                {title: "View projects", link: "/projects/view"}, 
            ]
        },
        {title: "The Process", icon: <AiOutlineExperiment/>, spacing: false, link: "/process",},
    ]

    return (
        <>
            <div className="flex">
                <div className={`relative h-screen bg-sky-700 p-5 pt-16 ${open ? "w-72" : "w-20"} duration-300 relative`}>
                    <BsArrowLeftSquare 
                    className={`bg-slate-200 text-sky-700 text-3xl 
                    absolute -right-3 rounded 
                    transition hover:scale-125 duration-300 
                    ${!open ? "rotate-180": "rotate-0"}`}
                    onClick={()=>{setOpen(!open)}}
                    />
                    <div className="inline-flex -mt-10" >
                        <Link href="/" className="text-3xl text-center bg-slate-200 border border-sky-900 rounded w-8 h-8 cursor-pointer"/>
                        <h1 className={`text-2xl px-3 font-semibold text-slate-200 ${!open ? "scale-0" : ""} duration-150 `}>Untitled</h1>
                    </div>
                        <form onSubmit={()=>{ alert('hi')}} className={`flex items-center rounded-md bg-slate-200 py-2 mt-6 ${!open ? "px-2.5" : "px-3"}`}>
                            <BsSearch className={`text-lg block float-left cursor-pointer ${!open ? "mr-0" : "mr-2"}`} />
                            <input placeholder="Search Projects" className={`text-base bg-transparent w-full text-sky-800 focus:outline-none ${!open ? "hidden" : ""}`}/>
                        </form>

                    <ul className="pt-3">
                        {menu.map((item, index)=> (
                            <>
                            {item.submenu ? (
                                <li key={index} className={`text-slate-200 p-2 text-sm flex items-center gap-x-4 cursor-pointer hover:bg-gray-500 rounded-md ${item.spacing ? "mt-24" : "mt-2"}`}>
                                <span className="text-xl block float-left mt-0.5">
                                    {item.icon}
                                </span>
                                <span className={`text-base flex-1 font-medium duration-150 ${!open ? "hidden" : ""}`}>{item.title}</span>
                                {item.submenu && (
                                    <BsChevronDown className={`mt-1.5 ${subOpen ? "rotate-180": ""}`} onClick={()=>{setSubOpen(!subOpen)}}/>
                                )}
                                </li>
                            ): (
                                <Link href={item.link} key={index} className={`text-slate-200 p-2 text-sm flex items-center gap-x-4 cursor-pointer hover:bg-gray-500 rounded-md ${item.spacing ? "mt-24" : "mt-2"}`}>
                                <span className="text-xl block float-left mt-0.5">
                                    {item.icon}
                                </span>
                                <span className={`text-base flex-1 font-medium duration-150 ${!open ? "hidden" : ""}`}>{item.title}</span>
                                {item.submenu && (
                                    <BsChevronDown className={`mt-1.5 ${subOpen ? "rotate-180": ""}`} onClick={()=>{setSubOpen(!subOpen)}}/>
                                )}
                            </Link>
                            )}
                            
                            
                            {item.submenu && subOpen && open && (
                                <ul>
                                    {item.items.map((subItem, subindex)=>(
                                        <Link href={subItem.link} key={subindex} className={`text-slate-200 p-2 px-5 text-sm flex items center gap-x-4 cursor-pointer hover:bg-gray-500 rounded-md`}>
                                            {subItem.title}
                                        </Link>
                                    ))}
                                </ul>
                            )}
                            
                            </>
                        ))}
                        {user.data ? (
                            <>
                                <Link href="/account" className={`text-slate-200 p-2 text-sm flex items center gap-x-4 cursor-pointer hover:bg-gray-500 rounded-md mt-80`}>
                                    <span className="text-xl block float-left mt-0.5">
                                        <AiOutlineUser />
                                    </span>
                                    <span className={`text-base flex-1 font-medium duration-150 ${!open ? "hidden" : ""}`}>Account</span>
                                </Link>
                                <li onClick={() => {void signOut();}} className={`text-slate-200 p-2 text-sm flex items center gap-x-4 cursor-pointer hover:bg-gray-500 rounded-md`}>
                                    <span className="text-xl block float-left mt-0.5">
                                        <SlLogout />
                                    </span>
                                    <span className={`text-base flex-1 font-medium duration-150 ${!open ? "hidden" : ""}`}>logout</span>
                                </li> 
                            </>
                        ):(
                            <li onClick={() => {void signIn();}} className={`text-slate-200 p-2 mt-2 text-sm flex items center gap-x-4 cursor-pointer hover:bg-gray-500 rounded-md`}>
                                    <span className="text-xl block float-left mt-0.5">
                                        <SlLogin />
                                    </span>
                                    <span className={`text-base flex-1 font-medium duration-150 ${!open ? "hidden" : ""}`}>login</span>
                            </li> 
                        )}
                       
                    </ul>
                </div>
                <main className="flex container">{children}</main>
            </div>

        </>
    );
  };
  
  export default SideBarLayout;