import { title } from "process";
import { string, z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

interface projectType{
    title: string,
    // image: string | null,
    category: number,
    startDate : Date,
    endDate : Date,
    successCriteria: string,
}

export const projectsRouter = createTRPCRouter({
  createProject: publicProcedure
    .input(z.object({ 
        title: z.string(),
        category: z.number(), 
        startDate: z.date(),
         endDate: z.date(),
        successCriteria: z.string()}))
    .mutation(async ({ input, ctx }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const project: projectType = await ctx.prisma.project.create({
        data: {
            ...input,
        },
      });
      return project;
    }),
});