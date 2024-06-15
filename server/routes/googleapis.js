import Router from "express-promise-router";
import {
    getAllFormContents,
    getAllFormResponses,
    getAllFormQuestions,
    getFormQuestionResponses,
    getDataWithSectionId,
    getDataWithGoogleId,
    createNewData,
    createWithData,
    updateDataDisplay,
    updateDataQuestion,
    updateGoogleFile,
    deleteData,
} from "../controllers/googleApiController.js";

const router = new Router();

router.get("/:file_id/contents", getAllFormContents);
router.get("/:file_id/responses", getAllFormResponses);
router.get("/:file_id/questions", getAllFormQuestions);
router.get(
    "/:file_id/question_responses/:question_id/respondent/:respondent_type",
    getFormQuestionResponses,
);

router.get("/section/:id", getDataWithSectionId);
router.get("/:file_id", getDataWithGoogleId);

router.post("/:id", createNewData);
router.post("/:id/file/:file_id/type/:google_type", createWithData);

router.put("/:id/file/:file_id/display/:display_type", updateDataDisplay);
router.put(
    "/:id/file/:file_id/question/:question_id/title/:title",
    updateDataQuestion,
);
router.put("/:id/file/:file_id/type/:google_type", updateGoogleFile);

router.delete("/section/:id", deleteData);

export default router;
