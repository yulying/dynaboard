import Router from "express-promise-router";
import { verifyToken } from "../middleware/authJwt.js";
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
} from "../controllers/googleAPIController.js";

const router = new Router({ mergeParams: true });

router.get("/:file_id/contents", [verifyToken], getAllFormContents);
router.get("/:file_id/responses", [verifyToken], getAllFormResponses);
router.get("/:file_id/questions", [verifyToken], getAllFormQuestions);
router.get(
    "/:file_id/question_responses/:question_id/respondent/:respondent_type",
    [verifyToken],
    getFormQuestionResponses,
);

router.get("/section/:id", [verifyToken], getDataWithSectionId);
router.get("/:file_id", [verifyToken], getDataWithGoogleId);

router.post("/:id", [verifyToken], createNewData);
router.post(
    "/:id/file/:file_id/type/:google_type",
    [verifyToken],
    createWithData,
);

router.put(
    "/:id/file/:file_id/display/:display_type",
    [verifyToken],
    updateDataDisplay,
);
router.put(
    "/:id/file/:file_id/question/:question_id/title/:title",
    [verifyToken],
    updateDataQuestion,
);
router.put(
    "/:id/file/:file_id/type/:google_type",
    [verifyToken],
    updateGoogleFile,
);

router.delete("/section/:id", [verifyToken], deleteData);

export default router;
