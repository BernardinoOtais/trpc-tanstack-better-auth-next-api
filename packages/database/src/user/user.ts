import { LoginDto, CriaUserComValidacaoPasswordDto } from "@repo/tipos/user";
import { UserDto } from "@repo/tipos/user";

import { PrismaClientKnownRequestError } from "../generated/envios/runtime/library";
import { prismaEnvios } from "../services/client-envios";

export const devolveUser = async (nomeUser: string) => {
  return await prismaEnvios.user.findUnique({
    where: { nomeUser },
    include: {
      UserPapeis: { select: { Papeis: { select: { descPapel: true } } } },
    },
  });
};

export const guardaHashedRefreshToken = async (
  nomeUser: string,
  hashedRefreshToken: string
) => {
  await prismaEnvios.user.update({
    where: { nomeUser },
    data: { hashedRefreshToken },
  });
};

export const updateUsersPasword = async (nomeUser: string, pHashed: string) => {
  await prismaEnvios.user.update({
    where: { nomeUser },
    data: { pHashed },
  });
};

export async function createUserInDb(payload: CriaUserComValidacaoPasswordDto) {
  try {
    const pHashed = "await hashPassword(payload.password)";
    return await prismaEnvios.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          nomeUser: payload.nomeUser,
          pHashed,
          nome: payload.nome,
          apelido: payload.apelido,
          email: payload.email,
          updatedAt: new Date(),
        },
      });

      await tx.userPapeis.createMany({
        data: payload.papeis.map((papel) => ({
          idPapel: papel,
          nomeUser: payload.nomeUser,
        })),
      });

      return user;
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002" && Array.isArray(err.meta?.target)) {
        const targets = err.meta.target;
        if (targets.includes("nomeUser") || targets.includes("email")) {
        }
      }
    }

    throw err;
  }
}

export async function loginUserInDb(payload: LoginDto) {
  const user = await prismaEnvios.user.findUnique({
    where: { nomeUser: payload.nomeUser },
    include: {
      UserPapeis: {
        select: {
          idPapel: true,
          Papeis: {
            select: { descPapel: true },
          },
        },
      },
    },
  });

  if (!user) {
  }

  const isValidPassword = true;
  if (!isValidPassword) {
  }

  return user;
}

export const getPapeisDb = async () => {
  const papeisDb = await prismaEnvios.papeis.findMany();

  return {
    papeis: papeisDb.map((papel) => ({
      idPapel: papel.idPapel,
      descricao: papel.descPapel,
    })),
  };
};
