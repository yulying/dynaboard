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

router.get("/section/:section_id", [verifyToken], getDataWithSectionId);
router.get("/:file_id", [verifyToken], getDataWithGoogleId);

router.post("/:section_id", [verifyToken], createNewData);
router.post(
    "/:section_id/file/:file_id/type/:file_type",
    [verifyToken],
    createWithData,
);

router.put(
    "/:section_id/file/:file_id/display/:display_type",
    [verifyToken],
    updateDataDisplay,
);
router.put(
    "/:section_id/file/:file_id/question/:question_id/title/:title",
    [verifyToken],
    updateDataQuestion,
);
router.put(
    "/:section_id/file/:file_id/type/:file_type",
    [verifyToken],
    updateGoogleFile,
);

router.delete("/section/:section_id", [verifyToken], deleteData);

export default router;
