import Router from "express-promise-router";
import {
    getAllFormContents,
    getAllFormResponses,
    getAllFormQuestions,
    getFormQuestionResponses,
    getDataWithSectionId,
    getDataWithGoogleId,
    createData,
    updateDataDisplay,
    updateGoogleId,
    deleteData,
} from "../controllers/googleApiController.js";

const router = new Router();

router.get("/:form_id/contents", getAllFormContents);
router.get("/:form_id/responses", getAllFormResponses);
router.get("/:form_id/questions", getAllFormQuestions);
router.get(
    "/:form_id/question_responses/:question_id/respondent/:respondent_type",
    getFormQuestionResponses,
);

router.get("/api/:id", getDataWithSectionId);
router.get("/api/google_id/:google_id", getDataWithGoogleId);

router.post("/api/:id/google_id/:google_id/type/:google_type", createData);

router.put(
    "/api/:id/google_id/:google_id/display/:display_type",
    updateDataDisplay,
);
router.put("/api/:id/google_id/:google_id", updateGoogleId);

router.delete("/api/:id", deleteData);

export default router;
