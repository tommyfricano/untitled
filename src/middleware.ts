/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default async function middleware(req: NextRequest){
    const url = req.nextUrl.clone();

    const{
        data: {auth},
    } = await fetch(`${url.origin}/api/authSSR`, {
        headers: req.headers,
    }).then((res) =>  res.json());

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    url.search = new URLSearchParams(`callback=${url}`).toString();
    url.pathname = `/api/auth/signin`;

    return !auth ? NextResponse.redirect(url) : NextResponse.next();
}

export const config = {
    matcher: ["/dashboard", "/project/plan","/project/view"],
  };