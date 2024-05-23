import { noteIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";
import { error } from "console";

//Create
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parseResult = createNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;

    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNotes(title, content);

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });
      

      await noteIndex.upsert([
        
        {
          id: note.id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return note;
    });
    return Response.json({ note }, { status: 201 });
   
  } catch (error) {
    console.error("This is from transaction try" ,error);
    return Response.json({ error: "Internal Serval error" }, { status: 500 });
  }
}

//Update

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { id, title, content } = parseResult.data;
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const embedding = await getEmbeddingForNotes(title, content);

    const updateNote = await prisma.$transaction(async (tx) => {
      const updateNote = await prisma.note.update({
        where: { id },
        data: {
          title,
          content,
        },
      });

      await noteIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId },
        },
      ]);
      return updateNote;
    });
    
    return Response.json({ updateNote }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Serval error" }, { status: 500 });
  }
}

//Delete

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({ error: "Invalid Input" }, { status: 400 });
    }

    const { id } = parseResult.data;
    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    const { userId } = auth();

    if (!userId || userId !== note.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    await prisma.$transaction(async (tx) =>{
      await prisma.note.delete({ where: { id } });
      await noteIndex.deleteOne(id)
    })
   
    return Response.json({ message: "Note Deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Serval error" }, { status: 500 });
  }
}

//Embedding

async function getEmbeddingForNotes(
  title: string,
  content: string | undefined,
) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
