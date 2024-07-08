const Address = require("../models/address.model");

const getAllAddress = async (req, res) => {
  const user = req.user;
  try {
    const address = await Address.find({ userId: user.id });
    return res.json({ error: false, address });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

const createAddress = async (req, res) => {
  const {
    name,
    lastName,
    tel,
    address,
    subDistrict,
    district,
    province,
    zipCode,
  } = req.body;
  const user = req.user;

  if (!name || !lastName || !tel || !address || !subDistrict || !district) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide all fields" });
  }

  try {
    const newAddress = new Address({
      name,
      lastName,
      tel,
      address,
      subDistrict,
      district,
      province,
      zipCode,
      userId: user.id,
    });

    await newAddress.save();

    return res.json({
      error: false,
      newAddress,
      message: "Address created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: `Internal Server Error ${error}`,
    });
  }
};

const updateAddress = async (req, res) => {
  const addressId = req.params.addressId;
  const {
    name,
    lastName,
    tel,
    address,
    subDistrict,
    district,
    province,
    zipCode,
  } = req.body;
  const user = req.user;

  if (
    !name &&
    !lastName &&
    !tel &&
    !address &&
    !subDistrict &&
    !district &&
    !province &&
    !zipCode
  ) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const address = await Address.findOne({
      _id: addressId,
      userId: user.id,
    });

    if (!address) {
      return res
        .status(404)
        .json({ error: true, message: "Address not found" });
    }

    address.name = name || address.name;
    address.lastName = lastName || address.lastName;
    address.tel = tel || address.tel;
    address.address = address || address.address;
    address.subDistrict = subDistrict || address.subDistrict;
    address.district = district || address.district;
    address.province = province || address.province;
    address.zipCode = zipCode || address.zipCode;

    await address.save();
    return res.json({ error: false, message: "Address updated successfully" });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

const deleteAddress = async (req, res) => {
  const addressId = req.params.addressId;
  const user = req.user;

  try {
    const address = await Address.findOne();

    if (!address) {
      return res
        .status(404)
        .json({ error: true, message: "Address not found" });
    }

    await Address.deleteOne({ _id: addressId, userId: user.id });

    return res.json({
      error: false,
      message: "Address deleted successfully",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllAddress,
  createAddress,
  updateAddress,
  deleteAddress,
};
