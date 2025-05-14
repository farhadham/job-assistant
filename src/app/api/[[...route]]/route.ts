import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";
import jobPostingRoute from "../(routes)/job-posting";
import userRoute from "../(routes)/user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const app = new Hono().basePath("/api");

app.route("/job-posting", jobPostingRoute);
app.route("/user", userRoute);

app.onError((err, c) => {
  console.log(err);
  if (err instanceof HTTPException) {
    if (err.status >= 500) {
      return c.json({ error: "Internal Server Error" }, 500);
    }
    return c.json({ error: err.message }, err.status);
  }
  return c.json({ error: "Internal Server Error" }, 500);
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
