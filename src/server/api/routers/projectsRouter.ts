/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { TRPCError } from "@trpc/server";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { env, title } from "process";
import { string, z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

interface projectType{
    title: string,
    status: string,
    favorite: boolean,
    // image: string | null,
    category: string,
    startDate : Date,
    endDate : Date,
    successCriteria: string,
}

const UPLOAD_MAX_FILE_SIZE = 1000000;

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "S3RVER",
    secretAccessKey: "S3RVER",
  },
});

export const projectsRouter = createTRPCRouter({

  createProject: protectedProcedure
    .input(z.object({ 
        title: z.string(),
        favorite: z.boolean(),
        category: z.string(), 
        status: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        successCriteria: z.string()}))
    .mutation(async ({ input, ctx }) => {
        const userId = ctx.session?.user.id;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const project: projectType = await ctx.prisma.project.create({
        data: {
            ...input,
            userId : userId,
        },
      });
      return project;
    }),

    updateProjectTitle: protectedProcedure
    .input(z.object({ title: z.string(), projectId: z.string()}))
    .mutation(async ({ input, ctx }) => {
        const userId = ctx.session?.user.id;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      await ctx.prisma.project.updateMany({
        where: {
            id: input.projectId,
            userId,
        },
        data: {
            title: input.title
        },
      });
      return {status: "updated"};
    }),

    getProjectsById: protectedProcedure
        .input(z.object({
            projectId: z.string()
        }))
        .query(({ctx, input})=>{
        return ctx.prisma.project.findUnique({
            where: {
                id: input.projectId,
            },
        });
      }),

    getProjects: protectedProcedure.query(({ctx})=>{
        return ctx.prisma.project.findMany({
            where: {
                userId: ctx.session.user.id,
            },
        });
      }),

      getFavoritedProjects: protectedProcedure.query(({ctx})=>{
        return ctx.prisma.project.findMany({
            where: {
                userId: ctx.session.user.id,
                favorite: true,
            },
        });
      }),

    createPresignedUrl: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const userId = ctx.session.user.id;
      const project = await ctx.prisma.project.findUnique({
        where: {
          id: input.projectId,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "the course does not exist",
        });
      }

      const image = uuidv4();
      await ctx.prisma.project.update({
        where: {
          id: project.id,
        },
        data: {
          image: image,
        },
      });

      return createPresignedPost(s3Client, {
        Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
        Key: image,
        Fields: {
          key: image,
        },
        Conditions: [
          ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
        ],
      });
    }),
});
