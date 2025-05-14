import { Hono } from "hono";

import { selectUser, updateUser } from "./services";
import { zValidator } from "../../(utils)";
import { updateUserRequestSchema } from "./validators";

const userRoute = new Hono()
  .get("/", async (c) => {
    const selectedUser = await selectUser();
    if (!selectedUser) {
      return c.json({
        geminiKey: "",
        resumeContent: "",
      });
    }

    return c.json(selectedUser, 200);
  })
  .put("/", zValidator("json", updateUserRequestSchema), async (c) => {
    const payload = c.req.valid("json");

    await updateUser(payload);

    return c.json({ message: "User is updated successfully" }, 200);
  });

export default userRoute;
