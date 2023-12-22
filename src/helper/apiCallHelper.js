import { del, patch, put } from "../config/axios";

export const deleteAPI = async (url) => {
  try {
    const res = await del(`${url}`);
    return res?.message;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};

export const updateAPI = async (url, data) => {
  try {
    const res = await put(`${url}`, data);
    return res?.message;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};

export const patchAPI = async (url, data) => {
  try {
    const res = await patch(`${url}`, data);
    return res?.message;
  } catch (err) {
    console.log("err", err);
    throw err;
  }
};

