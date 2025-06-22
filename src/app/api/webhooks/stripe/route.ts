import { JsonValue } from "@/generated/prisma/runtime/library";
import { client } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import stripe, { Stripe } from "stripe";

type METADATA = {
  userId: string;
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const sig = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ message: "Webhook error", error: err });
  }

  const eventType = event.type;

  if (eventType === "checkout.session.completed") {
    const session = event.data.object;

    if (session.mode === "subscription") {
      const metadata = session.metadata as METADATA;
      const customerId = session.customer as string;

      const buyer = await client.user.update({
        where: {
          id: metadata.userId,
        },
        data: {
          subscription: true,
          stripeCustomerId: customerId,
        },
      });

      if (!buyer) {
        return Response.json({
          message: "Cannot update the subscription",
          status: 404,
        });
      }
      return Response.json({
        data: buyer,
        status: 200,
      });
    }

    if (session.mode === "payment") {
      const projectId = (session.metadata as any).projectId as string;
      const buyerId = (session.metadata as any).buyerId as string;

      const project = await client.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        return Response.json({
          status: 404,
        });
      }

      const updatedProject = await client.project.update({
        where: {
          id: projectId,
        },
        data: {
          Purchasers: {
            connect: {
              id: buyerId,
            },
          },
        },
      });

      const createdProject = await client.project.create({
        data: {
          title: updatedProject.title,
          outlines: updatedProject.outlines,
          slides: (updatedProject.slides as JsonValue) || {},
          themeName: updatedProject.themeName,
          userId: buyerId,
          thumbnail: updatedProject.thumbnail,
        },
      });

      return Response.json({
        data: createdProject,
        status: 200,
      });
    }
  } else if (eventType === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    const customer = await client.user.findFirst({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!customer) {
      return NextResponse.json({
        message: "Customer Id matched not found!",
        status: 404,
      });
    }

    const updatedCustomer = await client.user.update({
      where: {
        stripeCustomerId: customerId,
      },
      data: {
        subscription: false,
        stripeCustomerId: null,
      },
    });

    if (!updatedCustomer) {
      return NextResponse.json({
        message: "Failed to updated the customer!",
        status: 400,
      });
    }

    return NextResponse.json({
      status: 200,
      data: updatedCustomer,
    });
  }

  return new Response("", { status: 200 });
}
