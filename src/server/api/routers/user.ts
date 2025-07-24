import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { hashPassword } from "~/lib/auth";
import { sendPasswordResetEmail } from "~/lib/email";
import {
  createPasswordResetToken,
  generatePasswordResetUrl,
  markTokenAsUsed,
  validatePasswordResetToken,
} from "~/lib/password-reset";
import userSchema from "~/schema/user-schema";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Roles, type User } from "~/types/user";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }): Promise<User | null> => {
    try {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        return null;
      }

      return user;
    } catch {
      return null;
    }
  }),

  forgotPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { email } = input;

      const user = await ctx.db.user.findUnique({
        where: { email },
      });

      if (!user) {
        return { success: true };
      }

      try {
        const token = await createPasswordResetToken(user.id);
        const resetPasswordLink = generatePasswordResetUrl(token);

        await sendPasswordResetEmail({
          userEmail: user.email,
          userName: user.name,
          resetPasswordLink,
        });

        return { success: true };
      } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Fehler beim Senden der E-Mail",
        });
      }
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        password: z.string().min(6),
        passwordConfirmation: z.string().min(6),
        token: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { password, passwordConfirmation, token } = input;

      if (password !== passwordConfirmation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwörter stimmen nicht überein",
        });
      }

      const validation = await validatePasswordResetToken(token);

      if (!validation.valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: validation.error ?? "Ungültiger Token",
        });
      }

      try {
        const hashedPassword = await hashPassword(password);

        await ctx.db.user.update({
          where: { id: validation.user!.id },
          data: { password: hashedPassword },
        });

        await markTokenAsUsed(validation.tokenId!);

        return { success: true };
      } catch (error) {
        console.error("Error resetting password:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Fehler beim Zurücksetzen des Passworts",
        });
      }
    }),

  fetchAll: protectedProcedure.query(async ({ ctx }) => {
    const userRole = ctx.session.user.role;

    if (userRole !== Roles.SUPERADMIN && userRole !== Roles.ADMIN) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Keine Berechtigung zum Anzeigen von Benutzern",
      });
    }

    try {
      return await ctx.db.user.findMany();
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }),

  fetchPaginated: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        pageSize: z.number().default(10),
        sortBy: z.string().optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, sortBy, sortOrder } = input;
      const userRole = ctx.session.user.role;

      if (userRole !== Roles.SUPERADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Keine Berechtigung zum Anzeigen von Benutzern",
        });
      }

      const skip = (page - 1) * pageSize;

      const orderBy =
        sortBy && sortOrder
          ? { [sortBy]: sortOrder }
          : { createdAt: "desc" as const };

      try {
        const [users, total] = await Promise.all([
          ctx.db.user.findMany({
            orderBy,
            skip,
            take: pageSize,
          }),
          ctx.db.user.count(),
        ]);

        return {
          data: users,
          meta: {
            pagination: {
              page,
              pageSize,
              pageCount: Math.ceil(total / pageSize),
              total,
            },
          },
        };
      } catch (error) {
        console.error("Error fetching users:", error);
        return {
          data: [],
          meta: {
            pagination: {
              page: 1,
              pageSize: 10,
              pageCount: 1,
              total: 0,
            },
          },
        };
      }
    }),

  fetchById: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { documentId } = input;
      const userRole = ctx.session.user.role;

      if (userRole !== Roles.SUPERADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Keine Berechtigung zum Anzeigen von Benutzern",
        });
      }

      try {
        const user = await ctx.db.user.findUnique({
          where: { id: documentId },
        });

        if (!user) {
          return null;
        }

        return user;
      } catch {
        return null;
      }
    }),

  create: protectedProcedure
    .input(userSchema)
    .mutation(async ({ input, ctx }) => {
      const userRole = ctx.session.user.role;

      if (userRole !== Roles.SUPERADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Keine Berechtigung zum Erstellen von Benutzern",
        });
      }

      const { name, email, password, passwordConfirmation } = input;

      if (password !== passwordConfirmation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwörter stimmen nicht überein",
        });
      }

      const existingUser = await ctx.db.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Benutzer mit dieser E-Mail oder diesem Benutzernamen existiert bereits",
        });
      }

      try {
        const hashedPassword = await hashPassword(password);

        const user = await ctx.db.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            role: Roles.USER,
          },
        });

        return user;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Fehler beim Erstellen des Benutzers",
        });
      }
    }),

  update: protectedProcedure
    .input(userSchema.extend({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userRole = ctx.session.user.role;

      if (userRole !== Roles.SUPERADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Keine Berechtigung zum Bearbeiten von Benutzern",
        });
      }

      const { id, name, email, password, passwordConfirmation } = input;

      if (password !== passwordConfirmation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwörter stimmen nicht überein",
        });
      }

      const existingUser = await ctx.db.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Benutzer nicht gefunden",
        });
      }

      const conflictUser = await ctx.db.user.findFirst({
        where: {
          OR: [{ email }],
          NOT: {
            id,
          },
        },
      });

      if (conflictUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "Benutzer mit dieser E-Mail oder diesem Benutzernamen existiert bereits",
        });
      }

      try {
        const updateData: Partial<
          Omit<User, "role" | "orders"> & { password?: string }
        > = {
          name,
          email,
        };

        if (password && password.trim() !== "") {
          updateData.password = await hashPassword(password);
        }

        const user = await ctx.db.user.update({
          where: { id },
          data: updateData,
        });

        return user;
      } catch (error) {
        console.error("Error updating user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Fehler beim Bearbeiten des Benutzers",
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userRole = ctx.session.user.role;

      if (userRole !== Roles.SUPERADMIN) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Keine Berechtigung zum Löschen von Benutzern",
        });
      }

      const { id } = input;

      const existingUser = await ctx.db.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Benutzer nicht gefunden",
        });
      }

      try {
        const user = await ctx.db.user.delete({
          where: { id },
        });

        return user;
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Fehler beim Löschen des Benutzers",
        });
      }
    }),
});
