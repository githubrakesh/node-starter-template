import express from "express";
import {errorHandler} from "../util/error-handler.util";
import {RouteNotFoundException} from "../exceptions/commons/route-not-found.exception";
import {TestController} from "../controllers/test.controller";
import {fileUpload} from "../services/factories/file-upload.service";

const router = express.Router();

router.get("/", errorHandler((req, res) => {
  res.render('index.pug')
}));

router.get("/test", errorHandler(TestController.test));

router.post("/validation-test", errorHandler(TestController.validationTest));

router.post("/upload", fileUpload.single("file"), errorHandler(TestController.fileUploadTest));

router.all("*", errorHandler((req, res) => {
  throw new RouteNotFoundException();
}));

export const apiRoutes = router;
