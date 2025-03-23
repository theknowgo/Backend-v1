import helpAndSupport from "../models/helpAndSupport.js";
import { createResponse } from "../utils/helpers.js";

const create = async (req, res) => {
  try {
    const { userID, title, description } = req.body;

    if (!userID || !title || !description) {
      return res
        .status(400)
        .send(createResponse(false, "Content can not be empty!"));
    }

    const help = new helpAndSupport(req.body);

    const data = await help.save();
    res.status(200).send(createResponse(true, data));
  } catch (err) {
    res
      .status(500)
      .send(
        createResponse(
          false,
          err.message ||
            "Some error occurred while creating the helpAndSupport."
        )
      );
  }
};

const findAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const data = await helpAndSupport
      .find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await helpAndSupport.countDocuments();
    console.log(data.length);
    if (data.length > 0) {
      res.status(200).send({
        status: true,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        data,
        message: "Help and support fetched successfully",
      });
    } else {
      return res
        .status(400)
        .send(
          createResponse(false, "There is no help and support in this page.")
        );
    }
  } catch (err) {
    res
      .status(500)
      .send(
        createResponse(
          false,
          err.message || "Some error occurred while retrieving helpAndSupport."
        )
      );
  }
};

const findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await helpAndSupport.findById(id);

    if (!data) {
      return res
        .status(404)
        .send(createResponse(false, `HelpAndSupport with id ${id} not found`));
    }

    res.status(200).send(createResponse(true, "HelpAndSupport Found", data));
  } catch (err) {
    res
      .status(500)
      .send(
        createResponse(
          false,
          err.message || "Some error occurred while retrieving helpAndSupport."
        )
      );
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const { userID, status, title, description } = req.body;

    if (!userID || !status || !title || !description) {
      return res
        .status(400)
        .send(createResponse(false, "Content can not be empty!"));
    }

    const data = await helpAndSupport.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      {
        useFindAndModify: false,
      }
    );

    if (!data) {
      return res
        .status(404)
        .send(createResponse(false, `HelpAndSupport with id ${id} not found`));
    }

    res
      .status(200)
      .send(createResponse(true, "HelpAndSupport was updated successfully."));
  } catch (err) {
    res
      .status(500)
      .send(
        createResponse(
          false,
          err.message || "Some error occurred while updating helpAndSupport."
        )
      );
  }
};

const close = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await helpAndSupport.findByIdAndUpdate(
      id,
      { status: "Closed", closedAt: Date.now() },
      {
        useFindAndModify: false,
      }
    );

    if (!data) {
      return res
        .status(404)
        .send(createResponse(false, `HelpAndSupport with id ${id} not found`));
    }
    res
      .status(200)
      .send(createResponse(true, "HelpAndSupport was closed successfully."));
  } catch (err) {
    res
      .status(500)
      .send(
        createResponse(
          false,
          err.message || "Some error occurred while updating helpAndSupport."
        )
      );
  }
};

const findAllByUser = async (req, res) => {
  try {
    const userID = req.params.userid;
    const data = await helpAndSupport.find({ userID });

    if (data.length == 0) {
      return res
        .status(404)
        .send(
          createResponse(
            false,
            `HelpAndSupport with userID ${userID} not found`
          )
        );
    }

    res.status(200).send(createResponse(true, "Found successfully", data));
  } catch (err) {
    res
      .status(500)
      .send(
        createResponse(
          false,
          err.message || "Some error occurred while retrieving helpAndSupport."
        )
      );
  }
};

export default { create, findAll, findOne, update, close, findAllByUser };
